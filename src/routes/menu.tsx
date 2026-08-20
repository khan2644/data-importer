import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { DishCard } from "@/components/dish-card";
import { SectionTitle } from "@/components/brand";
import { CATEGORIES, MENU } from "@/lib/menu";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "Menu — Ms Delight Cloud Kitchen" },
      {
        name: "description",
        content:
          "Order burgers, cheese burst pizza, wraps, loaded fries and combos from Ms Delight Cloud Kitchen. Free delivery within 3 km on orders ₹299+.",
      },
      { property: "og:title", content: "Menu — Ms Delight Cloud Kitchen" },
      {
        property: "og:description",
        content: "Freshly made burgers, pizzas, wraps and combos delivered hot.",
      },
    ],
  }),
  component: MenuPage,
});

function MenuPage() {
  const [cat, setCat] = useState<string>("All");
  const [q, setQ] = useState("");

  const dishes = useMemo(
    () =>
      MENU.filter((d) => (cat === "All" ? true : d.category === cat)).filter((d) =>
        d.name.toLowerCase().includes(q.toLowerCase()),
      ),
    [cat, q],
  );

  return (
    <main className="mx-auto max-w-6xl px-5 py-14">
      <SectionTitle
        kicker="Freshly made · Delivered with love"
        title="The Full Menu"
        sub="Everything is cooked only after you order — nothing sits waiting."
      />

      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search for burgers, pizza, fries…"
            className="w-full rounded-full border border-border bg-card py-3 pr-4 pl-11 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={cn(
              "rounded-full border border-border px-4 py-2 text-sm font-semibold transition-all duration-300",
              cat === c
                ? "bg-primary text-primary-foreground shadow-[var(--shadow-card)]"
                : "bg-card text-muted-foreground hover:-translate-y-0.5 hover:text-gold",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
        {dishes.map((d, i) => (
          <DishCard key={d.id} dish={d} index={i} />
        ))}
      </div>

      {dishes.length === 0 && (
        <p className="py-20 text-center text-sm text-muted-foreground">
          Nothing matched that craving. Try another search.
        </p>
      )}
    </main>
  );
}
