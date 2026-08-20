import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Bike, Clock, Instagram, Phone } from "lucide-react";
import { toast } from "sonner";
import { SectionTitle } from "@/components/brand";
import { BRAND } from "@/lib/menu";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Delivery — Ms Delight Cloud Kitchen" },
      {
        name: "description",
        content:
          "Call 9737662239 to order from Ms Delight Cloud Kitchen. Free delivery within 3 km on orders above ₹299, open 11 AM to 11 PM.",
      },
      { property: "og:title", content: "Contact Ms Delight Cloud Kitchen" },
      {
        property: "og:description",
        content: "Order by phone, WhatsApp or Instagram — delivered hot within 3 km.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");

  return (
    <main className="mx-auto max-w-6xl px-5 py-14">
      <SectionTitle
        kicker="We are one call away"
        title="Contact & Delivery"
        sub="Delicious food is just one order away."
      />

      <div className="mt-12 grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          {[
            { icon: Phone, title: "Call or WhatsApp", text: BRAND.phone, href: `tel:${BRAND.phone}` },
            { icon: Bike, title: "Delivery Zone", text: `Free within ${BRAND.radiusKm} km on ₹${BRAND.freeDeliveryAbove}+` },
            { icon: Clock, title: "Kitchen Hours", text: "11:00 AM — 11:00 PM, all days" },
            { icon: Instagram, title: "Instagram", text: `@${BRAND.instagram}`, href: `https://instagram.com/${BRAND.instagram}` },
          ].map((c) => {
            const inner = (
              <>
                <span className="gold-ring grid size-11 place-items-center rounded-2xl text-accent-foreground">
                  <c.icon className="size-5" />
                </span>
                <div>
                  <p className="text-xs font-bold tracking-[0.2em] text-muted-foreground uppercase">
                    {c.title}
                  </p>
                  <p className="font-display text-lg font-bold text-primary">{c.text}</p>
                </div>
              </>
            );
            const cls = "flex items-center gap-4 rounded-3xl border border-border/70 bg-card p-5 shadow-[var(--shadow-card)] transition hover:border-gold/60";
            return c.href ? (
              <a key={c.title} href={c.href} target="_blank" rel="noreferrer" className={cls}>
                {inner}
              </a>
            ) : (
              <div key={c.title} className={cls}>
                {inner}
              </div>
            );
          })}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const text = encodeURIComponent(`Hi Ms Delight! I'm ${name}. ${msg}`);
            window.open(`https://wa.me/91${BRAND.phone}?text=${text}`, "_blank");
            toast.success("Opening WhatsApp…");
          }}
          className="space-y-4 rounded-3xl border border-border/70 bg-card p-6 shadow-[var(--shadow-card)]"
        >
          <h3 className="font-display text-xl font-bold text-primary">Send us a message</h3>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          <textarea
            required
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            rows={5}
            placeholder="What would you like to order?"
            className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          <button className="gold-ring w-full rounded-full py-3 text-sm font-bold text-accent-foreground transition-transform hover:scale-[1.02]">
            Send on WhatsApp
          </button>
        </form>
      </div>
    </main>
  );
}
