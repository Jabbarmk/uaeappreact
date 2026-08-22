import { useMemo, useSyncExternalStore } from 'react';

// Per-business cart, stored only in localStorage (nothing in the database).
// Kept deliberately light: plain functions + one tiny subscription hook.

export interface CartItem {
  pid: number;
  name: string;
  sku?: string | null;
  price?: number | null;
  currency?: string;
  image?: string | null;
  qty: number;
  variations?: Record<string, string>;
}

const key = (bizId: number | string) => `cart_biz_${bizId}`;
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

export function getCart(bizId: number | string): CartItem[] {
  try { return JSON.parse(localStorage.getItem(key(bizId)) || '[]'); } catch { return []; }
}

function save(bizId: number | string, items: CartItem[]) {
  localStorage.setItem(key(bizId), JSON.stringify(items));
  notify();
}

const sameLine = (a: CartItem, b: CartItem) =>
  a.pid === b.pid && JSON.stringify(a.variations || {}) === JSON.stringify(b.variations || {});

export function addToCart(bizId: number | string, item: CartItem) {
  const items = getCart(bizId);
  const existing = items.find((i) => sameLine(i, item));
  if (existing) existing.qty += item.qty;
  else items.push(item);
  save(bizId, items);
}

export function setQty(bizId: number | string, index: number, qty: number) {
  const items = getCart(bizId);
  if (!items[index]) return;
  if (qty <= 0) items.splice(index, 1);
  else items[index].qty = qty;
  save(bizId, items);
}

export function clearCart(bizId: number | string) {
  save(bizId, []);
}

// Reactive cart items for a business (also syncs across tabs via 'storage').
export function useCart(bizId: number | string): CartItem[] {
  const raw = useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      const onStorage = (e: StorageEvent) => { if (e.key === key(bizId)) cb(); };
      window.addEventListener('storage', onStorage);
      return () => { listeners.delete(cb); window.removeEventListener('storage', onStorage); };
    },
    () => localStorage.getItem(key(bizId)) || '[]'
  );
  return useMemo(() => { try { return JSON.parse(raw); } catch { return []; } }, [raw]);
}

// Build the WhatsApp checkout message. Prices/total only when the store is online.
export function checkoutMessage(bizName: string, items: CartItem[], showPrices: boolean): string {
  const intro = showPrices
    ? 'Hello, I would like to order the following item(s). Please confirm availability, total amount and delivery details.'
    : 'Hello, I would like to enquire about the following item(s). Please share more details, including availability, price and delivery information.';
  const lines = [`🛒 ${showPrices ? 'Order' : 'Enquiry'} — ${bizName}`, '', intro, ''];
  let total = 0;
  items.forEach((i, n) => {
    const vars = Object.entries(i.variations || {}).map(([k, v]) => `${k}: ${v}`).join(' | ');
    let line = `${n + 1}. ${i.name}${i.sku ? ` (SKU ${i.sku})` : ''} ×${i.qty}`;
    if (vars) line += `\n   ${vars}`;
    if (showPrices && i.price != null) {
      const amt = Number(i.price) * i.qty;
      total += amt;
      line += `\n   ${i.currency || 'AED'} ${amt.toLocaleString()}`;
    }
    lines.push(line);
  });
  if (showPrices && total > 0) lines.push('', `Total: ${items[0]?.currency || 'AED'} ${total.toLocaleString()}`);
  return lines.join('\n');
}
