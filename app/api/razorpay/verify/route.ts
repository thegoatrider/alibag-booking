import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      lead_id,
      amount,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing Razorpay fields" },
        { status: 400 }
      );
    }

    // ✅ 1) Verify Razorpay signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: "Invalid Razorpay signature" },
        { status: 400 }
      );
    }

    // ✅ 2) Fetch lead
    const { data: lead, error: leadError } = await supabase
      .from("leads")
      .select("*")
      .eq("id", lead_id)
      .single();

    if (leadError || !lead) {
      return NextResponse.json(
        { error: "Lead not found" },
        { status: 404 }
      );
    }

    // ✅ 3) Get influencer commission %
    let commissionPercent = 0;

    if (lead.influencer_id) {
      const { data: rule } = await supabase
        .from("influencer_properties")
        .select("commission_percent")
        .eq("influencer_id", lead.influencer_id)
        .eq("property_id", lead.property_id)
        .single();

      commissionPercent = rule?.commission_percent || 0;
    }

    // ✅ 4) Calculate commission
    const commissionAmount = Math.round((amount * commissionPercent) / 100);

    // ✅ 5) Create booking
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .insert({
        property_id: lead.property_id,
        lead_id: lead.id,
        amount,
        razorpay_payment_id,
        influencer_id: lead.influencer_id,
        commission_percent: commissionPercent,
        commission_amount: commissionAmount,
      })
      .select()
      .single();

    if (bookingError) {
      console.error("Booking insert error:", bookingError);
      return NextResponse.json(
        { error: "Booking failed" },
        { status: 500 }
      );
    }

    // ✅ 6) Update lead status → booked
    await supabase
      .from("leads")
      .update({ status: "booked" })
      .eq("id", lead.id);

    return NextResponse.json({
      success: true,
      booking,
      commissionPercent,
      commissionAmount,
    });
  } catch (err) {
    console.error("Razorpay verify error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
