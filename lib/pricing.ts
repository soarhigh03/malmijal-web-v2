// Single source of truth for web-checkout products. Used by the /pricing
// widget (display + requested amount) and by the server-side confirm step
// (amount validation). Prices are KRW, VAT included.

export type ProductId = "pro_1m" | "pro_12m";

export type Product = {
  id: ProductId;
  name: string;
  price: number;
};

export const PRODUCTS: readonly Product[] = [
  { id: "pro_1m", name: "말미잘 Pro 1개월 이용권", price: 6900 },
  { id: "pro_12m", name: "말미잘 Pro 12개월 이용권", price: 59000 },
] as const;

export function findProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function findProductByAmount(amount: number): Product | undefined {
  return PRODUCTS.find((p) => p.price === amount);
}

export function formatKrw(amount: number): string {
  return `${amount.toLocaleString("ko-KR")}원`;
}

// Test-mode guard. Live keys (live_…) must never reach the SDK or the
// confirm API from this site.
export function isTestKey(key: string | undefined): key is string {
  return typeof key === "string" && key.startsWith("test_");
}
