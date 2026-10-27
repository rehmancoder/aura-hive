"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/motion";

type Props = {
  href: string;
  children: React.ReactNode;
  className?: string;
  strength?: number;
};

/** A link that leans toward the pointer, with its label moving a little further. */
export function MagneticLink({ href, children, className, strength = 0.35 }: Props) {
  const el = useRef<HTMLAnchorElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const a = el.current;
    if (!a || !window.matchMedia("(pointer: fine)").matches || prefersReducedMotion()) return;
    const x = gsap.quickTo(a, "x", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
    const y = gsap.quickTo(a, "y", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
    const lx = gsap.quickTo(label.current, "x", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
    const ly = gsap.quickTo(label.current, "y", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
    const move = (e: PointerEvent) => {
      const r = a.getBoundingClientRect();
      const mx = e.clientX - (r.left + r.width / 2);
      const my = e.clientY - (r.top + r.height / 2);
      x(mx * strength);
      y(my * strength);
      lx(mx * strength * 0.4);
      ly(my * strength * 0.4);
    };
    const leave = () => {
      x(0);
      y(0);
      lx(0);
      ly(0);
    };
    a.addEventListener("pointermove", move);
    a.addEventListener("pointerleave", leave);
    return () => {
      a.removeEventListener("pointermove", move);
      a.removeEventListener("pointerleave", leave);
    };
  }, [strength]);

  return (
    <Link ref={el} href={href} className={className}>
      <span ref={label} className="inline-block">
        {children}
      </span>
    </Link>
  );
}
