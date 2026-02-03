import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      owner_id,
      name,
      type,
      area_id,
      starting_price,
    } = body;

    if (!owner_id || !name || !type || !area_id || !starting_price) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("properties")
      .insert({
        owner_id,
        name,
        type,
        area_id,
        starting_price,
      })
      .select()
      .single();

    if (error) {
      console.error("CREATE PROPERTY ERROR:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, property: data });
  } catch (err) {
    console.error("UNEXPECTED ERROR:", err);
    return NextResponse.json(
      { error: "Failed to create property" },
      { status: 500 }
    );
  }
}
