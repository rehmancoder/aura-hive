"use client";

import { useRef } from "react";
import { about } from "@/lib/site";
import { gsap, useGsap } from "@/lib/motion";

/** The mission, revealed line by line as it scrolls up the screen. */
export function Mission() {
  const root = useRef<HTMLElement>(null);

  useGsap(root, (el) => {
    gsap.fromTo(
      el.querySelectorAll("[data-line] > span"),
      { yPercent: 105, rotate: 3 },
      {
        yPercent: 0,
        rotate: 0,
        ease: "none",
        stagger: 0.25,
        scrollTrigger: { trigger: el, start: "top 80%", end: "center 55%", scrub: true },
      },
    );
  });

  return (
    <section ref={root} aria-labelledby="mission-title" className="relative py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <h2 id="mission-title" className="text-xl font-semibold text-honey sm:text-2xl">
          {about.mission.label}
        </h2>
        <p className="display mt-6 text-[clamp(2.6rem,7.5vw,7.25rem)] text-wax">
          {about.mission.lines.map((line) => (
            <span key={line} data-line className="block overflow-hidden pb-[0.06em]">
              <span className="inline-block origin-left">{line}</span>
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
