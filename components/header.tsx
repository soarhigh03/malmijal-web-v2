"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

type NavLink = {
  label: string;
  href: string;
  sectionId?: string;
};

const LINKS: NavLink[] = [
  { label: "HOME", href: "/#home", sectionId: "home" },
  { label: "ABOUT", href: "/#about", sectionId: "about" },
  { label: "FAQ", href: "/#faq", sectionId: "faq" },
  { label: "BLOG", href: "/blog" },
];

const APP_STORE_URL =
  "https://apps.apple.com/kr/app/말미잘/id6769989593";

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<string>("home");
  const [scrolled, setScrolled] = useState(false);

  // Add a frosted-glass pill behind the nav once the page is scrolled past the very top.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // When the mobile drawer is open: lock page scroll and let Escape close it.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Track which section is currently in view (only on the home page).
  // Uses a scroll-tracked "scan line" 35% from the top of the viewport: the
  // active section is the last one whose top has crossed that line.
  useEffect(() => {
    if (pathname !== "/") return;

    const ids = LINKS.map((l) => l.sectionId).filter(
      (id): id is string => !!id,
    );

    const update = () => {
      const sections = ids
        .map((id) => document.getElementById(id))
        .filter((el): el is HTMLElement => !!el);
      if (sections.length === 0) return;

      const scanY = window.innerHeight * 0.35;
      let current = sections[0].id;
      for (const s of sections) {
        if (s.getBoundingClientRect().top <= scanY) current = s.id;
      }

      // Near the absolute bottom, snap to the last section so the user
      // always sees the matching tab highlighted on a short final section.
      const nearBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 4;
      if (nearBottom) current = sections[sections.length - 1].id;

      setActiveSection((prev) => (prev === current ? prev : current));
    };

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        update();
        ticking = false;
      });
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  const isActive = useCallback(
    (link: NavLink) => {
      const onBlog = pathname.startsWith("/blog");
      if (onBlog) return link.href === "/blog";
      if (link.href === "/blog") return false;
      return link.sectionId === activeSection;
    },
    [pathname, activeSection],
  );

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, link: NavLink) => {
      // External page nav (BLOG) just lets Next.js handle it.
      if (!link.sectionId) return;

      // On the home page, smooth-scroll to the section ourselves.
      if (pathname === "/") {
        e.preventDefault();
        const el = document.getElementById(link.sectionId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          history.replaceState(null, "", `#${link.sectionId}`);
          setActiveSection(link.sectionId);
        }
        setOpen(false);
        return;
      }

      // From any other route, let Next route to "/#section".
      e.preventDefault();
      router.push(link.href);
      setOpen(false);
    },
    [pathname, router],
  );

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 h-24 flex items-center justify-between">
        <a
          href="/#home"
          onClick={(e) =>
            handleNavClick(e, { label: "HOME", href: "/#home", sectionId: "home" })
          }
          className={`flex items-center gap-2.5 shrink-0 rounded-full transition-[background-color,backdrop-filter,box-shadow,border-color,padding] duration-300 ease-out ${
            scrolled
              ? "pl-2 pr-5 py-1.5 bg-white/45 backdrop-blur-xl backdrop-saturate-150 border border-white/40 shadow-[0_8px_28px_rgba(0,0,0,0.06)]"
              : "px-0 py-0 bg-transparent border border-transparent shadow-none"
          }`}
        >
          <Image
            src="/assets/logo/app-icon.png"
            alt="말미잘"
            width={36}
            height={36}
            className="rounded-[9px]"
            priority
          />
          <span className="font-kopub text-xl text-black">말미잘</span>
        </a>

        <nav
          className={`hidden md:flex items-center gap-10 lg:gap-14 rounded-full transition-[background-color,backdrop-filter,box-shadow,border-color,padding] duration-300 ease-out ${
            scrolled
              ? "px-8 py-3 bg-white/45 backdrop-blur-xl backdrop-saturate-150 border border-white/40 shadow-[0_8px_28px_rgba(0,0,0,0.06)]"
              : "px-0 py-0 bg-transparent border border-transparent shadow-none"
          }`}
        >
          {LINKS.map((l) => {
            const active = isActive(l);
            return (
              <a
                key={l.label}
                href={l.href}
                onClick={(e) => handleNavClick(e, l)}
                className={`font-kopub text-base tracking-wider transition-opacity duration-300 ${
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
          href={APP_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:inline-flex items-center justify-center px-6 py-3 rounded-full font-kopub text-sm text-white bg-black hover:bg-black/85 transition-colors"
        >
          다운로드
        </a>

        <button
          aria-label="Toggle menu"
          aria-expanded={open}
          className={`md:hidden relative z-50 inline-flex items-center justify-center w-11 h-11 rounded-full text-black transition-[background-color,backdrop-filter,box-shadow,border-color] duration-300 ease-out ${
            scrolled || open
              ? "bg-white/45 backdrop-blur-xl backdrop-saturate-150 border border-white/40 shadow-[0_8px_28px_rgba(0,0,0,0.06)]"
              : "bg-transparent border border-transparent shadow-none"
          }`}
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

      {/* Mobile drawer backdrop */}
      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className={`md:hidden fixed inset-0 z-30 bg-black/15 transition-opacity duration-300 ease-out ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Mobile drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="메뉴"
        aria-hidden={!open}
        className={`md:hidden fixed top-0 right-0 z-40 h-[100dvh] w-1/2 min-w-[280px] max-w-[400px]
          bg-white/55 backdrop-blur-2xl backdrop-saturate-150 border-l border-white/40
          shadow-[-16px_0_50px_rgba(0,0,0,0.08)]
          transition-transform duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex flex-col h-full pt-28 px-7 pb-8">
          <nav className="flex flex-col gap-2">
            {LINKS.map((l) => {
              const active = isActive(l);
              return (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={(e) => handleNavClick(e, l)}
                  className={`py-2.5 font-kopub text-base tracking-wider transition-opacity ${
                    active
                      ? "text-black opacity-80"
                      : "text-black opacity-30 hover:opacity-60"
                  }`}
                >
                  {l.label}
                </a>
              );
            })}
          </nav>

          <a
            href={APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="mt-auto inline-flex items-center justify-center w-full px-4 py-3.5 rounded-full font-kopub text-base text-white bg-black hover:bg-black/85 transition-colors"
          >
            다운로드
          </a>
        </div>
      </aside>
    </header>
  );
}
