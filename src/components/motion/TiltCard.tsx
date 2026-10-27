"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/motion";

/** Card that tilts in 3D toward the pointer, with a soft gold glare that follows it. */
export function TiltCard({
  children,
  className = "",
  innerClassName = "",
}: {
  children: React.ReactNode;
  className?: string;
  /** Layout classes for the content layer (it sits slightly forward in 3D). */
  innerClassName?: string;
}) {
  const el = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = el.current;
    if (!card || !window.matchMedia("(pointer: fine)").matches || prefersReducedMotion()) return;
    const rx = gsap.quickTo(card, "rotationX", { duration: 0.6, ease: "power3" });
    const ry = gsap.quickTo(card, "rotationY", { duration: 0.6, ease: "power3" });
    const move = (e: PointerEvent) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      rx((0.5 - py) * 14);
      ry((px - 0.5) * 16);
      card.style.setProperty("--gx", `${px * 100}%`);
      card.style.setProperty("--gy", `${py * 100}%`);
    };
    const leave = () => {
      rx(0);
      ry(0);
    };
    card.addEventListener("pointermove", move);
    card.addEventListener("pointerleave", leave);
    return () => {
      card.removeEventListener("pointermove", move);
      card.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div ref={el} className={`tilt-card relative [transform-style:preserve-3d] ${className}`}>
      <div className={`[transform:translateZ(40px)] ${innerClassName}`}>{children}</div>
    </div>
  );
}
