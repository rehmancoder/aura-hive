"use client";

import type Lenis from "lenis";

/** Shared handle to the smooth-scroll instance, so menus can pause page scrolling while open. */
let lenis: Lenis | null = null;

export function setLenis(instance: Lenis | null) {
  lenis = instance;
}

export function lockScroll(locked: boolean) {
  const root = document.documentElement;
  if (locked) {
    lenis?.stop();
    root.style.overflow = "hidden";
  } else {
    lenis?.start();
    root.style.overflow = "";
  }
}

/** Jump to the top instantly (used when moving to another page). */
export function resetScroll() {
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
  else window.scrollTo(0, 0);
}

/**
 * Element with this id on the page that's on screen. Pages you navigated away from stay in the
 * DOM, hidden (Next.js keeps them in <Activity>), so the same id can appear more than once.
 */
export function findOnPage(id: string) {
  const all = document.querySelectorAll<HTMLElement>(`[id="${CSS.escape(id)}"]`);
  return Array.from(all).find((el) => el.getClientRects().length > 0) ?? null;
}

export function scrollToTarget(target: HTMLElement) {
  if (lenis) lenis.scrollTo(target, { duration: 1.4 });
  else target.scrollIntoView({ behavior: "smooth" });
}
