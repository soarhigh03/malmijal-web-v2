"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ANONYMOUS,
  loadTossPayments,
  type TossPaymentsWidgets,
} from "@tosspayments/tosspayments-sdk";
import { PRODUCTS, formatKrw, isTestKey, type ProductId } from "@/lib/pricing";

export function Checkout({ clientKey }: { clientKey: string }) {
  const [productId, setProductId] = useState<ProductId>(PRODUCTS[0].id);
  const [email, setEmail] = useState("");
  const [widgets, setWidgets] = useState<TossPaymentsWidgets | null>(null);
  const [ready, setReady] = useState(false);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const renderedFor = useRef<TossPaymentsWidgets | null>(null);

  const product = PRODUCTS.find((p) => p.id === productId) ?? PRODUCTS[0];
  const amountRef = useRef(product.price);
  amountRef.current = product.price;

  // Second guard (the server page already checks): never load the SDK with a
  // non-test key.
  const keyOk = isTestKey(clientKey);

  useEffect(() => {
    if (!keyOk) return;
    let cancelled = false;
    loadTossPayments(clientKey)
      .then((toss) => {
        if (!cancelled) setWidgets(toss.widgets({ customerKey: ANONYMOUS }));
      })
      .catch(() => {
        if (!cancelled) setError("결제 모듈을 불러오지 못했습니다.");
      });
    return () => {
      cancelled = true;
    };
  }, [clientKey, keyOk]);

  useEffect(() => {
    if (!widgets || renderedFor.current === widgets) return;
    renderedFor.current = widgets;
    (async () => {
      try {
        await widgets.setAmount({ currency: "KRW", value: amountRef.current });
        await Promise.all([
          widgets.renderPaymentMethods({ selector: "#payment-method", variantKey: "DEFAULT" }),
          widgets.renderAgreement({ selector: "#agreement", variantKey: "AGREEMENT" }),
        ]);
        setReady(true);
      } catch {
        setError("결제 화면을 불러오지 못했습니다.");
      }
    })();
  }, [widgets]);

  useEffect(() => {
    if (!widgets || !ready) return;
    widgets.setAmount({ currency: "KRW", value: product.price }).catch(() => {
      setError("결제 금액을 설정하지 못했습니다.");
    });
  }, [widgets, ready, product.price]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!widgets || !ready || paying) return;
    setError(null);
    setPaying(true);
    const customerEmail = email.trim();
    try {
      await widgets.setAmount({ currency: "KRW", value: product.price });
      await widgets.requestPayment({
        orderId: crypto.randomUUID(),
        orderName: product.name,
        successUrl: `${window.location.origin}/pricing/success`,
        failUrl: `${window.location.origin}/pricing/fail`,
        ...(customerEmail ? { customerEmail } : {}),
      });
    } catch (err) {
      const code = (err as { code?: string } | null)?.code;
      if (code !== "USER_CANCEL") {
        const message = (err as { message?: string } | null)?.message;
        setError(message || "결제를 요청하지 못했습니다.");
      }
    } finally {
      setPaying(false);
    }
  }

  if (!keyOk) {
    return (
      <p className="rounded-2xl bg-canvas px-6 py-8 text-center text-black/70">
        결제 준비 중입니다.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <fieldset className="flex flex-col gap-3">
        <legend className="sr-only">이용권 선택</legend>
        {PRODUCTS.map((p) => (
          <label
            key={p.id}
            className={`flex cursor-pointer items-center justify-between gap-4 rounded-2xl border px-5 py-4 transition-colors ${
              p.id === productId ? "border-black bg-canvas" : "border-black/15 hover:border-black/40"
            }`}
          >
            <span className="flex items-center gap-3">
              <input
                type="radio"
                name="product"
                value={p.id}
                checked={p.id === productId}
                onChange={() => setProductId(p.id)}
                className="h-4 w-4 accent-black"
              />
              <span className="font-medium text-black">{p.name}</span>
            </span>
            <span className="font-semibold text-black">{formatKrw(p.price)}</span>
          </label>
        ))}
      </fieldset>

      <div className="flex flex-col gap-2">
        <label htmlFor="customer-email" className="text-sm font-medium text-black/80">
          말미잘 계정 이메일
        </label>
        <input
          id="customer-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-xl border border-black/15 px-4 py-3 text-base outline-none focus:border-black"
        />
      </div>

      <div>
        <div id="payment-method" />
        <div id="agreement" />
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-3">
        <button
          type="submit"
          disabled={!ready || paying}
          className="rounded-2xl bg-black px-6 py-4 text-base font-semibold text-white transition-opacity disabled:opacity-40"
        >
          {formatKrw(product.price)} 결제하기
        </button>
        <p className="text-xs sm:text-sm text-black/55 leading-relaxed">
          디지털 서비스로 결제 즉시 이용할 수 있으며 배송은 없습니다. 환불 규정은{" "}
          <Link href="/terms" className="underline underline-offset-2 hover:text-black">
            이용약관
          </Link>
          을 확인해 주세요.
        </p>
      </div>
    </form>
  );
}
