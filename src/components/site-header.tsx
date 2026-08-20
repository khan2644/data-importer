import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu as MenuIcon, Phone, ShoppingBag, X } from "lucide-react";
import { Logo } from "./brand";
import { CheckoutPanel } from "./checkout-panel";
import { useCart } from "@/lib/cart";
import { BRAND } from "@/lib/menu";
import { ThemeToggle } from "./theme-toggle";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/menu", label: "Menu" },
  { to: "/about", label: "Our Story" },
  { to: "/delivery-areas", label: "Delivery Areas" },
  { to: "/order-status", label: "Track Order" },
  { to: "/contact", label: "Contact" },
] as const;


export function SiteHeader() {
  const { count, detailed, add, remove } = useCart();
  const [open, setOpen] = useState(false);


  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
        <Link to="/">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-sm font-semibold text-muted-foreground transition-colors hover:text-gold"
              activeProps={{ className: "text-primary" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle className="hidden sm:inline-grid" />
          <a
            href={`tel:${BRAND.phone}`}
            className="hidden items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-primary sm:flex"
          >
            <Phone className="size-4" /> {BRAND.phone}
          </a>

          <Sheet>
            <SheetTrigger asChild>
              <button
                aria-label="Open cart"
                className="gold-ring relative rounded-full p-3 text-accent-foreground transition-transform hover:scale-105"
              >
                <ShoppingBag className="size-4" />
                {count > 0 && (
                  <span className="absolute -top-1 -right-1 grid size-5 place-items-center rounded-full bg-primary text-[0.65rem] font-bold text-primary-foreground">
                    {count}
                  </span>
                )}
              </button>
            </SheetTrigger>
            <SheetContent className="flex w-full flex-col gap-0 sm:max-w-md">
              <SheetHeader>
                <SheetTitle className="font-display text-primary">Your Order</SheetTitle>
              </SheetHeader>

              <div className="flex-1 space-y-4 overflow-y-auto px-4 py-2">
                {detailed.length === 0 && (
                  <p className="py-16 text-center text-sm text-muted-foreground">
                    Your bag is empty. Add something delightful!
                  </p>
                )}
                {detailed.map(({ dish, qty }) => (
                  <div key={dish.id} className="flex items-center gap-3 rounded-2xl bg-secondary/60 p-3">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      loading="lazy"
                      width={80}
                      height={80}
                      className="size-16 rounded-xl object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-primary">{dish.name}</p>
                      <p className="text-sm text-muted-foreground">₹{dish.price}</p>
                    </div>
                    <div className="flex items-center gap-2 rounded-full bg-primary px-2 py-1 text-primary-foreground">
                      <button onClick={() => remove(dish.id)} aria-label="Remove one">
                        −
                      </button>
                      <span className="w-4 text-center text-sm font-bold">{qty}</span>
                      <button onClick={() => add(dish.id)} aria-label="Add one">
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <CheckoutPanel />

            </SheetContent>
          </Sheet>

          <button
            className="rounded-full border border-border p-3 md:hidden"
            aria-label="Toggle navigation"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="size-4" /> : <MenuIcon className="size-4" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="grid gap-1 border-t border-border/60 px-5 py-3 md:hidden">
          <div className="mb-1 flex items-center justify-between rounded-xl bg-secondary/60 px-3 py-2">
            <span className="text-sm font-semibold text-primary">Light / Dark theme</span>
            <ThemeToggle />
          </div>
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              onClick={() => setOpen(false)}
              className="rounded-xl px-3 py-2 text-sm font-semibold text-muted-foreground"
              activeProps={{ className: "bg-secondary text-primary" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
