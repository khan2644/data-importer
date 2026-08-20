import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Clock, Loader2, MapPin, MessageCircle } from "lucide-react";
import { BRAND } from "@/lib/menu";
import {
  loadOrder,
  minutesSince,
  ORDER_STAGES,
  type PlacedOrder,
} from "@/lib/order";

export const Route = createFileRoute("/order-status")({
  head: () => ({
    meta: [
      { title: "Track Your Order — Ms Delight Cloud Kitchen" },
      {
        name: "description",
        content:
          "See your latest Ms Delight order, the WhatsApp confirmation we sent and your live estimated delivery time.",
      },
      { property: "og:title", content: "Track Your Order — Ms Delight Cloud Kitchen" },
      {
        property: "og:description",
        content: "Live status and estimated delivery time for your Ms Delight order.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: OrderStatusPage,
});

function OrderStatusPage() {
  const [order, setOrder] = useState<PlacedOrder | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const o = loadOrder();
    setOrder(o);
    setReady(true);
    if (!o) return;
    const tick = () => setElapsed(minutesSince(o.placedAt));
    tick();
    const t = setInterval(tick, 15000);
    return () => clearInterval(t);
  }, []);

  if (!ready) {
    return (
      <main className="mx-auto grid min-h-[60vh] max-w-3xl place-items-center px-5">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </main>
    );
  }

  if (!order) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-20 text-center">
        <h1 className="font-display text-3xl font-bold text-primary">No order yet</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Once you place an order on WhatsApp, its live status will appear here.
        </p>
        <Link
          to="/menu"
          className="gold-ring mt-6 inline-block rounded-full px-6 py-3 text-sm font-bold text-accent-foreground"
        >
          Browse the menu
        </Link>
      </main>
    );
  }

  const remaining = Math.max(0, order.etaMinutes - elapsed);
  const eta = new Date(order.placedAt + order.etaMinutes * 60000);

  return (
    <main className="mx-auto max-w-3xl px-5 py-12">
      <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
        Order #{order.id}
      </p>
      <h1 className="font-display text-3xl font-bold text-primary sm:text-4xl">
        {remaining > 0 ? "Your delight is on its way" : "Should be at your door"}
      </h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl bg-secondary/60 p-5">
          <p className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <Clock className="size-4" /> Estimated delivery
          </p>
          <p className="mt-2 font-display text-3xl font-bold text-primary">
            {remaining > 0 ? `${remaining} min` : "Any moment"}
          </p>
          <p className="text-sm text-muted-foreground">
            Arriving around{" "}
            {eta.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
        <div className="rounded-3xl bg-secondary/60 p-5">
          <p className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <MapPin className="size-4" /> Delivering to
          </p>
          <p className="mt-2 text-sm font-semibold text-primary">{order.address.name}</p>
          <p className="text-sm text-muted-foreground">
            {order.address.address}
            {order.address.landmark ? `, near ${order.address.landmark}` : ""} — {order.address.pincode}
          </p>
          <p className="text-sm text-muted-foreground">{order.address.phone}</p>
        </div>
      </div>

      <ol className="mt-8 space-y-4">
        {ORDER_STAGES.map((s) => {
          const done = elapsed >= s.atMinute;
          return (
            <li key={s.label} className="flex items-start gap-3">
              <span className={done ? "text-primary" : "text-muted-foreground/40"}>
                {done ? <CheckCircle2 className="size-5" /> : <Clock className="size-5" />}
              </span>
              <div>
                <p
                  className={`text-sm font-semibold ${done ? "text-primary" : "text-muted-foreground"}`}
                >
                  {s.label}
                </p>
                <p className="text-xs text-muted-foreground">{s.note}</p>
              </div>
            </li>
          );
        })}
      </ol>

      <section className="mt-10 rounded-3xl border border-border p-5">
        <h2 className="flex items-center gap-2 font-display text-lg font-bold text-primary">
          <MessageCircle className="size-4" /> WhatsApp confirmation
        </h2>
        <pre className="mt-3 max-h-72 overflow-auto rounded-2xl bg-secondary/60 p-4 text-xs whitespace-pre-wrap text-muted-foreground">
          {order.whatsappMessage}
        </pre>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href={`https://wa.me/91${BRAND.phone}?text=${encodeURIComponent(`Hi! Any update on order #${order.id}?`)}`}
            target="_blank"
            rel="noreferrer"
            className="gold-ring rounded-full px-5 py-2.5 text-sm font-bold text-accent-foreground"
          >
            Message the kitchen
          </a>
          <a
            href={`tel:${BRAND.phone}`}
            className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-primary"
          >
            Call {BRAND.phone}
          </a>
        </div>
      </section>

      <p className="mt-6 text-sm text-muted-foreground">
        Total paid on delivery: <span className="font-bold text-primary">₹{order.total}</span> ·{" "}
        {order.items.reduce((s, i) => s + i.qty, 0)} items
      </p>
    </main>
  );
}
