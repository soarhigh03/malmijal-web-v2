"use client";

import { useState } from "react";

const LINKS = [
  { label: "ABOUT", href: "#about" },
  { label: "FAQ", href: "#faq" },
  { label: "BLOG", href: "/blog" },
  { label: "CONTACT", href: "#contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-cloud-white/85 border-b border-black/5">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 h-16 flex items-center justify-between">
        <a
          href="/"
          className="font-display text-2xl text-charcoal-text tracking-tight"
        >
          말미잘
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm font-medium text-charcoal-text/80 hover:text-charcoal-text transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <a
          href="#download"
          className="hidden md:inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium text-action-blue border border-action-blue hover:bg-action-blue hover:text-cloud-white transition-colors"
        >
          DOWNLOAD
        </a>

        <button
          aria-label="Toggle menu"
          aria-expanded={open}
          className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-charcoal-text/15 text-charcoal-text"
          onClick={() => setOpen((v) => !v)}
        >
          <svg
            width="18"
            height="18"
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
        <div className="md:hidden border-t border-black/5 bg-cloud-white/95 backdrop-blur-md">
          <nav className="mx-auto max-w-6xl px-5 py-4 flex flex-col gap-1">
            {LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-3 text-base font-medium text-charcoal-text"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#download"
              onClick={() => setOpen(false)}
              className="mt-3 inline-flex items-center justify-center px-4 py-3 rounded-lg text-base font-medium text-action-blue border border-action-blue"
            >
              DOWNLOAD
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
