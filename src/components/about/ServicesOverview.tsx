"use client";

import Link from "next/link";
import { useRef } from "react";
import { about, servicePath, serviceGroups } from "@/lib/site";
import { gsap, useGsap } from "@/lib/motion";

/** The nine services in their three groups, each linking to its own page. */
export function ServicesOverview() {
  const root = useRef<HTMLElement>(null);

  useGsap(root, (el) => {
    el.querySelectorAll<HTMLElement>("[data-group]").forEach((g, i) => {
      gsap.from(g, {
        y: 70,
        opacity: 0,
        duration: 1.1,
        delay: i * 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: el.querySelector("[data-groups]"), start: "top 85%" },
      });
    });
  });

  return (
    <section ref={root} aria-labelledby="what-title" className="relative py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h2 id="what-title" className="display text-[clamp(2.75rem,7vw,6.5rem)] text-wax">
            {about.services.title}
          </h2>
          <div className="max-w-sm">
            <p className="text-base leading-relaxed text-wax/70 sm:text-lg">{about.services.intro}</p>
            <Link
              href="/services"
              className="mt-5 inline-block text-base font-semibold text-wax underline decoration-honey/60 underline-offset-[6px] transition-colors hover:text-honey"
            >
              View all services
            </Link>
          </div>
        </div>

        <div data-groups className="mt-12 grid gap-4 md:mt-20 lg:grid-cols-3 lg:gap-5">
          {serviceGroups.map((g, gi) => (
            <div key={g.title} data-group className="rounded-[24px] border border-wax/10 bg-comb/55 p-3 backdrop-blur-md md:rounded-[28px]">
              <h3 className="flex items-center gap-3 px-4 pb-2 pt-4 text-lg font-semibold text-honey">
                <span aria-hidden className="flex h-5 items-end gap-[3px]">
                  {[0.55, 1, 0.55].map((h, i) => (
                    <span
                      key={i}
                      className={`w-[4px] rounded-full ${i === gi ? "bg-honey" : "bg-honey/35"}`}
                      style={{ height: `${h * 100}%` }}
                    />
                  ))}
                </span>
                {g.title}
              </h3>
              <ul>
                {g.items.map((s) => (
                  <li key={s.slug}>
                    <Link
                      href={servicePath(s.slug)}
                      className="group flex items-center justify-between gap-4 rounded-[18px] px-4 py-4 transition-colors hover:bg-wax/[0.06]"
                    >
                      <span>
                        <span className="block text-lg font-medium text-wax transition-colors group-hover:text-honey">
                          {s.title}
                        </span>
                        <span className="mt-0.5 block text-[15px] leading-snug text-wax/65">{s.short}</span>
                      </span>
                      <span
                        aria-hidden
                        className="h-8 w-[3px] shrink-0 origin-bottom scale-y-50 rounded-full bg-honey/40 transition-transform duration-500 ease-[var(--ease-honey)] group-hover:scale-y-100 group-hover:bg-honey"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
