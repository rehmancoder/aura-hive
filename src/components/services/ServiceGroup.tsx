"use client";

import Link from "next/link";
import { useRef } from "react";
import { servicePath, serviceGroups } from "@/lib/site";
import { gsap, useGsap } from "@/lib/motion";

type Props = { index: number; stage: number };

/**
 * One group of three services. On desktop the group title stays pinned on the left while
 * its service cards scroll past on the right, and a gold bar fills as you move through them.
 */
export function ServiceGroup({ index, stage }: Props) {
  const group = serviceGroups[index];
  const root = useRef<HTMLElement>(null);

  useGsap(root, (el) => {
    gsap.fromTo(
      el.querySelector("[data-progress]"),
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: "none",
        scrollTrigger: { trigger: el.querySelector("[data-cards]"), start: "top 70%", end: "bottom 70%", scrub: true },
      },
    );
    el.querySelectorAll<HTMLElement>("[data-card]").forEach((card) => {
      gsap.fromTo(
        card,
        { clipPath: "inset(12% 6% 12% 6% round 32px)", opacity: 0.2 },
        {
          clipPath: "inset(0% 0% 0% 0% round 32px)",
          opacity: 1,
          ease: "none",
          scrollTrigger: { trigger: card, start: "top 95%", end: "top 55%", scrub: true },
        },
      );
      gsap.fromTo(
        card.querySelector("[data-bgword]"),
        { yPercent: 25 },
        {
          yPercent: -25,
          ease: "none",
          scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    });
  });

  return (
    <section
      id={group.id}
      ref={root}
      data-stage={stage}
      aria-labelledby={`${group.id}-title`}
      className="relative scroll-mt-16 py-20 md:py-28"
    >
      <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="flex items-center gap-3 text-[15px] font-medium text-honey">
            <span aria-hidden className="flex h-5 items-end gap-[3px]">
              {[0.55, 1, 0.55].map((h, i) => (
                <span
                  key={i}
                  className={`w-[4px] rounded-full ${i === index ? "bg-honey" : "bg-honey/30"}`}
                  style={{ height: `${h * 100}%` }}
                />
              ))}
            </span>
            Group {index + 1} of {serviceGroups.length}
          </div>
          <h2 id={`${group.id}-title`} className="display mt-5 text-[clamp(2.75rem,6.5vw,6rem)] text-wax">
            {group.title}
          </h2>
          <p className="mt-5 max-w-sm text-base leading-relaxed text-wax/75 sm:text-lg">{group.intro}</p>

          {/* Desktop: which service in the group you're looking at */}
          <div className="mt-10 hidden gap-5 lg:flex">
            <span aria-hidden className="relative w-[3px] rounded-full bg-wax/12">
              <span data-progress className="absolute inset-0 origin-top rounded-full bg-honey" />
            </span>
            <ul className="space-y-3 text-[15px]">
              {group.items.map((s) => (
                <li key={s.slug}>
                  <a href={`#${s.slug}`} className="text-wax/70 transition-colors hover:text-honey">
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div data-cards className="space-y-5">
          {group.items.map((s) => (
            <article
              key={s.slug}
              id={s.slug}
              data-card
              className="relative scroll-mt-24 overflow-hidden rounded-[24px] border border-wax/12 bg-comb/55 p-6 backdrop-blur-md sm:p-9 md:rounded-[32px] lg:p-11"
            >
              <span
                data-bgword
                aria-hidden
                data-allow-overflow
                className="display text-outline pointer-events-none absolute -bottom-[0.16em] -right-[0.04em] select-none whitespace-nowrap text-[clamp(6rem,15vw,13rem)] leading-none opacity-40"
              >
                {s.word}
              </span>
              <div className="relative">
                <h3 className="display text-[clamp(2.4rem,4.6vw,4.25rem)] text-wax">{s.title}</h3>
                <p className="mt-2 text-base font-medium text-honey sm:text-lg">{s.short}</p>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-wax/75 sm:text-lg">{s.body}</p>

                <h4 className="mt-8 text-sm font-semibold text-wax/90">What&apos;s included</h4>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {s.includes.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-[15px] leading-snug text-wax/85 sm:text-base">
                      <span aria-hidden className="mt-[0.2em] h-4 w-1.5 shrink-0 rounded-full bg-honey" />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4 border-t border-wax/10 pt-6">
                  <Link
                    href={servicePath(s.slug)}
                    className="rounded-full bg-wax/[0.08] px-5 py-3 text-[15px] font-semibold text-wax transition-colors hover:bg-honey hover:text-ink"
                  >
                    Explore {s.title}
                  </Link>
                  <ul className="flex flex-wrap gap-2" aria-label={`${s.title} channels`}>
                    {s.tags.map((t) => (
                      <li key={t} className="rounded-full border border-honey/30 px-3 py-1 text-sm text-honey">
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
