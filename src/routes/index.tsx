import { createFileRoute, Link } from "@tanstack/react-router";
import { Bike, Leaf, ShieldCheck, Sparkles, Star, UtensilsCrossed } from "lucide-react";
import { DishCard } from "@/components/dish-card";
import { SectionTitle } from "@/components/brand";
import { LiveStats } from "@/components/live-stats";
import { BRAND, MENU } from "@/lib/menu";
import hero from "@/assets/hero-combo.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ms Delight Cloud Kitchen — Order Burgers, Pizza & Combos" },
      {
        name: "description",
        content:
          "Freshly made burgers, cheese burst pizza, wraps and the ₹149 combo from Ms Delight Cloud Kitchen. Free delivery within 3 km on orders above ₹299.",
      },
      { property: "og:title", content: "Ms Delight Cloud Kitchen" },
      {
        property: "og:description",
        content: "Crafted with love, delivered with delight. Order hot food in minutes.",
      },
    ],
  }),
  component: Index,
});

const USPS = [
  { icon: Leaf, label: "Fresh Ingredients" },
  { icon: ShieldCheck, label: "Hygienic Preparation" },
  { icon: UtensilsCrossed, label: "Tasty Food" },
  { icon: Bike, label: "On Time Delivery" },
];

function Index() {
  const popular = MENU.slice(0, 6);

  return (
    <main>
      {/* Hero */}
      <section className="scene-3d relative overflow-hidden px-5 pt-10 pb-20">
        <div
          className="animate-spin-slow pointer-events-none absolute -top-40 left-1/2 size-[38rem] -translate-x-1/2 rounded-full opacity-60"
          style={{ backgroundImage: "var(--gradient-glow)" }}
        />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2">
          <div className="animate-rise-in space-y-6 text-center md:text-left">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-1.5 text-[0.65rem] font-bold tracking-[0.25em] text-primary-foreground uppercase">
              <Sparkles className="size-3" /> Freshly made · Delivered with love
            </span>
            <h1 className="font-display text-4xl leading-[1.05] font-bold text-primary sm:text-6xl">
              Good Food
              <span className="mt-1 block font-script text-5xl text-gradient-gold sm:text-7xl">
                Good Mood
              </span>
            </h1>
            <p className="mx-auto max-w-md text-sm text-muted-foreground md:mx-0">
              {BRAND.tagline}. Order the ₹149 signature combo or build your own feast — cooked only
              after you tap order.
            </p>
            <div className="flex flex-wrap justify-center gap-3 md:justify-start">
              <Link
                to="/menu"
                className="gold-ring rounded-full px-7 py-3.5 text-sm font-bold text-accent-foreground transition-transform duration-300 hover:-translate-y-0.5 hover:scale-105"
              >
                Order Now
              </Link>
              <a
                href={`tel:${BRAND.phone}`}
                className="rounded-full border border-primary px-7 py-3.5 text-sm font-bold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                Call {BRAND.phone}
              </a>
            </div>
            <div className="flex flex-wrap justify-center gap-5 pt-2 text-xs text-muted-foreground md:justify-start">
              <span className="flex items-center gap-1.5">
                <Star className="size-3.5 fill-current text-gold" /> 4.8 avg rating
              </span>
              <span>Free delivery ₹{BRAND.freeDeliveryAbove}+</span>
              <span>{BRAND.radiusKm} km radius</span>
            </div>
          </div>

          <div className="relative">
            <div
              className="absolute inset-6 rounded-full blur-2xl"
              style={{ backgroundImage: "var(--gradient-gold)", opacity: 0.35 }}
            />
            <img
              src={hero}
              alt="Chicken cheese burger combo with fries and cold drink"
              width={1408}
              height={1408}
              className="animate-float-3d relative w-full rounded-full object-cover shadow-[var(--shadow-plate)]"
              style={{ transform: "rotateX(6deg) rotateY(-8deg)" }}
            />
            <div className="gold-ring absolute -bottom-4 left-2 rounded-2xl px-5 py-3 text-accent-foreground shadow-[var(--shadow-card)]">
              <p className="text-[0.6rem] font-bold tracking-widest uppercase">Combo price</p>
              <p className="font-display text-2xl leading-none font-black">₹149</p>
            </div>
          </div>
        </div>
      </section>

      {/* Live counters */}
      <section className="mx-auto max-w-6xl px-5 pb-6">
        <LiveStats />
      </section>

      {/* USP strip */}
      <section className="mx-auto max-w-6xl px-5">
        <div className="grid gap-3 rounded-3xl border border-border/70 bg-card p-5 shadow-[var(--shadow-card)] sm:grid-cols-4">
          {USPS.map((u) => (
            <div key={u.label} className="flex flex-col items-center gap-2 text-center">
              <span className="gold-ring grid size-11 place-items-center rounded-full text-accent-foreground">
                <u.icon className="size-5" />
              </span>
              <p className="text-xs font-bold tracking-wide text-primary uppercase">{u.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Popular */}
      <section className="mx-auto max-w-6xl px-5 pt-20">
        <SectionTitle
          kicker="Most loved"
          title="Straight off the pan"
          sub="Tap add and we start cooking. Sealed, warm and at your door."
        />
        <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {popular.map((d, i) => (
            <DishCard key={d.id} dish={d} index={i} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            to="/menu"
            className="inline-block rounded-full border border-primary px-7 py-3 text-sm font-bold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            See the full menu
          </Link>
        </div>
      </section>

      {/* Order steps */}
      <section className="mx-auto mt-24 max-w-6xl px-5">
        <SectionTitle kicker="How it works" title="Three taps to delight" />
        <div className="scene-3d mt-10 grid gap-6 md:grid-cols-3">
          {[
            { n: "01", t: "Pick your craving", d: "Browse the menu and add favourites to your bag." },
            { n: "02", t: "Confirm on WhatsApp", d: "One tap sends your order straight to the kitchen." },
            { n: "03", t: "Hot at your door", d: "Sealed kraft packing, delivered within 3 km." },
          ].map((s, i) => (
            <div
              key={s.n}
              className="card-3d animate-rise-in rounded-3xl border border-border/70 bg-card p-7"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <p className="font-display text-4xl font-black text-gradient-gold">{s.n}</p>
              <h3 className="mt-3 font-display text-lg font-bold text-primary">{s.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto mt-24 max-w-6xl px-5">
        <div
          className="relative overflow-hidden rounded-[2.5rem] p-10 text-center"
          style={{ backgroundImage: "var(--gradient-leaf)" }}
        >
          <p className="font-script text-4xl text-gradient-gold">Order Now</p>
          <p className="mt-3 text-sm text-primary-foreground/90">
            Delicious food is just one order away — thank you for supporting small business.
          </p>
          <Link
            to="/menu"
            className="gold-ring mt-6 inline-block rounded-full px-8 py-3.5 text-sm font-bold text-accent-foreground"
          >
            Browse the menu
          </Link>
        </div>
      </section>
    </main>
  );
}
