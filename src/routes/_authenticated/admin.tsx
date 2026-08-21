import { useCallback, useEffect, useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  BadgeIndianRupee,
  LogOut,
  MapPin,
  Package,
  RefreshCw,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ORDER_STATUSES, type OrderRow } from "@/lib/orders";
import { useLiveStats } from "@/lib/live-stats";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Orders Dashboard — Ms Delight Admin" },
      { name: "description", content: "Live orders, revenue and delivery-area insights for Ms Delight." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Orders Dashboard — Ms Delight Admin" },
      { property: "og:description", content: "Manage every Ms Delight order in one place." },
    ],
  }),
  component: AdminPage,
});

const RANGES = [
  { key: "today", label: "Today" },
  { key: "7d", label: "7 days" },
  { key: "30d", label: "30 days" },
  { key: "all", label: "All" },
] as const;
type RangeKey = (typeof RANGES)[number]["key"];

function money(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

function AdminPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { online, visits, orders: totalOrderCount } = useLiveStats();

  const [rows, setRows] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [denied, setDenied] = useState(false);
  const [range, setRange] = useState<RangeKey>("7d");

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) {
      setDenied(true);
      setRows([]);
    } else {
      setDenied(false);
      setRows((data ?? []) as unknown as OrderRow[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const ch = supabase
      .channel(`admin-orders-${Math.random().toString(36).slice(2, 8)}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => {
        void load();
      })
      .subscribe();
    return () => {
      void supabase.removeChannel(ch);
    };
  }, [load]);

  async function claimAdmin() {
    const { data, error } = await supabase.rpc("claim_admin");
    if (error || !data) {
      toast.error("Admin access is already assigned to another account.");
      return;
    }
    toast.success("You are the admin now!");
    void load();
  }

  async function setStatus(id: string, status: string) {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) toast.error("Could not update status");
    else void load();
  }

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    void navigate({ to: "/auth", replace: true });
  }

  const filtered = useMemo(() => {
    if (range === "all") return rows;
    const days = range === "today" ? 1 : range === "7d" ? 7 : 30;
    const from =
      range === "today"
        ? new Date(new Date().setHours(0, 0, 0, 0)).getTime()
        : Date.now() - days * 86400000;
    return rows.filter((r) => new Date(r.created_at).getTime() >= from);
  }, [rows, range]);

  const revenue = filtered.reduce((s, r) => s + r.total, 0);
  const avg = filtered.length ? Math.round(revenue / filtered.length) : 0;

  const byArea = useMemo(() => {
    const map = new Map<string, { count: number; total: number }>();
    for (const r of filtered) {
      const k = r.area || "Unknown";
      const cur = map.get(k) ?? { count: 0, total: 0 };
      map.set(k, { count: cur.count + 1, total: cur.total + r.total });
    }
    return [...map.entries()].sort((a, b) => b[1].count - a[1].count);
  }, [filtered]);

  const topDishes = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of filtered)
      for (const i of r.items ?? []) map.set(i.name, (map.get(i.name) ?? 0) + i.qty);
    return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
  }, [filtered]);

  const maxArea = byArea[0]?.[1].count ?? 1;

  return (
    <main className="mx-auto max-w-6xl px-4 pt-6 pb-28 md:pb-14">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[0.7rem] font-bold tracking-widest text-muted-foreground uppercase">
            Kitchen control
          </p>
          <h1 className="font-display text-3xl font-black text-primary">Orders Dashboard</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => void load()}
            className="rounded-full border border-border p-2.5 text-muted-foreground"
            aria-label="Refresh"
          >
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => void signOut()}
            className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-primary"
          >
            <LogOut className="size-4" /> Sign out
          </button>
        </div>
      </div>

      {denied && (
        <div className="mt-5 rounded-3xl border border-border/70 bg-card p-5 text-center shadow-[var(--shadow-card)]">
          <ShieldCheck className="mx-auto size-8 text-gold" />
          <p className="mt-2 font-display text-lg font-bold text-primary">Admin access needed</p>
          <p className="mt-1 text-sm text-muted-foreground">
            This account is signed in but not marked as admin yet. If you are the owner, claim it
            once — after that nobody else can.
          </p>
          <button
            onClick={() => void claimAdmin()}
            className="gold-ring mt-4 rounded-full px-6 py-2.5 text-sm font-bold text-accent-foreground"
          >
            Claim admin access
          </button>
        </div>
      )}

      {!denied && (
        <>
          <div className="mt-5 flex flex-wrap gap-2">
            {RANGES.map((r) => (
              <button
                key={r.key}
                onClick={() => setRange(r.key)}
                className={`rounded-full px-4 py-1.5 text-xs font-bold transition-colors ${
                  range === r.key
                    ? "bg-primary text-primary-foreground"
                    : "border border-border text-muted-foreground"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Stat icon={Package} label="Orders" value={String(filtered.length)} />
            <Stat icon={BadgeIndianRupee} label="Revenue" value={money(revenue)} />
            <Stat icon={TrendingUp} label="Avg order" value={money(avg)} />
            <Stat
              icon={MapPin}
              label="Areas served"
              value={String(byArea.length)}
              sub={`${online} online · ${visits} visits · ${totalOrderCount} lifetime`}
            />
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <Card title="Orders by area">
              {byArea.length === 0 && <Empty />}
              <div className="space-y-3">
                {byArea.slice(0, 8).map(([area, v]) => (
                  <div key={area}>
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold text-primary">{area}</span>
                      <span className="text-muted-foreground">
                        {v.count} · {money(v.total)}
                      </span>
                    </div>
                    <div className="mt-1 h-2 rounded-full bg-secondary">
                      <div
                        className="h-2 rounded-full bg-gold"
                        style={{ width: `${Math.round((v.count / maxArea) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Top selling items">
              {topDishes.length === 0 && <Empty />}
              <ul className="space-y-2">
                {topDishes.map(([name, qty], idx) => (
                  <li key={name} className="flex items-center gap-3 text-sm">
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-secondary text-[0.7rem] font-bold text-primary">
                      {idx + 1}
                    </span>
                    <span className="flex-1 truncate font-semibold text-primary">{name}</span>
                    <span className="text-muted-foreground">{qty} sold</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <Card title={`Recent orders (${filtered.length})`} className="mt-4">
            {filtered.length === 0 && <Empty />}
            <div className="space-y-3">
              {filtered.slice(0, 50).map((o) => (
                <div key={o.id} className="rounded-2xl border border-border/60 bg-secondary/40 p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-display text-sm font-bold text-primary">
                        #{o.code} · {o.customer_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(o.created_at).toLocaleString("en-IN")} · {o.source}
                      </p>
                    </div>
                    <p className="font-display text-lg font-black text-primary">{money(o.total)}</p>
                  </div>

                  <p className="mt-2 text-xs text-muted-foreground">
                    {(o.items ?? []).map((i) => `${i.qty}× ${i.name}`).join(", ")}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    <MapPin className="mr-1 inline size-3" />
                    {o.area} · {o.pincode} · {o.address}
                    {o.landmark ? `, near ${o.landmark}` : ""}
                  </p>

                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <a
                      href={`tel:${o.phone}`}
                      className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-primary"
                    >
                      Call {o.phone}
                    </a>
                    <select
                      value={o.status}
                      onChange={(e) => void setStatus(o.id, e.target.value)}
                      className="rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold text-primary"
                    >
                      {ORDER_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </main>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: typeof Package;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-3xl border border-border/70 bg-card p-4 shadow-[var(--shadow-card)]">
      <div className="flex items-center gap-3">
        <span className="gold-ring grid size-10 shrink-0 place-items-center rounded-2xl text-accent-foreground">
          <Icon className="size-4" />
        </span>
        <div className="min-w-0">
          <p className="font-display text-2xl leading-none font-black text-primary">{value}</p>
          <p className="mt-1 text-[0.7rem] font-semibold tracking-wide text-muted-foreground uppercase">
            {label}
          </p>
        </div>
      </div>
      {sub && <p className="mt-2 truncate text-[0.7rem] text-muted-foreground">{sub}</p>}
    </div>
  );
}

function Card({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-3xl border border-border/70 bg-card p-5 shadow-[var(--shadow-card)] ${className}`}
    >
      <h2 className="font-display text-lg font-bold text-primary">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function Empty() {
  return <p className="py-6 text-center text-sm text-muted-foreground">No orders yet.</p>;
}
