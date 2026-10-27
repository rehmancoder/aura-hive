"use client";

import { useRef } from "react";
import { gsap, useGsap } from "@/lib/motion";
import type { Service } from "@/lib/site";
import { TiltCard } from "../motion/TiltCard";

/** What's included: four tiles that rise into place, with the service's outlined word drifting behind them. */
export function Included({ service }: { service: Service }) {
  const root = useRef<HTMLElement>(null);

  useGsap(root, (el) => {
    gsap.from(el.querySelectorAll("[data-tile]"), {
      y: 80,
      rotateX: -20,
      opacity: 0,
      duration: 1.1,
      ease: "power3.out",
      stagger: 0.09,
      scrollTrigger: { trigger: el.querySelector("[data-tiles]"), start: "top 85%" },
    });
    gsap.fromTo(
      el.querySelector("[data-bgword]"),
      { xPercent: 8 },
      { xPercent: -14, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } },
    );
  });

  return (
    <section ref={root} data-stage="1" aria-labelledby="included-title" className="relative overflow-hidden py-24 md:py-36">
      <span
        data-bgword
        aria-hidden
        data-allow-overflow
        className="display text-outline pointer-events-none absolute right-0 top-10 select-none whitespace-nowrap text-[clamp(8rem,24vw,22rem)] leading-none opacity-50"
      >
        {service.word}
      </span>

      <div className="relative mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div>
          <h2 id="included-title" className="display text-[clamp(2.75rem,6.5vw,6rem)] text-wax">
            What&apos;s included
          </h2>
          <p className="mt-5 max-w-sm text-base leading-relaxed text-wax/75 sm:text-lg">{service.body}</p>
          <ul className="mt-6 flex flex-wrap gap-2" aria-label={`${service.title} covers`}>
            {service.tags.map((t) => (
              <li key={t} className="rounded-full border border-honey/35 bg-ink/50 px-3.5 py-1.5 text-sm text-honey backdrop-blur-md">
                {t}
              </li>
            ))}
          </ul>
        </div>

        <ul data-tiles className="grid gap-4 [perspective:1200px] sm:grid-cols-2 lg:gap-5">
          {service.includes.map((item, i) => (
            <li key={item} data-tile className={i % 2 ? "sm:translate-y-10" : ""}>
              <TiltCard
                className="h-full rounded-[24px] border border-wax/10 bg-comb/60 p-6 backdrop-blur-md sm:p-7 md:rounded-[28px]"
                innerClassName="flex h-full min-h-[9rem] flex-col justify-between gap-8"
              >
                <span aria-hidden className="flex h-6 items-end gap-[3px]">
                  {[0.55, 1, 0.55].map((h, b) => (
                    <span key={b} className="w-[4px] rounded-full bg-honey" style={{ height: `${h * 100}%` }} />
                  ))}
                </span>
                <h3 className="text-xl font-semibold leading-snug tracking-tight text-wax sm:text-2xl">{item}</h3>
              </TiltCard>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
