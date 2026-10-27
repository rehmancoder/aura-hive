"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { LogoMark } from "./Logo";
import { contactHref, contactPath, nav, serviceGroups, servicePath, site } from "@/lib/site";
import { findOnPage, lockScroll } from "@/lib/scroll";

/* ------------------------------------------------------------------ */
/* Header                                                              */
/* ------------------------------------------------------------------ */

export function Header() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const onContact = usePathname() === contactPath;
  const anchor = useRef(0);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Hide the bar while scrolling down, show it again on the way up.
  // Smooth scrolling moves the page in tiny steps, so only react once the page has
  // moved 12px in one direction; otherwise the bar flickers between hidden and shown.
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      if (y < 320) {
        setHidden(false);
        anchor.current = y;
        return;
      }
      const moved = y - anchor.current;
      if (Math.abs(moved) < 12) return;
      setHidden(moved > 0);
      anchor.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = useCallback((returnFocus = false) => {
    setMenuOpen(false);
    if (returnFocus) toggleRef.current?.focus();
  }, []);

  // While the mobile menu is open: stop page scrolling, make the page behind it unreachable, close on Escape.
  useEffect(() => {
    if (!menuOpen) return;
    lockScroll(true);
    const behind = [findOnPage("main"), document.querySelector("footer")];
    behind.forEach((el) => el?.setAttribute("inert", ""));
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeMenu(true);
    const onResize = () => window.innerWidth >= 1024 && closeMenu();
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      lockScroll(false);
      behind.forEach((el) => el?.removeAttribute("inert"));
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [menuOpen, closeMenu]);

  const showBar = !hidden || menuOpen;

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-10 focus:rounded focus:bg-honey focus:px-4 focus:py-2 focus:text-ink"
        >
          Skip to content
        </a>
        <div
          className={`transition-[transform,background-color,backdrop-filter] duration-500 ease-[var(--ease-honey)] ${
            showBar ? "translate-y-0" : "-translate-y-full"
          } ${scrolled && !menuOpen ? "bg-ink/60 backdrop-blur-xl" : "bg-transparent"}`}
        >
          <div className="relative mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-4 px-5 sm:px-8 md:h-20">
            <Link
              href="/"
              onClick={() => closeMenu()}
              className="flex shrink-0 items-center gap-2.5 text-honey"
              aria-label={`${site.name} home`}
            >
              <LogoMark className="h-7 w-auto" />
              <span className="text-lg font-semibold tracking-tight text-wax">{site.name}</span>
            </Link>

            <DesktopNav />

            <div className="flex items-center gap-2.5 sm:gap-3">
              {/* On the contact page itself, this jumps to the form instead */}
              <Link
                href={onContact ? "#contact-form" : contactHref()}
                className="hidden rounded-full bg-honey px-5 py-2.5 text-[15px] font-semibold text-ink transition-colors hover:bg-wax sm:inline-block"
              >
                {onContact ? "Go to the form" : "Start a project"}
              </Link>
              <button
                ref={toggleRef}
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                className="relative flex h-11 w-11 items-center justify-center rounded-full border border-wax/20 bg-ink/40 backdrop-blur-md transition-colors hover:border-honey/60 lg:hidden"
              >
                {/* Three bars like the logo; they turn into a cross when the menu is open */}
                <span aria-hidden className="relative block h-5 w-5">
                  <span
                    className={`absolute left-1/2 top-1/2 h-[2px] rounded-full bg-honey transition-all duration-500 ease-[var(--ease-honey)] ${
                      menuOpen ? "w-5 -translate-x-1/2 -translate-y-1/2 rotate-45" : "w-5 -translate-x-1/2 -translate-y-[7px]"
                    }`}
                  />
                  <span
                    className={`absolute left-1/2 top-1/2 h-[2px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-honey transition-all duration-300 ${
                      menuOpen ? "w-0 opacity-0" : "w-5 opacity-100"
                    }`}
                  />
                  <span
                    className={`absolute left-1/2 top-1/2 h-[2px] rounded-full bg-honey transition-all duration-500 ease-[var(--ease-honey)] ${
                      menuOpen ? "w-5 -translate-x-1/2 -translate-y-1/2 -rotate-45" : "w-3 -translate-x-[2px] translate-y-[5px]"
                    }`}
                  />
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={closeMenu} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Desktop navigation with the Services mega dropdown                  */
/* ------------------------------------------------------------------ */

/** True when a nav link points at the page being viewed. */
function useIsCurrent() {
  const pathname = usePathname();
  return (href: string) => !href.includes("#") && (href === "/" ? pathname === "/" : pathname.startsWith(href));
}

function DesktopNav() {
  const isCurrent = useIsCurrent();
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLLIElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => {
    if (timer.current) clearTimeout(timer.current);
    setOpen(true);
  };
  const hideSoon = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(false), 160);
  };

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    };
    const onScroll = () => setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
    };
  }, [open]);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  return (
    <nav aria-label="Main" className="hidden lg:block">
      <ul className="flex items-center gap-1 text-[15px] text-wax/80">
        {nav.map((item) =>
          "dropdown" in item ? (
            <li
              key={item.href}
              ref={wrap}
              className="static"
              onPointerEnter={(e) => e.pointerType === "mouse" && show()}
              onPointerLeave={(e) => e.pointerType === "mouse" && hideSoon()}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
              }}
            >
              <button
                ref={button}
                type="button"
                aria-expanded={open}
                aria-controls="services-menu"
                onClick={() => setOpen((v) => !v)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setOpen(true);
                    requestAnimationFrame(() =>
                      document.querySelector<HTMLAnchorElement>("#services-menu a")?.focus(),
                    );
                  }
                }}
                className={`flex items-center gap-2 rounded-full px-4 py-2.5 transition-colors hover:text-honey ${
                  open || isCurrent(item.href) ? "text-honey" : ""
                }`}
              >
                {item.label}
                <Chevron open={open} />
              </button>

              {/* Mega menu: three columns of services */}
              <div
                id="services-menu"
                className={`absolute left-1/2 top-full w-[min(58rem,calc(100vw-3rem))] -translate-x-1/2 pt-1 transition-[opacity,transform,visibility] duration-300 ease-[var(--ease-honey)] ${
                  open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"
                }`}
              >
                <div className="overflow-hidden rounded-[28px] border border-wax/12 bg-comb/95 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl">
                  <div className="grid grid-cols-3 gap-2 p-3">
                    {serviceGroups.map((g, gi) => (
                      <div key={g.title} className="rounded-[20px] p-4">
                        <p className="flex items-center gap-2.5 pb-3 text-sm font-semibold text-honey">
                          <span aria-hidden className="flex h-4 items-end gap-[3px]">
                            {[0.55, 1, 0.55].map((h, i) => (
                              <span
                                key={i}
                                className={`w-[3px] rounded-full ${i === gi ? "bg-honey" : "bg-honey/35"}`}
                                style={{ height: `${h * 100}%` }}
                              />
                            ))}
                          </span>
                          {g.title}
                        </p>
                        <ul className="space-y-1">
                          {g.items.map((s) => (
                            <li key={s.slug}>
                              <Link
                                href={servicePath(s.slug)}
                                onClick={() => setOpen(false)}
                                className="block rounded-2xl px-3 py-3 transition-colors hover:bg-wax/[0.06] focus-visible:bg-wax/[0.06]"
                              >
                                <span className="block text-[15px] font-medium text-wax">{s.title}</span>
                                <span className="mt-0.5 block text-sm leading-snug text-wax/60">{s.short}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between gap-6 border-t border-wax/10 bg-ink/40 px-7 py-4">
                    <p className="text-sm text-wax/65">Not sure what you need? Tell us your goals and we&apos;ll recommend a plan.</p>
                    <div className="flex items-center gap-5 text-sm font-semibold">
                      <Link href="/services" onClick={() => setOpen(false)} className="text-wax transition-colors hover:text-honey">
                        All services
                      </Link>
                      <Link
                        href={contactHref()}
                        onClick={() => setOpen(false)}
                        className="rounded-full bg-honey px-4 py-2 text-ink transition-colors hover:bg-wax"
                      >
                        Start a project
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ) : (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isCurrent(item.href) ? "page" : undefined}
                className={`block rounded-full px-4 py-2.5 transition-colors hover:text-honey ${
                  isCurrent(item.href) ? "text-honey" : ""
                }`}
              >
                {item.label}
              </Link>
            </li>
          ),
        )}
      </ul>
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/* Mobile and tablet menu                                              */
/* ------------------------------------------------------------------ */

function MobileMenu({ open, onClose }: { open: boolean; onClose: (returnFocus?: boolean) => void }) {
  const isCurrent = useIsCurrent();
  const [servicesOpen, setServicesOpen] = useState(false);
  const panel = useRef<HTMLDivElement>(null);

  // Start at the top each time the menu opens, and move focus into the menu.
  useEffect(() => {
    if (!open) return;
    panel.current?.scrollTo(0, 0);
    const t = setTimeout(() => panel.current?.querySelector<HTMLElement>("a, button")?.focus(), 350);
    return () => clearTimeout(t);
  }, [open]);

  return (
    <div
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      data-open={open}
      inert={!open}
      className="mobile-menu fixed inset-0 z-40 bg-ink lg:hidden"
    >
      {/* Soft gold glow, echoing the hero aura */}
      <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-[28rem] w-[28rem] rounded-full bg-honey/10 blur-3xl" />

      <div
        ref={panel}
        data-lenis-prevent
        className="relative flex h-full flex-col overflow-y-auto overscroll-contain px-5 pb-[max(2rem,env(safe-area-inset-bottom))] pt-24 sm:px-8 md:pt-28"
      >
        <nav aria-label="Mobile" className="flex-1">
          <ul className="divide-y divide-wax/10 border-y border-wax/10">
            {nav.map((item, i) => (
              <li key={item.href} className="menu-item" style={{ "--i": i } as React.CSSProperties}>
                {"dropdown" in item ? (
                  <>
                    <button
                      type="button"
                      aria-expanded={servicesOpen}
                      aria-controls="mobile-services"
                      onClick={() => setServicesOpen((v) => !v)}
                      className={`display flex w-full items-center justify-between py-4 text-left text-[clamp(2.4rem,9vw,3.75rem)] transition-colors ${
                        servicesOpen ? "text-honey" : "text-wax"
                      }`}
                    >
                      {item.label}
                      <span
                        aria-hidden
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-wax/20"
                      >
                        <Chevron open={servicesOpen} large />
                      </span>
                    </button>
                    <div
                      id="mobile-services"
                      className={`grid transition-[grid-template-rows] duration-500 ease-[var(--ease-honey)] ${
                        servicesOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      }`}
                    >
                      <div className="overflow-hidden" inert={!servicesOpen}>
                        <div className="grid gap-6 pb-6 pt-1 sm:grid-cols-3 sm:gap-4">
                          {serviceGroups.map((g) => (
                            <div key={g.title}>
                              <p className="pb-2 text-sm font-semibold text-honey">{g.title}</p>
                              <ul>
                                {g.items.map((s) => (
                                  <li key={s.slug}>
                                    <Link
                                      href={servicePath(s.slug)}
                                      onClick={() => onClose()}
                                      className="block py-2.5 text-[17px] text-wax/85 transition-colors hover:text-honey"
                                    >
                                      {s.title}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                        <Link
                          href="/services"
                          onClick={() => onClose()}
                          className="mb-6 inline-block text-base font-semibold text-wax underline decoration-honey/60 underline-offset-[6px]"
                        >
                          View all services
                        </Link>
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    onClick={() => onClose()}
                    aria-current={isCurrent(item.href) ? "page" : undefined}
                    className={`display block py-4 text-[clamp(2.4rem,9vw,3.75rem)] transition-colors hover:text-honey ${
                      isCurrent(item.href) ? "text-honey" : "text-wax"
                    }`}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="menu-item mt-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between" style={{ "--i": nav.length } as React.CSSProperties}>
          <Link
            href={contactHref()}
            onClick={() => onClose()}
            className="inline-flex w-full items-center justify-center rounded-full bg-honey px-7 py-4 text-base font-semibold text-ink sm:w-auto"
          >
            Start a project
          </Link>
          <p className="text-center text-sm text-wax/60 sm:text-right">
            100% online. Email us at <span className="select-all text-wax">{site.email}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function Chevron({ open, large = false }: { open: boolean; large?: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 12 8"
      className={`${large ? "h-2.5 w-3.5" : "h-2 w-3"} shrink-0 transition-transform duration-300 ease-[var(--ease-honey)] ${
        open ? "rotate-180" : ""
      }`}
    >
      <path d="M1 1.5l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
