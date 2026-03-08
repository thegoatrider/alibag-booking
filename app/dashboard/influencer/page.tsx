"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Influencer = {
  id: string;
  name: string;
  approved: boolean;
  commission_percent: number;
};

type Property = {
  id: string;
  name: string;
};

type AssignedProperty = {
  property_id: string;
  properties: Property;
};

export default function InfluencerDashboard() {

  const [loading, setLoading] = useState(true);
  const [influencer, setInfluencer] = useState<Influencer | null>(null);
  const [properties, setProperties] = useState<AssignedProperty[]>([]);
  const [clicks, setClicks] = useState(0);
  const [commission, setCommission] = useState(0);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    /* get influencer profile */

  const { data: inf } = await supabase
  .from("influencers")
  .select("*")
  .eq("user_id", user!.id)
  .single();



    if (!inf) {
      setLoading(false);
      return;
    }

    setInfluencer(inf);

    /* get assigned properties */

    const { data: assigned } = await supabase
  .from("influencer_properties")
  .select(`
    property_id,
    properties (
      id,
      name
    )
  `)
  .eq("influencer_id", inf.id);

setProperties((assigned || []) as unknown as AssignedProperty[]);



    /* get click stats */

    const { data: clickData } = await supabase
      .from("influencer_clicks")
      .select("*")
      .eq("influencer_id", inf.id);

    setClicks(clickData?.length || 0);

    /* get commissions */

    const { data: commissionData } = await supabase
      .from("influencer_commissions")
      .select("commission_amount")
      .eq("influencer_id", inf.id);

    const totalCommission =
      commissionData?.reduce(
        (sum, c) => sum + (c.commission_amount || 0),
        0
      ) || 0;

    setCommission(totalCommission);

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="p-10 text-center">
        Loading...
      </div>
    );
  }

  if (!influencer) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-2xl font-semibold">
          Influencer profile not found
        </h1>
        <p className="text-gray-400 mt-2">
          Please apply to become a FixStay influencer.
        </p>
      </div>
    );
  }

  if (!influencer.approved) {
    return (
      <div className="p-10 text-center">

        <h1 className="text-2xl font-semibold">
          Application Under Review
        </h1>

        <p className="text-gray-400 mt-2">
          Our team is reviewing your influencer application.
        </p>

        <p className="text-gray-500 mt-2">
          You will get access to your dashboard once approved.
        </p>

      </div>
    );
  }

  return (

    <div className="p-10 space-y-8">

      <h1 className="text-3xl font-bold">
        Influencer Dashboard
      </h1>

      {/* Influencer Info */}

      <div className="bg-neutral-900 p-6 rounded-xl">

        <h2 className="text-xl font-semibold">
          Welcome {influencer.name}
        </h2>

        <p className="text-gray-400 mt-2">
          Commission rate: {influencer.commission_percent}%
        </p>

      </div>

      {/* Stats */}

      <div className="grid grid-cols-2 gap-6">

        <div className="bg-neutral-900 p-6 rounded-xl">
          <div className="text-gray-400 text-sm">
            Total Clicks
          </div>
          <div className="text-2xl font-semibold">
            {clicks}
          </div>
        </div>

        <div className="bg-neutral-900 p-6 rounded-xl">
          <div className="text-gray-400 text-sm">
            Total Commission Earned
          </div>
          <div className="text-2xl font-semibold">
            ₹{commission}
          </div>
        </div>

      </div>

      {/* Assigned Properties */}

      <div className="space-y-4">

        <h2 className="text-xl font-semibold">
          Assigned Properties
        </h2>

        {properties.length === 0 && (
          <p className="text-gray-400">
            No properties assigned yet.
          </p>
        )}

        {properties.map((p) => {

          const link =
            typeof window !== "undefined"
              ? `${window.location.origin}/guest/property/${p.properties.id}?ref=${influencer.id}`
              : "";

          return (

            <div
              key={p.properties.id}
              className="bg-neutral-900 p-6 rounded-xl space-y-2"
            >

              <div className="font-semibold">
                {p.properties.name}
              </div>

              <div className="text-gray-400 text-sm">
                Referral Link
              </div>

              <div className="bg-black p-2 rounded text-sm break-all">
                {link}
              </div>

            </div>

          );
        })}

      </div>

    </div>

  );
}
