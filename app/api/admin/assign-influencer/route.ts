import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const { influencer_id, property_id, commission_percent } = await req.json();

  const referral_code = crypto
    .randomBytes(6)
    .toString("hex")
    .toUpperCase();

  const { error } = await supabase
    .from("influencer_properties")
    .insert({
      influencer_id,
      property_id,
      commission_percent,
      referral_code,
    });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, referral_code });
}
