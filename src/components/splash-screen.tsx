import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const HOLD_MS = 1900;
const FADE_MS = 600;

export function SplashScreen() {
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setLeaving(true), HOLD_MS);
    const t2 = setTimeout(() => setGone(true), HOLD_MS + FADE_MS);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = gone ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [gone]);

  if (gone) return null;

  return (
    <div
      aria-hidden
      className={cn(
        "fixed inset-0 z-[100] grid place-items-center bg-background",
        leaving && "animate-splash-out pointer-events-none",
      )}
    >
      <div
        className="animate-spin-slow pointer-events-none absolute size-[34rem] rounded-full opacity-60"
        style={{ backgroundImage: "var(--gradient-glow)" }}
      />

      <div className="relative flex flex-col items-center gap-6">
        <span className="relative grid size-28 place-items-center">
          <span className="gold-ring animate-splash-ring absolute inset-0 rounded-full" />
          <span className="gold-ring animate-splash-pop relative grid size-24 place-items-center rounded-full p-[3px]">
            <span className="grid size-full place-items-center rounded-full bg-card font-script text-5xl leading-none text-primary">
              M
            </span>
          </span>
        </span>

        <div className="animate-splash-word text-center">
          <p className="font-script text-4xl text-gradient-gold">Ms Delight</p>
          <p className="mt-1 text-[0.6rem] font-bold tracking-[0.4em] text-muted-foreground">
            CLOUD KITCHEN
          </p>
        </div>

        <div className="h-1 w-40 overflow-hidden rounded-full bg-secondary">
          <span
            className="animate-splash-bar block h-full w-full rounded-full"
            style={{ backgroundImage: "var(--gradient-gold)" }}
          />
        </div>
      </div>
    </div>
  );
}
