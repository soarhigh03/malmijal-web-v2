"use client";

import Image from "next/image";
import { trackEvent } from "./analytics";

export function AndroidDownloadButton({
  href,
  label,
  tone,
  iconSrc,
  iconAlt,
}: {
  href: string;
  label: string;
  tone: string;
  iconSrc: string;
  iconAlt: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      onClick={() => trackEvent("store_button_click", { store: "android" })}
      className={`group flex min-h-[52px] items-center justify-center gap-3 rounded-full border border-white/85 bg-gradient-to-r ${tone} px-5 py-3 text-base font-extrabold text-[#1f2742] shadow-[0_12px_24px_rgba(70,67,154,0.15)] transition-transform hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-white/70 sm:text-[1.05rem]`}
    >
      <Image
        src={iconSrc}
        alt={iconAlt}
        width={24}
        height={24}
        className="h-6 w-6 object-contain transition-transform group-hover:scale-105"
      />
      <span>{label}</span>
    </a>
  );
}
