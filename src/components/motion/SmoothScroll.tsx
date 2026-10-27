"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { gsap, prefersReducedMotion, ScrollTrigger } from "@/lib/motion";
import { findOnPage, resetScroll, scrollToTarget, setLenis } from "@/lib/scroll";

/** Lenis smooth scrolling, synced with GSAP ScrollTrigger, plus smooth same-page anchor links. */
export function SmoothScroll() {
  const pathname = usePathname();

  // Moving to another page: start at the top (or at #section), and re-measure scroll animations.
  useEffect(() => {
    const hash = window.location.hash;
    const target = hash ? findOnPage(decodeURIComponent(hash.slice(1))) : null;
    if (target) setTimeout(() => scrollToTarget(target), 400);
    else resetScroll();
    const t = setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => clearTimeout(t);
  }, [pathname]);

  useEffect(() => {
    let lenis: Lenis | null = null;
    let tick: ((t: number) => void) | null = null;

    // After the first page load, later page visits skip the intro wait.
    const intro = setTimeout(() => document.documentElement.style.setProperty("--intro", "100ms"), 4000);

    // Mobile browsers resize the viewport as the address bar hides; don't re-layout pinned sections for that.
    ScrollTrigger.config({ ignoreMobileResize: true });

    if (!prefersReducedMotion()) {
      lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1, touchMultiplier: 1.2 });
      lenis.on("scroll", ScrollTrigger.update);
      tick = (t: number) => lenis?.raf(t * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      setLenis(lenis);
    }

    // Runs in the capture phase, before Next.js Link. Preventing the default here tells Link to skip
    // its own jump, while the link's own onClick (e.g. closing the mobile menu) still runs.
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>("a[href*='#']");
      if (!a) return;
      const url = new URL(a.href, window.location.href);
      if (url.pathname !== window.location.pathname || !url.hash) return;
      const target = findOnPage(decodeURIComponent(url.hash.slice(1)));
      if (!target) return;
      e.preventDefault();
      history.replaceState(null, "", url.hash);
      // Wait a frame so menus can close and release scrolling first.
      requestAnimationFrame(() => scrollToTarget(target));
    };
    document.addEventListener("click", onClick, true);

    // Fonts and images change layout; re-measure pinned sections once settled.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh);

    return () => {
      clearTimeout(intro);
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("load", refresh);
      if (tick) gsap.ticker.remove(tick);
      setLenis(null);
      lenis?.destroy();
    };
  }, []);

  return null;
}
