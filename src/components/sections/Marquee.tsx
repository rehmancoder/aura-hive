"use client";

import { useRef } from "react";
import { LogoMark } from "../Logo";
import { gsap, ScrollTrigger, useGsap } from "@/lib/motion";

type Props = {
  items: readonly string[];
  reverse?: boolean;
  outline?: boolean;
  label: string;
};

/** Endless ribbon of large type. Scrolling speeds it up and leans it in the scroll direction. */
export function Marquee({ items, reverse = false, outline = false, label }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGsap(root, () => {
    const t = track.current!;
    const loop = gsap.fromTo(
      t,
      { xPercent: reverse ? -50 : 0 },
      { xPercent: reverse ? 0 : -50, duration: 38, ease: "none", repeat: -1 },
    );
    const skew = gsap.quickTo(t, "skewX", { duration: 0.6, ease: "power3" });
    let settle: gsap.core.Tween | null = null;
    ScrollTrigger.create({
      trigger: root.current,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        const v = self.getVelocity();
        const boost = gsap.utils.clamp(-6, 6, v / 400);
        loop.timeScale(self.direction * (1 + Math.abs(boost)));
        skew(gsap.utils.clamp(-10, 10, -v / 220));
        settle?.kill();
        settle = gsap.to(loop, {
          timeScale: self.direction >= 0 ? 1 : -1,
          duration: 1.2,
          delay: 0.15,
          ease: "power2.out",
          onComplete: () => skew(0),
        });
      },
    });
  });

  const row = (hidden: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <span key={item} className="flex items-center text-[clamp(2.75rem,9vw,8.5rem)]">
          <span
            className={`display whitespace-nowrap px-6 md:px-10 ${
              outline ? "text-outline" : "text-wax"
            }`}
          >
            {item}
          </span>
          <LogoMark className="h-[0.42em] w-auto shrink-0 text-honey" />
        </span>
      ))}
    </div>
  );

  return (
    <div ref={root} className="relative overflow-hidden py-5 md:py-10" role="region" aria-label={label} data-allow-overflow>
      <div ref={track} className="flex w-max will-change-transform">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
