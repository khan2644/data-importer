import { createFileRoute } from "@tanstack/react-router";
import { ChefHat, HeartHandshake, Leaf, ShieldCheck } from "lucide-react";
import { SectionTitle } from "@/components/brand";
import combo from "@/assets/hero-combo.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Our Story — Ms Delight Cloud Kitchen" },
      {
        name: "description",
        content:
          "Ms Delight is a home-run cloud kitchen serving hygienic, freshly prepared burgers, pizzas and combos crafted with love.",
      },
      { property: "og:title", content: "Our Story — Ms Delight Cloud Kitchen" },
      {
        property: "og:description",
        content: "A small kitchen with a big heart — hygienic, fresh, made to order.",
      },
    ],
  }),
  component: AboutPage,
});

const VALUES = [
  { icon: Leaf, title: "Fresh Ingredients", text: "Vegetables and buns sourced the same morning." },
  { icon: ShieldCheck, title: "Hygienic Prep", text: "Gloves, sanitised surfaces, sealed packing." },
  { icon: ChefHat, title: "Tasty Food", text: "Recipes tuned over hundreds of family dinners." },
  { icon: HeartHandshake, title: "On Time Delivery", text: "Hot and sealed within 3 km, every time." },
];

function AboutPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-14">
      <SectionTitle
        kicker="Made with love"
        title="A small kitchen with a big heart"
        sub="Ms Delight started at a single home stove with one promise — food we would happily serve our own family."
      />

      <div className="mt-14 grid items-center gap-10 md:grid-cols-2">
        <div className="scene-3d">
          <img
            src={combo}
            alt="Signature Ms Delight combo"
            loading="lazy"
            width={1408}
            height={1408}
            className="animate-float-3d w-full rounded-[2rem] object-cover shadow-[var(--shadow-plate)]"
          />
        </div>
        <div className="space-y-5 text-sm leading-relaxed text-muted-foreground">
          <p>
            Every order is cooked only once it reaches us. No pre-fried patties, no reheated sauces
            — just a kitchen that starts moving the moment your name appears on the screen.
          </p>
          <p>
            We package in kraft bags stamped with our seal so your food arrives sealed, warm and
            exactly the way it left the pan. Whether it is a single burger at midnight or a family
            combo on a Sunday, the care is the same.
          </p>
          <p className="font-script text-2xl text-gold">
            Crafted with love, delivered with delight.
          </p>
        </div>
      </div>

      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {VALUES.map((v, i) => (
          <div
            key={v.title}
            className="card-3d animate-rise-in rounded-3xl border border-border/70 bg-card p-6 hover:card-3d-hover"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <span className="gold-ring grid size-12 place-items-center rounded-2xl text-accent-foreground">
              <v.icon className="size-5" />
            </span>
            <h3 className="mt-4 font-display text-lg font-bold text-primary">{v.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{v.text}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
