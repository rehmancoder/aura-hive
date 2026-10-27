"use client";

import { useRef } from "react";
import { about } from "@/lib/site";
import { gsap, useGsap } from "@/lib/motion";

/** "Aura" and "Hive" as giant outlined words that fill with gold as you scroll past them. */
export function NameStory() {
  const root = useRef<HTMLElement>(null);

  useGsap(root, (el) => {
    el.querySelectorAll<HTMLElement>("[data-part]").forEach((part) => {
      gsap.fromTo(
        part.querySelector("[data-fill]"),
        { backgroundPosition: "100% 0" },
        {
          backgroundPosition: "0% 0",
          ease: "none",
          scrollTrigger: { trigger: part, start: "top 85%", end: "top 30%", scrub: true },
        },
      );
      gsap.from(part.querySelector("[data-copy]"), {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: part, start: "top 70%" },
      });
    });
  });

  return (
    <section id="story" ref={root} data-stage="1" aria-labelledby="story-title" className="relative scroll-mt-16 py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <h2 id="story-title" className="text-xl font-semibold text-honey sm:text-2xl">
          {about.name.title}
        </h2>

        <div className="mt-10 space-y-16 md:mt-14 md:space-y-24">
          {about.name.parts.map((p, i) => (
            <div
              key={p.word}
              data-part
              className={`grid items-end gap-6 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] md:gap-12 ${
                i % 2 ? "md:[&>*:first-child]:order-2" : ""
              }`}
            >
              <h3 data-fill className="name-fill display text-[clamp(6.5rem,26vw,22rem)] leading-[0.78]">
                {p.word}
              </h3>
              <div data-copy className="md:pb-[1.5rem]">
                <p className="max-w-md text-base leading-relaxed text-wax/80 sm:text-lg md:text-xl">{p.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
