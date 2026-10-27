"use client";

import { useRef } from "react";
import { included, steps } from "@/lib/site";
import { gsap, ScrollTrigger, useGsap } from "@/lib/motion";

export function Process() {
  const root = useRef<HTMLElement>(null);

  useGsap(root, (el) => {
    const list = el.querySelector("[data-steps]");
    gsap.fromTo(
      el.querySelector("[data-progress]"),
      { scaleY: 0 },
      { scaleY: 1, ease: "none", scrollTrigger: { trigger: list, start: "top 60%", end: "bottom 60%", scrub: true } },
    );
    el.querySelectorAll<HTMLElement>("[data-step]").forEach((step) => {
      ScrollTrigger.create({
        trigger: step,
        start: "top 62%",
        end: "bottom 62%",
        toggleClass: { targets: step, className: "is-active" },
      });
    });
    el.querySelectorAll<HTMLElement>("[data-count]").forEach((node) => {
      const target = Number(node.dataset.count);
      const obj = { v: 0 };
      gsap.to(obj, {
        v: target,
        duration: 1.8,
        ease: "power2.out",
        scrollTrigger: { trigger: node, start: "top 90%" },
        onUpdate: () => {
          node.textContent = String(Math.round(obj.v));
        },
      });
    });
  });

  return (
    <section
      id="process"
      ref={root}
      data-stage="3"
      aria-labelledby="process-title"
      className="relative scroll-mt-16 py-24 md:py-36"
    >
      <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16">
        {/* Below the heading, the left half stays open on desktop: the particle swarm builds growth columns there. */}
        <div>
          <h2 id="process-title" className="display text-[clamp(2.75rem,7vw,6.5rem)] text-wax">
            How we grow you, month after month
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-wax/70 sm:text-lg">
            Four steps, repeated every month. Each cycle starts from what the last one taught the hive.
          </p>
        </div>

        <ol data-steps className="relative pl-9 md:pl-14">
          <span aria-hidden className="absolute left-[7px] top-2 h-[calc(100%-1rem)] w-[2px] rounded-full bg-wax/12 md:left-[11px]">
            <span data-progress className="block h-full w-full origin-top rounded-full bg-honey" />
          </span>
          {steps.map((step, i) => (
            <li key={step.title} data-step className="step group relative pb-12 last:pb-0 md:pb-20">
              <span
                aria-hidden
                className="step-dot absolute -left-9 top-3 flex h-4 w-4 items-center justify-center rounded-full border-2 border-wax/25 bg-ink transition-colors duration-500 md:-left-14 md:h-6 md:w-6"
              />
              <p className="text-sm font-medium text-honey">Step {i + 1}</p>
              <h3 className="step-title display mt-2 text-[clamp(2.6rem,6vw,5.5rem)] text-wax/30 transition-colors duration-500">
                {step.title}
              </h3>
              <p className="mt-3 max-w-md text-base leading-relaxed text-wax/75 sm:text-lg">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="mx-auto mt-20 max-w-7xl px-5 sm:px-8 md:mt-32">
        <h3 className="text-xl font-semibold text-wax">Included on every account</h3>
        <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-[24px] md:mt-8 md:rounded-[28px] border border-wax/10 bg-wax/10 lg:grid-cols-4">
          {included.map((item) => (
            <div key={item.label} className="flex flex-col-reverse gap-2 bg-ink/80 p-5 backdrop-blur-md sm:p-6 md:gap-3 md:p-9">
              <dt className="text-sm leading-snug text-wax/70 md:text-base">{item.label}</dt>
              <dd className="display text-[clamp(2.75rem,7vw,6.5rem)] tabular-nums text-honey">
                <span data-count={item.value}>{item.value}</span>
                {item.suffix}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
