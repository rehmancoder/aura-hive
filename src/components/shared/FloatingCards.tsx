"use client";

import { useRef } from "react";
import { gsap, useGsap } from "@/lib/motion";

type Card = { label: string; value: string };
type Spot = { className: string; depth: number };

type Props = {
  cards: readonly Card[];
  /** Where each card floats (Tailwind position classes) and how strongly it follows the pointer. */
  spots: readonly Spot[];
  /** Delay before the first card appears, in ms after the page intro. */
  delay?: number;
};

/** Small glass cards around a hero's 3D scene. They drift with the pointer and fade as you scroll away. Desktop only. */
export function FloatingCards({ cards, spots, delay = 850 }: Props) {
  const root = useRef<HTMLDivElement>(null);

  useGsap(root, (el) => {
    const nodes = gsap.utils.toArray<HTMLElement>("[data-float]", el);
    const movers = nodes.map((c) => ({
      x: gsap.quickTo(c, "x", { duration: 1.2, ease: "power3" }),
      y: gsap.quickTo(c, "y", { duration: 1.2, ease: "power3" }),
      depth: Number(c.dataset.depth),
    }));
    const onMove = (e: PointerEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      movers.forEach((m) => {
        m.x(-nx * m.depth);
        m.y(-ny * m.depth);
      });
    };
    window.addEventListener("pointermove", onMove);

    gsap.to(el, {
      yPercent: -18,
      opacity: 0,
      ease: "none",
      scrollTrigger: { trigger: el.parentElement, start: "top top", end: "60% top", scrub: true },
    });
    return () => window.removeEventListener("pointermove", onMove);
  });

  return (
    <div ref={root} aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block">
      {cards.map((c, i) => (
        <div key={c.value} data-float data-depth={spots[i].depth} className={`absolute ${spots[i].className}`}>
          <div
            className="signal-in flex items-center gap-3 rounded-2xl border border-honey/20 bg-comb/60 px-4 py-3 backdrop-blur-md"
            style={{ animationDelay: `calc(var(--intro) + ${delay + i * 180}ms), ${i * 0.7}s` }}
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-honey/60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-honey" />
            </span>
            <span className="text-sm leading-tight">
              <span className="block text-wax/60">{c.label}</span>
              <span className="block font-medium text-wax">{c.value}</span>
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
