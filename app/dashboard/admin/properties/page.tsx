"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Property = {
  id: string;
  name: string;
};

type InfluencerProperty = {
  property_id: string;
};

export default function InfluencerPropertiesPage() {

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const [influencerId, setInfluencerId] = useState<string | null>(null);

  const [stats, setStats] = useState<any>({});

  useEffect(() => {
    loadInfluencer();
  }, []);

  const loadInfluencer = async () => {

    const { data: user } = await supabase.auth.getUser();

    if (!user?.user?.email) return;

    const { data: influencer } = await supabase
      .from("influencers")
      .select("*")
      .eq("email", user.user.email)
      .single();

    if (!influencer) return;

    setInfluencerId(influencer.id);

    loadProperties(influencer.id);
  };

  const loadProperties = async (infId: string) => {

    setLoading(true);

    const { data: assignments } = await supabase
      .from("influencer_properties")
      .select("property_id")
      .eq("influencer_id", infId);

    if (!assignments || assignments.length === 0) {
      setLoading(false);
      return;
    }

    const propertyIds = assignments.map((a: InfluencerProperty) => a.property_id);

    const { data: props } = await supabase
      .from("properties")
      .select("id,name")
      .in("id", propertyIds);

    setProperties(props || []);

    loadStats(propertyIds, infId);

    setLoading(false);
  };

  const loadStats = async (propertyIds: string[], infId: string) => {

    const { data: clicks } = await supabase
      .from("influencer_clicks")
      .select("*")
      .eq("influencer_id", infId);

    const { data: bookings } = await supabase
      .from("bookings")
      .select("*")
      .eq("influencer_id", infId);

    const propertyStats: any = {};

    propertyIds.forEach(id => {
      propertyStats[id] = {
        clicks: 0,
        bookings: 0,
        revenue: 0
      };
    });

    clicks?.forEach(c => {
      if (propertyStats[c.property_id]) {
        propertyStats[c.property_id].clicks++;
      }
    });

    bookings?.forEach(b => {
      if (propertyStats[b.property_id]) {
        propertyStats[b.property_id].bookings++;
        propertyStats[b.property_id].revenue += b.amount || 0;
      }
    });

    setStats(propertyStats);
  };

  const copyLink = (propertyId: string) => {

    const link = `${window.location.origin}/guest/property/${propertyId}?ref=${influencerId}`;

    navigator.clipboard.writeText(link);

    alert("Referral link copied!");
  };

  if (loading) {

    return (
      <main className="p-10">
        Loading properties...
      </main>
    );
  }

  return (

    <main className="p-10">

      <h1 className="text-3xl font-semibold mb-8">
        My Promotion Properties
      </h1>

      {properties.length === 0 && (
        <div className="text-gray-500">
          No properties assigned yet.
        </div>
      )}

      <div className="space-y-6">

        {properties.map((p) => {

          const propertyStats = stats[p.id] || {
            clicks: 0,
            bookings: 0,
            revenue: 0
          };

          const commission = Math.round(propertyStats.revenue * 0.1);

          const referralLink =
            `${window.location.origin}/guest/property/${p.id}?ref=${influencerId}`;

          return (

            <div
              key={p.id}
              className="border rounded-xl p-6 bg-white shadow-sm"
            >

              <div className="flex justify-between items-start">

                <div>

                  <h2 className="text-xl font-semibold">
                    {p.name}
                  </h2>

                  <div className="text-sm text-gray-500 mt-2">
                    Referral link
                  </div>

                  <div className="text-sm bg-gray-100 px-3 py-2 rounded mt-1 break-all">
                    {referralLink}
                  </div>

                </div>

                <button
                  onClick={() => copyLink(p.id)}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg"
                >
                  Copy Link
                </button>

              </div>

              <div className="grid grid-cols-4 gap-6 mt-6 text-sm">

                <div>
                  <div className="text-gray-500">
                    Clicks
                  </div>
                  <div className="text-lg font-semibold">
                    {propertyStats.clicks}
                  </div>
                </div>

                <div>
                  <div className="text-gray-500">
                    Bookings
                  </div>
                  <div className="text-lg font-semibold">
                    {propertyStats.bookings}
                  </div>
                </div>

                <div>
                  <div className="text-gray-500">
                    Revenue
                  </div>
                  <div className="text-lg font-semibold">
                    ₹{propertyStats.revenue}
                  </div>
                </div>

                <div>
                  <div className="text-gray-500">
                    Commission
                  </div>
                  <div className="text-lg font-semibold text-green-600">
                    ₹{commission}
                  </div>
                </div>

              </div>

            </div>

          );
        })}

      </div>

    </main>

  );
}
