import { z } from "zod";
import { AHMEDABAD_PINCODES } from "./ahmedabad";

export const addressSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Please enter your name" })
    .max(60, { message: "Name is too long" }),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, { message: "Enter a valid 10-digit mobile number" }),
  address: z
    .string()
    .trim()
    .min(10, { message: "Add house / street details (min 10 characters)" })
    .max(300, { message: "Address is too long" }),
  area: z
    .string()
    .trim()
    .min(2, { message: "Please choose your Ahmedabad area" })
    .max(60, { message: "Area name is too long" }),
  landmark: z.string().trim().max(80, { message: "Landmark is too long" }).optional(),
  pincode: z
    .string()
    .trim()
    .regex(/^[1-9]\d{5}$/, { message: "Enter a valid 6-digit PIN code" }),
});

export type DeliveryAddress = z.infer<typeof addressSchema>;

/** PIN codes we currently deliver to — Ahmedabad city only. */
export const SERVICEABLE_PINCODES = AHMEDABAD_PINCODES;

export function isServiceable(pincode: string) {
  return AHMEDABAD_PINCODES.includes(pincode.trim());
}

export type PlacedOrder = {
  id: string;
  placedAt: number;
  etaMinutes: number;
  items: { name: string; qty: number; price: number }[];
  subtotal: number;
  delivery: number;
  total: number;
  address: DeliveryAddress;
  whatsappMessage: string;
};

const KEY = "msdelight-last-order";

export function saveOrder(order: PlacedOrder) {
  try {
    localStorage.setItem(KEY, JSON.stringify(order));
  } catch {
    /* ignore */
  }
}

export function loadOrder(): PlacedOrder | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as PlacedOrder) : null;
  } catch {
    return null;
  }
}

export function clearOrder() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

export function makeOrderId() {
  return `MD${Date.now().toString().slice(-6)}`;
}

/** Kitchen prep + rider time, grows a little with basket size. */
export function estimateEta(itemCount: number) {
  return Math.min(60, 25 + Math.max(0, itemCount - 2) * 3);
}

export type OrderStage = { label: string; note: string; atMinute: number };

export const ORDER_STAGES: OrderStage[] = [
  { label: "Order sent on WhatsApp", note: "We received your message", atMinute: 0 },
  { label: "Confirmed by kitchen", note: "Chef has started cooking", atMinute: 3 },
  { label: "Cooking fresh", note: "Made to order, never pre-packed", atMinute: 8 },
  { label: "Out for delivery", note: "Rider is on the way", atMinute: 18 },
  { label: "Delivered", note: "Enjoy your delight!", atMinute: 25 },
];

export function minutesSince(placedAt: number) {
  return Math.max(0, Math.floor((Date.now() - placedAt) / 60000));
}
