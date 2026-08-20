import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/lib/cart";
import { BRAND } from "@/lib/menu";
import { AHMEDABAD_AREAS, findArea } from "@/lib/ahmedabad";
import { recordOrder } from "@/lib/live-stats";
import {
  addressSchema,
  estimateEta,
  isServiceable,
  makeOrderId,
  saveOrder,
  SERVICEABLE_PINCODES,
  type DeliveryAddress,
} from "@/lib/order";

const EMPTY: DeliveryAddress = {
  name: "",
  phone: "",
  address: "",
  area: "",
  landmark: "",
  pincode: "",
};

export function CheckoutPanel({ onDone }: { onDone?: () => void }) {
  const { subtotal, detailed, count, clear } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState<DeliveryAddress>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof DeliveryAddress, string>>>({});

  const delivery = subtotal >= BRAND.freeDeliveryAbove || subtotal === 0 ? 0 : 29;
  const total = subtotal + delivery;
  const empty = detailed.length === 0;

  const set = (k: keyof DeliveryAddress) => (v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  function placeOrder() {
    const parsed = addressSchema.safeParse(form);
    if (!parsed.success) {
      const next: Partial<Record<keyof DeliveryAddress, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof DeliveryAddress;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      toast.error("Please check your delivery details");
      return;
    }
    if (!isServiceable(parsed.data.pincode)) {
      setErrors({ pincode: "We currently deliver only inside Ahmedabad" });
      toast.error("Sorry, that PIN code is outside our Ahmedabad delivery zone");
      return;
    }

    const a = parsed.data;
    const message = [
      `Hi ${BRAND.name}! I'd like to order:`,
      ...detailed.map((l) => `${l.qty} x ${l.dish.name} — ₹${l.dish.price * l.qty}`),
      `Item total: ₹${subtotal}`,
      `Delivery: ${delivery === 0 ? "FREE" : `₹${delivery}`}`,
      `Total: ₹${total}`,
      "",
      `Name: ${a.name}`,
      `Phone: ${a.phone}`,
      `Address: ${a.address}${a.landmark ? `, near ${a.landmark}` : ""}`,
      `Area: ${a.area}, Ahmedabad`,
      `PIN: ${a.pincode}`,
    ].join("\n");

    saveOrder({
      id: makeOrderId(),
      placedAt: Date.now(),
      etaMinutes: estimateEta(count),
      items: detailed.map((l) => ({ name: l.dish.name, qty: l.qty, price: l.dish.price })),
      subtotal,
      delivery,
      total,
      address: a,
      whatsappMessage: message,
    });

    void recordOrder();
    window.open(`https://wa.me/91${BRAND.phone}?text=${encodeURIComponent(message)}`, "_blank");
    clear();
    setForm(EMPTY);
    toast.success("Order sent — track it on your status page!");
    onDone?.();
    void navigate({ to: "/order-status" });
  }

  return (
    <div className="space-y-4 border-t border-border p-4">
      {!empty && (
        <div className="grid gap-2">
          <p className="font-display text-sm font-bold text-primary">Delivery address</p>
          <Field label="Full name" value={form.name} onChange={set("name")} error={errors.name} />
          <Field
            label="Mobile number"
            value={form.phone}
            onChange={set("phone")}
            error={errors.phone}
            inputMode="numeric"
            maxLength={10}
          />
          <Field
            label="House / street / area"
            value={form.address}
            onChange={set("address")}
            error={errors.address}
            textarea
          />
          <label className="block space-y-1">
            <span className="text-[0.7rem] font-semibold text-muted-foreground">
              Area (Ahmedabad)
            </span>
            <select
              value={form.area}
              onChange={(e) => {
                const areaName = e.target.value;
                const match = findArea(areaName);
                setForm((f) => ({
                  ...f,
                  area: areaName,
                  pincode: match ? match.pincode : f.pincode,
                }));
                setErrors((er) => {
                  const next = { ...er };
                  delete next.area;
                  delete next.pincode;
                  return next;
                });
              }}
              className={`w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary ${
                errors.area ? "border-destructive" : "border-border"
              }`}
            >
              <option value="">Select your area…</option>
              {AHMEDABAD_AREAS.map((a) => (
                <option key={`${a.area}-${a.pincode}`} value={a.area}>
                  {a.area} — {a.pincode} ({a.zone})
                </option>
              ))}
            </select>
            {errors.area && (
              <span className="block text-[0.7rem] text-destructive">{errors.area}</span>
            )}
          </label>
          <div className="grid grid-cols-2 gap-2">
            <Field
              label="Landmark (optional)"
              value={form.landmark ?? ""}
              onChange={set("landmark")}
              error={errors.landmark}
            />
            <Field
              label="PIN code"
              value={form.pincode}
              onChange={set("pincode")}
              error={errors.pincode}
              inputMode="numeric"
              maxLength={6}
            />
          </div>
          <p className="text-[0.7rem] text-muted-foreground">
            We deliver across Ahmedabad, Gujarat — {SERVICEABLE_PINCODES.length} PIN codes covered.
          </p>
        </div>
      )}

      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Item total</span>
        <span>₹{subtotal}</span>
      </div>
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Delivery ({BRAND.radiusKm} km)</span>
        <span>{delivery === 0 ? "FREE" : `₹${delivery}`}</span>
      </div>
      <div className="flex justify-between font-display text-lg font-bold text-primary">
        <span>To pay</span>
        <span>₹{total}</span>
      </div>

      <button
        disabled={empty}
        onClick={placeOrder}
        className="gold-ring w-full rounded-full py-3 text-sm font-bold text-accent-foreground disabled:opacity-50"
      >
        Place order on WhatsApp
      </button>

      {!empty && (
        <button
          onClick={clear}
          className="flex w-full items-center justify-center gap-2 text-xs text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="size-3" /> Clear cart
        </button>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  textarea,
  inputMode,
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string | undefined;
  textarea?: boolean;
  inputMode?: "numeric" | "text";
  maxLength?: number;
}) {
  const cls = `w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary ${
    error ? "border-destructive" : "border-border"
  }`;
  return (
    <label className="block space-y-1">
      <span className="text-[0.7rem] font-semibold text-muted-foreground">{label}</span>
      {textarea ? (
        <textarea
          value={value}
          rows={2}
          maxLength={300}
          onChange={(e) => onChange(e.target.value)}
          className={cls}
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          {...(inputMode ? { inputMode } : {})}
          {...(maxLength ? { maxLength } : {})}
          className={cls}
        />
      )}
      {error && <span className="block text-[0.7rem] text-destructive">{error}</span>}
    </label>
  );
}
