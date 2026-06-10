"use client";

import { useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

const LINKS = [
  { label: "HOME", href: "/" },
  { label: "ABOUT", href: "/#about" },
  { label: "FAQ", href: "/#faq" },
  { label: "BLOG", href: "/blog" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href.startsWith("/#")) return pathname === "/";
    if (href === "/blog") return pathname.startsWith("/blog");
    return false;
  };

  return (
    <header className="absolute top-0 inset-x-0 z-50">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 h-24 flex items-center justify-between">
        <a href="/" className="flex items-center gap-3 shrink-0">
          <Image
            src="/assets/logo/app-icon.png"
            alt="말미잘"
            width={44}
            height={44}
            className="rounded-[10px]"
            priority
          />
          <span className="font-kopub text-2xl text-black">말미잘</span>
        </a>

        <nav className="hidden md:flex items-center gap-12 lg:gap-16">
          {LINKS.map((l) => {
            const active = isActive(l.href);
            return (
              <a
                key={l.label}
                href={l.href}
                className={`font-kopub text-base tracking-wider transition-opacity ${
                  active
                    ? "text-black opacity-80"
                    : "text-black opacity-20 hover:opacity-50"
                }`}
              >
                {l.label}
              </a>
            );
          })}
        </nav>

        <a
          href="https://apps.apple.com/kr/app/말미잘/id6769989593"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:inline-flex items-center justify-center px-6 py-3 rounded-full font-kopub text-sm text-white bg-black hover:bg-black/85 transition-colors"
        >
          다운로드
        </a>

        <button
          aria-label="Toggle menu"
          aria-expanded={open}
          className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg text-black"
          onClick={() => setOpen((v) => !v)}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            {open ? (
              <>
                <path d="M6 6 L18 18" />
                <path d="M18 6 L6 18" />
              </>
            ) : (
              <>
                <path d="M4 7h16" />
                <path d="M4 12h16" />
                <path d="M4 17h16" />
              </>
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-[#f0f0f0]/95 backdrop-blur-md">
          <nav className="mx-auto max-w-7xl px-6 py-4 flex flex-col gap-1">
            {LINKS.map((l) => {
              const active = isActive(l.href);
              return (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`py-3 font-kopub text-base ${
                    active ? "text-black opacity-80" : "text-black opacity-30"
                  }`}
                >
                  {l.label}
                </a>
              );
            })}
            <a
              href="https://apps.apple.com/kr/app/말미잘/id6769989593"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="mt-3 inline-flex items-center justify-center px-4 py-3 rounded-full font-kopub text-base text-white bg-black"
            >
              다운로드
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
