import { supabase } from "@/integrations/supabase/client";
import type { DeliveryAddress } from "./order";

export type OrderRow = {
  id: string;
  code: string;
  customer_name: string;
  phone: string;
  address: string;
  area: string;
  landmark: string | null;
  pincode: string;
  items: { name: string; qty: number; price: number }[];
  item_count: number;
  subtotal: number;
  delivery: number;
  total: number;
  status: string;
  source: string;
  created_at: string;
};

export const ORDER_STATUSES = ["placed", "confirmed", "cooking", "out", "delivered", "cancelled"];

/** Saves the order in the kitchen dashboard. Best-effort — never blocks the customer. */
export async function saveOrderToBackend(input: {
  code: string;
  address: DeliveryAddress;
  items: { name: string; qty: number; price: number }[];
  itemCount: number;
  subtotal: number;
  delivery: number;
  total: number;
  source?: string;
}) {
  try {
    const a = input.address;
    await supabase.from("orders").insert({
      code: input.code,
      customer_name: a.name,
      phone: a.phone,
      address: a.address,
      area: a.area,
      landmark: a.landmark ?? null,
      pincode: a.pincode,
      items: input.items,
      item_count: input.itemCount,
      subtotal: input.subtotal,
      delivery: input.delivery,
      total: input.total,
      source: input.source ?? "web",
    });
  } catch {
    /* best effort */
  }
}
