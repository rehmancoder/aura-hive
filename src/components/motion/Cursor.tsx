"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/motion";

/** Gold cursor ring that trails the pointer and swells over links. Mouse and trackpad only. */
export function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches || prefersReducedMotion()) return;
    const r = ring.current!;
    const d = dot.current!;
    document.documentElement.classList.add("has-cursor");
    gsap.set([r, d], { xPercent: -50, yPercent: -50, opacity: 0 });
    const rx = gsap.quickTo(r, "x", { duration: 0.5, ease: "power3" });
    const ry = gsap.quickTo(r, "y", { duration: 0.5, ease: "power3" });
    const dx = gsap.quickTo(d, "x", { duration: 0.08 });
    const dy = gsap.quickTo(d, "y", { duration: 0.08 });

    const move = (e: PointerEvent) => {
      gsap.to([r, d], { opacity: 1, duration: 0.3, overwrite: "auto" });
      rx(e.clientX);
      ry(e.clientY);
      dx(e.clientX);
      dy(e.clientY);
      const hot = (e.target as HTMLElement).closest("a, button, summary, [data-cursor]");
      gsap.to(r, { scale: hot ? 1.9 : 1, duration: 0.35, ease: "power3", overwrite: "auto" });
    };
    const leave = () => gsap.to([r, d], { opacity: 0, duration: 0.3 });
    window.addEventListener("pointermove", move);
    document.addEventListener("pointerleave", leave);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <>
      <div
        ref={ring}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[60] h-9 w-9 rounded-full border border-honey/80 opacity-0 mix-blend-difference"
      />
      <div
        ref={dot}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[60] h-1.5 w-1.5 rounded-full bg-honey opacity-0"
      />
    </>
  );
}
