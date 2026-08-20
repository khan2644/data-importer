import { cn } from "@/lib/utils";

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="relative grid size-11 place-items-center rounded-full gold-ring p-[2px]">
        <span className="grid size-full place-items-center rounded-full bg-card font-script text-2xl leading-none text-primary">
          M
        </span>
      </span>
      {!compact && (
        <span className="leading-none">
          <span className="block font-script text-2xl text-primary">Ms Delight</span>
          <span className="block text-[0.6rem] font-semibold tracking-[0.34em] text-muted-foreground">
            CLOUD KITCHEN
          </span>
        </span>
      )}
    </div>
  );
}

export function GoldButton({
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(
        "gold-ring inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold tracking-wide text-accent-foreground shadow-[var(--shadow-card)] transition-transform duration-300 hover:-translate-y-0.5 hover:scale-[1.03] active:scale-95",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function SectionTitle({
  kicker,
  title,
  sub,
}: {
  kicker: string;
  title: string;
  sub?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-[0.65rem] font-bold tracking-[0.4em] text-gold uppercase">{kicker}</p>
      <h2 className="mt-3 font-display text-3xl font-bold text-primary sm:text-4xl">{title}</h2>
      {sub && <p className="mt-3 text-sm text-muted-foreground">{sub}</p>}
    </div>
  );
}
