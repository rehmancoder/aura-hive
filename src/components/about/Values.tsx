"use client";

import { useRef } from "react";
import { about } from "@/lib/site";
import { gsap, useGsap } from "@/lib/motion";
import { TiltCard } from "../motion/TiltCard";

// Column heights mirror the logo: short, tall, short (desktop only).
const heights = ["lg:min-h-[26rem]", "lg:min-h-[34rem]", "lg:min-h-[26rem]"];

/** Three values as three columns that rise like the bars of the logo. */
export function Values() {
  const root = useRef<HTMLElement>(null);

  useGsap(root, (el) => {
    const mm = gsap.matchMedia();
    const cols = el.querySelectorAll("[data-value]");
    mm.add("(min-width: 1024px)", () => {
      gsap.fromTo(
        cols,
        { clipPath: "inset(100% 0% 0% 0% round 32px)" },
        {
          clipPath: "inset(0% 0% 0% 0% round 32px)",
          ease: "none",
          stagger: 0.15,
          scrollTrigger: { trigger: el.querySelector("[data-values]"), start: "top 85%", end: "top 35%", scrub: true },
        },
      );
    });
    mm.add("(max-width: 1023px)", () => {
      cols.forEach((c) =>
        gsap.from(c, { y: 50, opacity: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: c, start: "top 88%" } }),
      );
    });
    return () => mm.revert();
  });

  return (
    <section ref={root} data-stage="2" aria-labelledby="values-title" className="relative py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h2 id="values-title" className="display text-[clamp(2.75rem,7vw,6.5rem)] text-wax">
            {about.values.title}
          </h2>
          <p className="max-w-sm text-base leading-relaxed text-wax/70 sm:text-lg">{about.values.intro}</p>
        </div>

        <ul data-values className="mt-12 grid gap-4 [perspective:1400px] md:mt-20 lg:grid-cols-3 lg:items-end lg:gap-5">
          {about.values.items.map((v, i) => (
            <li key={v.title} data-value className={`flex ${heights[i]}`}>
              <TiltCard
                className={`w-full rounded-[24px] border p-6 backdrop-blur-md sm:p-8 md:rounded-[32px] lg:p-10 ${
                  i === 1 ? "border-honey/40 bg-honey/[0.08]" : "border-wax/10 bg-comb/55"
                }`}
                innerClassName="flex h-full flex-col justify-between gap-12"
              >
                <span aria-hidden className="block h-10 w-2.5 rounded-full bg-honey lg:h-14" style={{ opacity: i === 1 ? 1 : 0.55 }} />
                <div>
                  <h3 className="display text-[clamp(2.25rem,4vw,3.5rem)] text-wax">{v.title}</h3>
                  <p className="mt-4 text-base leading-relaxed text-wax/75 sm:text-lg">{v.body}</p>
                </div>
              </TiltCard>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
