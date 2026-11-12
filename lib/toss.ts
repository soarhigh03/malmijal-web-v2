import "server-only";
import { findProductByAmount, isTestKey } from "./pricing";

const CONFIRM_URL = "https://api.tosspayments.com/v1/payments/confirm";
const ORDER_ID_PATTERN = /^[A-Za-z0-9_-]{6,64}$/;

export type ConfirmInput = {
  paymentKey?: string;
  orderId?: string;
  amount?: string;
};

export type ConfirmResult =
  | { ok: true; orderId: string; orderName: string; amount: number }
  | { ok: false; message: string };

// Confirms a Toss payment. Fails closed: refuses unless TOSS_SECRET_KEY is a
// test key, and refuses any amount that is not a server-defined product price.
// No database writes and no entitlement changes happen here.
export async function confirmPayment(input: ConfirmInput): Promise<ConfirmResult> {
  const secretKey = process.env.TOSS_SECRET_KEY;
  if (!isTestKey(secretKey)) {
    return { ok: false, message: "결제 준비 중입니다." };
  }

  const { paymentKey, orderId, amount: rawAmount } = input;
  if (!paymentKey || !orderId || !ORDER_ID_PATTERN.test(orderId)) {
    return { ok: false, message: "결제 정보가 올바르지 않습니다." };
  }

  const amount = rawAmount && /^\d+$/.test(rawAmount) ? Number(rawAmount) : NaN;
  const product = findProductByAmount(amount);
  if (!product) {
    return { ok: false, message: "결제 금액이 상품 가격과 일치하지 않습니다." };
  }

  let res: Response;
  try {
    res = await fetch(CONFIRM_URL, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${secretKey}:`).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ paymentKey, orderId, amount }),
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });
  } catch {
    return { ok: false, message: "결제 승인 요청에 실패했습니다. 잠시 후 다시 시도해 주세요." };
  }

  const body: unknown = await res.json().catch(() => null);
  const data = (body ?? {}) as Record<string, unknown>;

  if (!res.ok) {
    const message = typeof data.message === "string" ? data.message : "결제 승인에 실패했습니다.";
    return { ok: false, message };
  }

  if (data.totalAmount !== amount || data.orderId !== orderId) {
    return { ok: false, message: "승인된 결제 정보가 주문과 일치하지 않습니다." };
  }

  return {
    ok: true,
    orderId,
    orderName: typeof data.orderName === "string" ? data.orderName : product.name,
    amount,
  };
}
