import { Eye, ShoppingBag, Users } from "lucide-react";
import { useLiveStats } from "@/lib/live-stats";

function format(n: number) {
  return n.toLocaleString("en-IN");
}

export function LiveStats({ compact = false }: { compact?: boolean }) {
  const { online, visits, orders, ready } = useLiveStats();

  const items = [
    { icon: Users, label: "Live on this page", value: online, live: true },
    { icon: Eye, label: "Total visitors", value: visits, live: false },
    { icon: ShoppingBag, label: "Orders placed", value: orders, live: false },
  ];

  if (compact) {
    return (
      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="live-dot" /> {format(online)} online now
        </span>
        <span>{ready ? format(visits) : "—"} visits</span>
        <span>{ready ? format(orders) : "—"} orders</span>
      </div>
    );
  }

  return (
    <div className="grid gap-3 rounded-3xl border border-border/70 bg-card p-5 shadow-[var(--shadow-card)] sm:grid-cols-3">
      {items.map((i) => (
        <div key={i.label} className="flex items-center gap-3">
          <span className="gold-ring grid size-11 shrink-0 place-items-center rounded-2xl text-accent-foreground">
            <i.icon className="size-5" />
          </span>
          <div className="min-w-0">
            <p className="font-display text-2xl leading-none font-black text-primary">
              {ready || i.live ? format(i.value) : "—"}
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-[0.7rem] font-semibold tracking-wide text-muted-foreground uppercase">
              {i.live && <span className="live-dot" />}
              {i.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
