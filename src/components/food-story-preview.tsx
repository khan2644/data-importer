import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Pause,
  Play,
  Plus,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCart } from "@/lib/cart";
import { MENU, type Dish } from "@/lib/menu";

const STORY_MS = 7600;

export function FoodStoryPreview({ dish }: { dish: Dish }) {
  const { add } = useCart();
  const [selected, setSelected] = useState(dish);
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);
  const [take, setTake] = useState(0);

  useEffect(() => {
    if (!playing || paused) return;
    const timer = window.setTimeout(() => setPlaying(false), STORY_MS);
    return () => window.clearTimeout(timer);
  }, [playing, paused, take]);

  const selectedIndex = useMemo(
    () => MENU.findIndex((item) => item.id === selected.id),
    [selected.id],
  );

  const start = () => {
    setTake((value) => value + 1);
    setPaused(false);
    setPlaying(true);
  };

  const move = (direction: -1 | 1) => {
    const nextIndex = (selectedIndex + direction + MENU.length) % MENU.length;
    const nextDish = MENU[nextIndex];
    if (!nextDish) return;
    setSelected(nextDish);
    setPlaying(false);
    setPaused(false);
  };

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          setSelected(dish);
          setPlaying(false);
          setPaused(false);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          type="button"
          size="icon"
          variant="secondary"
          aria-label={`See how ${dish.name} is made`}
          title="See ingredients and preparation"
          className="absolute right-3 bottom-3 z-10 size-11 rounded-full border border-border/70 bg-card/95 text-primary shadow-[var(--shadow-card)] backdrop-blur hover:bg-card"
        >
          <Eye className="size-5" />
        </Button>
      </DialogTrigger>

      <DialogContent className="food-story-dialog max-h-[100dvh] max-w-none overflow-hidden border-0 p-0 sm:max-w-5xl sm:rounded-2xl">
        <DialogTitle className="sr-only">How {selected.name} is made</DialogTitle>
        <DialogDescription className="sr-only">
          Animated ingredient and quality preview for {selected.name}.
        </DialogDescription>

        <div
          key={`${selected.id}-${take}`}
          className={`food-story ${playing ? "is-playing" : ""} ${paused ? "is-paused" : ""}`}
        >
          <div className="food-story-stage">
            <img
              src={selected.image}
              alt={selected.name}
              width={800}
              height={800}
              className="food-story-image"
            />
            <div className="food-story-scan" />
            <div className="food-story-assembly" aria-hidden="true">
              <span className="food-layer food-layer-top">{selected.layers[0]}</span>
              <span className="food-layer food-layer-left">{selected.layers[1]}</span>
              <span className="food-layer food-layer-right">{selected.layers[2]}</span>
              <span className="food-layer food-layer-bottom">{selected.layers[3]}</span>
            </div>

            <div className="food-story-brand">
              <Sparkles className="size-4 text-gold" />
              <span>Ms Delight kitchen story</span>
            </div>

            <div className="food-story-copy">
              <p className="food-story-kicker">Freshly assembled</p>
              <h2>{selected.name}</h2>
              <p className="food-story-description">{selected.desc}</p>
              <div className="food-story-price">₹{selected.price}</div>
            </div>

            <div className="food-story-details">
              <div>
                <p className="food-story-label">Inside your order</p>
                <div className="food-story-ingredients">
                  {selected.ingredients.map((ingredient) => (
                    <span key={ingredient}>{ingredient}</span>
                  ))}
                </div>
              </div>
              <div className="food-story-quality">
                {selected.quality.map((note) => (
                  <span key={note}>
                    <ShieldCheck className="size-4" /> {note}
                  </span>
                ))}
              </div>
            </div>

            {playing && <div className="food-story-progress" aria-hidden="true" />}
          </div>

          <div className="food-story-controls">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={() => move(-1)}
              aria-label="Previous dish"
              title="Previous dish"
            >
              <ChevronLeft />
            </Button>

            {!playing ? (
              <Button type="button" onClick={start} className="min-w-32 rounded-full">
                {take > 0 ? <RotateCcw /> : <Play />}
                {take > 0 ? "Replay story" : "Build this dish"}
              </Button>
            ) : (
              <Button
                type="button"
                variant="secondary"
                onClick={() => setPaused((value) => !value)}
                className="min-w-32 rounded-full"
              >
                {paused ? <Play /> : <Pause />}
                {paused ? "Continue" : "Pause"}
              </Button>
            )}

            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={() => move(1)}
              aria-label="Next dish"
              title="Next dish"
            >
              <ChevronRight />
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => add(selected.id)}
              className="rounded-full"
            >
              <Plus /> Add ₹{selected.price}
            </Button>
          </div>

          <DialogClose asChild>
            <Button
              type="button"
              size="icon"
              variant="secondary"
              aria-label="Close preview"
              className="absolute top-3 right-3 z-30 rounded-full bg-card/90 backdrop-blur"
            >
              <X />
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}