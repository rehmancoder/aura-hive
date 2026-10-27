"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useLayoutEffect, type RefObject } from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Runs GSAP code scoped to an element and reverts it on unmount.
 * Skipped entirely for visitors who prefer reduced motion, so the
 * page always renders complete without animation.
 */
export function useGsap(
  scope: RefObject<HTMLElement | null>,
  setup: (root: HTMLElement) => void | (() => void),
  deps: unknown[] = [],
) {
  useIsoLayoutEffect(() => {
    const root = scope.current;
    if (!root || prefersReducedMotion()) return;
    let cleanup: void | (() => void);
    const ctx = gsap.context(() => {
      cleanup = setup(root);
    }, root);
    return () => {
      if (typeof cleanup === "function") cleanup();
      ctx.revert();
    };
  }, deps);
}
