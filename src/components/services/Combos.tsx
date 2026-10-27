"use client";

import Link from "next/link";
import { useRef } from "react";
import { contactHref, servicePath, services, servicesPage } from "@/lib/site";
import { gsap, useGsap } from "@/lib/motion";

const bySlug = (slug: string) => services.find((s) => s.slug === slug)!;

/** Three common combinations. Each card's three services slide together as it scrolls into view. */
export function Combos() {
  const root = useRef<HTMLElement>(null);

  useGsap(root, (el) => {
    el.querySelectorAll<HTMLElement>("[data-combo]").forEach((card) => {
      gsap.fromTo(
        card.querySelectorAll("[data-chip]"),
        { x: (i) => (i - 1) * 70, opacity: 0, rotate: (i) => (i - 1) * 6 },
        {
          x: 0,
          opacity: 1,
          rotate: 0,
          ease: "power2.out",
          stagger: 0.05,
          scrollTrigger: { trigger: card, start: "top 90%", end: "top 55%", scrub: true },
        },
      );
    });
  });

  return (
    <section ref={root} data-stage="4" aria-labelledby="combos-title" className="relative py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h2 id="combos-title" className="display text-[clamp(2.75rem,7vw,6.5rem)] text-wax">
            {servicesPage.combos.title}
          </h2>
          <p className="max-w-sm text-base leading-relaxed text-wax/70 sm:text-lg">{servicesPage.combos.intro}</p>
        </div>

        <ul className="mt-12 grid gap-4 md:mt-20 lg:grid-cols-3 lg:gap-5">
          {servicesPage.combos.items.map((c, ci) => (
            <li
              key={c.title}
              data-combo
              className={`flex flex-col overflow-hidden rounded-[24px] border p-6 backdrop-blur-md sm:p-8 md:rounded-[32px] ${
                ci === 1 ? "border-honey/40 bg-honey/[0.08]" : "border-wax/10 bg-comb/55"
              }`}
            >
              <ul className="flex flex-col gap-2" aria-label={`${c.title} includes`}>
                {c.slugs.map((slug) => {
                  const s = bySlug(slug);
                  return (
                    <li key={slug} data-chip>
                      <Link
                        href={servicePath(slug)}
                        className="flex items-center justify-between gap-3 rounded-2xl border border-wax/10 bg-ink/60 px-4 py-3.5 text-[15px] font-medium text-wax transition-colors hover:border-honey/50 hover:text-honey sm:text-base"
                      >
                        {s.title}
                        <span aria-hidden className="h-4 w-1.5 shrink-0 rounded-full bg-honey" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <h3 className="display mt-10 text-[clamp(2.25rem,3.6vw,3.25rem)] text-wax">{c.title}</h3>
              <p className="mt-3 flex-1 text-base leading-relaxed text-wax/75">{c.body}</p>
              <Link
                href={contactHref({ plan: c.id })}
                className="mt-8 inline-block w-fit text-base font-semibold text-wax underline decoration-honey/60 underline-offset-[6px] transition-colors hover:text-honey"
              >
                Ask about {c.title.toLowerCase()}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
