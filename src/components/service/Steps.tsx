"use client";

import { useRef } from "react";
import { gsap, useGsap } from "@/lib/motion";
import type { ServiceDetail } from "@/lib/site";

/** How it works: three steps joined by a gold line that draws itself as you scroll. */
export function Steps({
  steps,
  title = "How it works",
  stage = 2,
}: {
  steps: ServiceDetail["steps"];
  title?: string;
  /** This section's step in the page's 3D scene. */
  stage?: number;
}) {
  const root = useRef<HTMLElement>(null);

  useGsap(root, (el) => {
    const mm = gsap.matchMedia();
    const list = el.querySelector("[data-steps]");
    mm.add("(min-width: 768px)", () => {
      gsap.fromTo(
        el.querySelector("[data-line]"),
        { scaleX: 0 },
        { scaleX: 1, ease: "none", scrollTrigger: { trigger: list, start: "top 75%", end: "top 35%", scrub: true } },
      );
    });
    mm.add("(max-width: 767px)", () => {
      gsap.fromTo(
        el.querySelector("[data-line-v]"),
        { scaleY: 0 },
        { scaleY: 1, ease: "none", scrollTrigger: { trigger: list, start: "top 70%", end: "bottom 60%", scrub: true } },
      );
    });
    el.querySelectorAll<HTMLElement>("[data-step]").forEach((step, i) => {
      gsap.from(step, {
        y: 50,
        opacity: 0,
        duration: 1,
        delay: i * 0.12,
        ease: "power3.out",
        scrollTrigger: { trigger: list, start: "top 75%" },
      });
    });
    return () => mm.revert();
  });

  return (
    <section ref={root} data-stage={stage} aria-labelledby="steps-title" className="relative py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <h2 id="steps-title" className="display text-[clamp(2.75rem,6.5vw,6rem)] text-wax">
          {title}
        </h2>

        <div data-steps className="relative mt-14 md:mt-20">
          {/* Connecting line: horizontal on tablet and desktop, vertical on phones */}
          <span aria-hidden className="absolute left-0 right-0 top-[1.15rem] hidden h-[2px] rounded-full bg-wax/12 md:block">
            <span data-line className="block h-full origin-left rounded-full bg-honey" />
          </span>
          <span aria-hidden className="absolute bottom-6 left-[1.1rem] top-2 w-[2px] rounded-full bg-wax/12 md:hidden">
            <span data-line-v className="block h-full origin-top rounded-full bg-honey" />
          </span>

          <ol className="grid gap-12 md:grid-cols-3 md:gap-8">
            {steps.map((s, i) => (
              <li key={s.title} data-step className="relative pl-14 md:pl-0">
                <span className="absolute left-0 top-0 flex h-[2.3rem] w-[2.3rem] items-center justify-center rounded-full border-2 border-honey bg-ink text-sm font-semibold text-honey md:relative">
                  {i + 1}
                </span>
                <h3 className="display mt-0 text-[clamp(2.25rem,4vw,3.5rem)] text-wax md:mt-8">{s.title}</h3>
                <p className="mt-3 max-w-sm text-base leading-relaxed text-wax/75 sm:text-lg">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
