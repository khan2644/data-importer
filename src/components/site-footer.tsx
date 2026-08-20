import { LiveStats } from "@/components/live-stats";
import { Link } from "@tanstack/react-router";
import { Instagram, Phone } from "lucide-react";
import { Logo } from "./brand";
import { BRAND } from "@/lib/menu";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/70 bg-secondary/50">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-3">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-xs text-sm text-muted-foreground">{BRAND.tagline}</p>
        </div>
        <div className="space-y-2 text-sm">
          <p className="font-display font-bold text-primary">Explore</p>
          <Link to="/" className="block text-muted-foreground hover:text-gold">
            Home
          </Link>
          <Link to="/menu" className="block text-muted-foreground hover:text-gold">
            Menu
          </Link>
          <Link to="/about" className="block text-muted-foreground hover:text-gold">
            Our Story
          </Link>
          <Link to="/contact" className="block text-muted-foreground hover:text-gold">
            Contact
          </Link>
        </div>
        <div className="space-y-2 text-sm">
          <p className="font-display font-bold text-primary">Order &amp; Follow</p>
          <a
            href={`tel:${BRAND.phone}`}
            className="flex items-center gap-2 text-muted-foreground hover:text-gold"
          >
            <Phone className="size-4" /> {BRAND.phone}
          </a>
          <a
            href={`https://instagram.com/${BRAND.instagram}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-muted-foreground hover:text-gold"
          >
            <Instagram className="size-4" /> @{BRAND.instagram}
          </a>
          <p className="text-muted-foreground">
            Free delivery within {BRAND.radiusKm} km on orders ₹{BRAND.freeDeliveryAbove}+
          </p>
        </div>
      </div>
      <div className="pb-4">
        <LiveStats compact />
      </div>
      <p className="pb-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Ms Delight Cloud Kitchen · Thank you for supporting small
        business
      </p>

    </footer>
  );
}
