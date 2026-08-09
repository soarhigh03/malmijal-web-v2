"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { trackEvent } from "./analytics";

export function AndroidDownloadButton({
  label,
  tone,
  iconSrc,
  iconAlt,
  accent = "#F1705C",
}: {
  label: string;
  tone: string;
  iconSrc: string;
  iconAlt: string;
  accent?: string;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          trackEvent("store_button_click", { store: "android_notice" });
          setOpen(true);
        }}
        className={`group flex min-h-[52px] w-full items-center justify-center gap-3 rounded-full border border-white/85 bg-gradient-to-r ${tone} px-5 py-3 text-base font-extrabold text-[#1f2742] shadow-[0_12px_24px_rgba(70,67,154,0.15)] transition-transform hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-white/70 sm:text-[1.05rem]`}
      >
        <Image
          src={iconSrc}
          alt={iconAlt}
          width={24}
          height={24}
          className="h-6 w-6 object-contain transition-transform group-hover:scale-105"
        />
        <span>{label}</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div className="mx-4 w-full max-w-sm rounded-2xl bg-white px-6 py-7 text-center shadow-xl">
            <p className="text-lg font-extrabold text-[#1f2742]">
              Android 버전은 업데이트 준비 중입니다.
              <br />
              잠시만 기다려 주세요!
            </p>
            <p className="mt-2 text-sm font-semibold text-[#35415f]/70">
              지금은 iPhone에서 먼저 만나보실 수 있습니다.
            </p>
            <button
              type="button"
              onClick={close}
              className="mt-5 rounded-full px-8 py-2.5 text-sm font-extrabold text-white shadow-md transition-transform hover:-translate-y-0.5 focus:outline-none focus:ring-4"
              style={{ backgroundColor: accent, "--tw-ring-color": `${accent}66` } as React.CSSProperties}
            >
              확인
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export function AndroidQrCard({ label }: { label: string }) {
  return (
    <article className="rounded-[1.1rem] bg-white/82 p-2.5 text-center shadow-[0_8px_18px_rgba(70,67,154,0.09)] sm:p-3">
      <p className="mb-1.5 text-xs font-extrabold text-[#293451] sm:text-sm">
        {label}
      </p>
      <div className="mx-auto flex min-h-[90px] w-fit items-center justify-center rounded-xl bg-white/60 px-4 py-3 sm:min-h-[104px]">
        <p className="text-sm font-bold leading-relaxed text-[#35415f]/70">
          업데이트
          <br />
          준비 중
        </p>
      </div>
    </article>
  );
}
