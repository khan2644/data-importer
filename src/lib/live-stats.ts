import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type SiteStats = { visits: number; orders: number };

const VISIT_FLAG = "msdelight-visit-counted";

/**
 * Live site counters:
 *  - `online`  : people on the site right now (realtime presence)
 *  - `visits`  : total visits ever (one per browser session)
 *  - `orders`  : total orders placed through the site
 */
export function useLiveStats() {
  const [stats, setStats] = useState<SiteStats>({ visits: 0, orders: 0 });
  const [online, setOnline] = useState(1);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;

    async function boot() {
      let counted = true;
      try {
        counted = sessionStorage.getItem(VISIT_FLAG) === "1";
      } catch {
        /* ignore */
      }

      if (!counted) {
        try {
          sessionStorage.setItem(VISIT_FLAG, "1");
        } catch {
          /* ignore */
        }
        const { data } = await supabase.rpc("bump_visit");
        const row = Array.isArray(data) ? data[0] : data;
        if (active && row) setStats({ visits: Number(row.visits), orders: Number(row.orders) });
      } else {
        const { data } = await supabase
          .from("site_stats")
          .select("visits, orders")
          .eq("id", "global")
          .maybeSingle();
        if (active && data) setStats({ visits: Number(data.visits), orders: Number(data.orders) });
      }
      if (active) setReady(true);
    }

    void boot();

    const channelSuffix = Math.random().toString(36).slice(2, 10);
    const statsChannel = supabase
      .channel(`site-stats-changes-${channelSuffix}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "site_stats" },
        (payload) => {
          const row = payload.new as { visits: number; orders: number };
          if (active) setStats({ visits: Number(row.visits), orders: Number(row.orders) });
        },
      )
      .subscribe();

    const presenceKey = `guest-${Math.random().toString(36).slice(2, 10)}`;
    const presenceChannel = supabase.channel(`site-presence`, {
      config: { presence: { key: presenceKey } },
    });

    presenceChannel
      .on("presence", { event: "sync" }, () => {
        const count = Object.keys(presenceChannel.presenceState()).length;
        if (active) setOnline(Math.max(1, count));
      })
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          void presenceChannel.track({ at: Date.now() });
        }
      });

    return () => {
      active = false;
      void supabase.removeChannel(statsChannel);
      void supabase.removeChannel(presenceChannel);
    };
  }, []);

  return { ...stats, online, ready };
}

/** Called once when a customer places an order. */
export async function recordOrder() {
  try {
    await supabase.rpc("bump_order");
  } catch {
    /* counters are best-effort */
  }
}
