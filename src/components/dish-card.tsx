import { useRef, useState } from "react";
import { Minus, Plus, Star, Timer } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/lib/cart";
import type { Dish } from "@/lib/menu";
import { cn } from "@/lib/utils";

export function DishCard({ dish, index = 0 }: { dish: Dish; index?: number }) {
  const { add, remove, qtyOf } = useCart();
  const qty = qtyOf(dish.id);
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ x: -py * 12, y: px * 14 });
  };

  return (
    <div className="scene-3d animate-rise-in" style={{ animationDelay: `${index * 70}ms` }}>
      <div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={() => setTilt({ x: 0, y: 0 })}
        style={{
          transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(0)`,
        }}
        className="card-3d group relative overflow-hidden rounded-3xl border border-border/70 bg-card"
      >
        <div className="relative overflow-hidden">
          <img
            src={dish.image}
            alt={dish.name}
            loading="lazy"
            width={800}
            height={800}
            className="h-52 w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{ backgroundImage: "var(--gradient-glow)" }}
          />
          {dish.bestseller && (
            <span className="gold-ring absolute top-3 left-3 rounded-full px-3 py-1 text-[0.6rem] font-black tracking-widest text-accent-foreground uppercase">
              Bestseller
            </span>
          )}
          <span
            className={cn(
              "absolute top-3 right-3 grid size-5 place-items-center rounded-[4px] border-2 bg-card",
              dish.veg ? "border-primary" : "border-destructive",
            )}
          >
            <span
              className={cn(
                "size-2 rounded-full",
                dish.veg ? "bg-primary" : "bg-destructive",
              )}
            />
          </span>
        </div>

        <div className="space-y-3 p-5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-display text-lg leading-tight font-bold text-primary">
              {dish.name}
            </h3>
            <span className="flex shrink-0 items-center gap-1 rounded-full bg-primary px-2 py-1 text-xs font-bold text-primary-foreground">
              <Star className="size-3 fill-current" /> {dish.rating}
            </span>
          </div>
          <p className="line-clamp-2 text-sm text-muted-foreground">{dish.desc}</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Timer className="size-3.5" /> {dish.time}
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-2xl font-bold text-primary">₹{dish.price}</span>
              {dish.mrp && (
                <span className="text-sm text-muted-foreground line-through">₹{dish.mrp}</span>
              )}
            </div>

            {qty === 0 ? (
              <button
                onClick={() => {
                  add(dish.id);
                  toast.success(`${dish.name} added to cart`);
                }}
                className="gold-ring rounded-full px-5 py-2 text-sm font-bold text-accent-foreground transition-transform duration-300 hover:scale-105 active:scale-95"
              >
                ADD
              </button>
            ) : (
              <div className="flex items-center gap-3 rounded-full bg-primary px-3 py-1.5 text-primary-foreground">
                <button onClick={() => remove(dish.id)} aria-label="Remove one">
                  <Minus className="size-4" />
                </button>
                <span className="w-4 text-center text-sm font-bold">{qty}</span>
                <button onClick={() => add(dish.id)} aria-label="Add one">
                  <Plus className="size-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
