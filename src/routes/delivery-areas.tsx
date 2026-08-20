import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, MapPin, Search, XCircle } from "lucide-react";
import { SectionTitle } from "@/components/brand";
import { LiveStats } from "@/components/live-stats";
import { AHMEDABAD_AREAS, AHMEDABAD_PINCODES } from "@/lib/ahmedabad";
import { BRAND } from "@/lib/menu";

export const Route = createFileRoute("/delivery-areas")({
  head: () => ({
    meta: [
      { title: "Ahmedabad Delivery Areas & PIN Codes — Ms Delight Cloud Kitchen" },
      {
        name: "description",
        content:
          "Check if we deliver to your Ahmedabad area. Full list of serviceable Ahmedabad PIN codes — Satellite, Bopal, Maninagar, Naroda, Chandkheda and more.",
      },
      { property: "og:title", content: "Ahmedabad Delivery Areas — Ms Delight Cloud Kitchen" },
      {
        property: "og:description",
        content: "Search your area or PIN code and see if Ms Delight delivers to you in Ahmedabad.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DeliveryAreasPage,
});

const ZONES = ["All", "West", "East", "North", "South", "Central"] as const;

function DeliveryAreasPage() {
  const [q, setQ] = useState("");
  const [zone, setZone] = useState<(typeof ZONES)[number]>("All");

  const query = q.trim().toLowerCase();

  const results = useMemo(
    () =>
      AHMEDABAD_AREAS.filter(
        (a) =>
          (zone === "All" || a.zone === zone) &&
          (query === "" ||
            a.area.toLowerCase().includes(query) ||
            a.pincode.includes(query)),
      ),
    [query, zone],
  );

  const pinLookup = /^\d{6}$/.test(query) ? AHMEDABAD_PINCODES.includes(query) : null;

  return (
    <main className="mx-auto max-w-6xl space-y-10 px-5 py-12">
      <header className="space-y-3 text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-1.5 text-[0.65rem] font-bold tracking-[0.25em] text-primary-foreground uppercase">
          <MapPin className="size-3" /> Ahmedabad · Gujarat
        </span>
        <SectionTitle kicker="Where we deliver" title="Delivery Areas & PIN Codes" />
        <p className="mx-auto max-w-xl text-sm text-muted-foreground">
          We deliver hot, freshly cooked food across {AHMEDABAD_AREAS.length}+ Ahmedabad
          neighbourhoods and {AHMEDABAD_PINCODES.length} PIN codes. Search yours below.
        </p>
      </header>

      <LiveStats />

      <div className="space-y-4">
        <label className="relative block">
          <Search className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search area or 6-digit PIN code (e.g. Bopal or 380058)"
            className="w-full rounded-full border border-border bg-card py-3.5 pr-4 pl-11 text-sm outline-none transition-colors focus:border-primary"
          />
        </label>

        <div className="flex flex-wrap justify-center gap-2">
          {ZONES.map((z) => (
            <button
              key={z}
              onClick={() => setZone(z)}
              className={`rounded-full border px-4 py-1.5 text-xs font-bold transition-colors ${
                zone === z
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:text-primary"
              }`}
            >
              {z === "All" ? "All zones" : `${z} Ahmedabad`}
            </button>
          ))}
        </div>

        {pinLookup !== null && (
          <div
            className={`flex items-center justify-center gap-2 rounded-2xl border p-3 text-sm font-semibold ${
              pinLookup
                ? "border-primary/40 bg-secondary text-primary"
                : "border-destructive/40 text-destructive"
            }`}
          >
            {pinLookup ? (
              <>
                <CheckCircle2 className="size-4" /> Yes! We deliver to {query}.
              </>
            ) : (
              <>
                <XCircle className="size-4" /> Sorry, {query} is outside our Ahmedabad zone.
              </>
            )}
          </div>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((a) => (
          <div
            key={`${a.area}-${a.pincode}`}
            className="flex items-center justify-between gap-3 rounded-2xl border border-border/70 bg-card px-4 py-3 shadow-[var(--shadow-card)]"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-primary">{a.area}</p>
              <p className="text-[0.7rem] text-muted-foreground">{a.zone} Ahmedabad</p>
            </div>
            <span className="gold-ring rounded-full px-3 py-1 text-xs font-bold text-accent-foreground">
              {a.pincode}
            </span>
          </div>
        ))}
        {results.length === 0 && (
          <p className="col-span-full py-10 text-center text-sm text-muted-foreground">
            No matching area. Call {BRAND.phone} and we'll check for you.
          </p>
        )}
      </div>

      <div className="rounded-3xl border border-border/70 bg-card p-6 text-center shadow-[var(--shadow-card)]">
        <p className="font-display text-lg font-bold text-primary">Your area is covered?</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Add your favourites and place the order — then follow it live on the tracking page.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <Link
            to="/menu"
            className="gold-ring rounded-full px-6 py-3 text-sm font-bold text-accent-foreground"
          >
            Browse Menu
          </Link>
          <Link
            to="/order-status"
            className="rounded-full border border-primary px-6 py-3 text-sm font-bold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            Track Your Order
          </Link>
        </div>
      </div>
    </main>
  );
}
