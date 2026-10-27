"use client";

import Link from "next/link";
import { useRef } from "react";
import { servicePath, services } from "@/lib/site";
import { gsap, useGsap } from "@/lib/motion";

/**
 * Tablet and desktop: the section pins and vertical scrolling moves the service panels sideways.
 * Phones: the same panels stack vertically, which is easier to read and scroll with a thumb.
 */
export function ServicesScroller() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  useGsap(root, (el) => {
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const t = track.current!;
      const distance = () => t.scrollWidth - window.innerWidth;
      const move = gsap.to(t, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });
      gsap.fromTo(
        bar.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top top", end: () => `+=${distance()}`, scrub: true, invalidateOnRefresh: true },
        },
      );
      el.querySelectorAll<HTMLElement>("[data-panel]").forEach((panel) => {
        gsap.fromTo(
          panel.querySelector("[data-bgword]"),
          { xPercent: 30 },
          {
            xPercent: -30,
            ease: "none",
            scrollTrigger: { trigger: panel, containerAnimation: move, start: "left right", end: "right left", scrub: true },
          },
        );
        gsap.from(panel.querySelector("[data-panel-body]"), {
          y: 60,
          opacity: 0,
          ease: "power3.out",
          scrollTrigger: { trigger: panel, containerAnimation: move, start: "left 80%", end: "left 40%", scrub: true },
        });
      });
    });

    mm.add("(max-width: 767px)", () => {
      el.querySelectorAll<HTMLElement>("[data-panel]").forEach((panel) => {
        gsap.fromTo(
          panel.querySelector("[data-bgword]"),
          { xPercent: 12 },
          {
            xPercent: -18,
            ease: "none",
            scrollTrigger: { trigger: panel, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
        gsap.from(panel, {
          y: 50,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: panel, start: "top 90%" },
        });
      });
    });

    return () => mm.revert();
  });

  return (
    <section id="services" ref={root} data-stage="2" aria-labelledby="services-title" className="relative overflow-hidden">
      <div
        ref={track}
        className="flex flex-col gap-4 px-5 py-24 sm:px-8 md:h-[100svh] md:w-max md:flex-row md:items-center md:gap-8 md:py-0"
      >
        <div className="flex shrink-0 flex-col justify-center pb-6 md:w-[44vw] md:max-w-[40rem] md:pb-0">
          <h2 id="services-title" className="display text-[clamp(2.75rem,7.5vw,7rem)] text-wax">
            Everything your brand needs to grow online.
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-wax/70 sm:text-lg">
            Ads, social media, brand, video and CRM, planned and run by one team. Every service shares the same data,
            so each one makes the others work harder.
          </p>
          <Link
            href="/services"
            className="mt-8 inline-flex w-fit items-center gap-3 rounded-full border border-honey/50 px-6 py-3 text-base font-medium text-honey transition-colors hover:bg-honey hover:text-ink"
          >
            View all services
          </Link>
        </div>

        {services.map((s) => (
          <article
            key={s.slug}
            data-panel
            className="relative flex shrink-0 flex-col justify-end overflow-hidden rounded-[28px] border border-wax/12 bg-comb/40 p-6 pt-[clamp(6.5rem,24vw,9rem)] backdrop-blur-[6px] sm:p-8 sm:pt-36 md:h-[68vh] md:max-h-[44rem] md:w-[min(46vw,38rem)] md:rounded-[32px] md:p-10 lg:p-12"
          >
            <span
              data-bgword
              aria-hidden
              data-allow-overflow
              className="display text-outline pointer-events-none absolute -top-[0.1em] left-0 select-none whitespace-nowrap text-[clamp(7rem,20vw,18rem)] opacity-90"
            >
              {s.word}
            </span>
            <div data-panel-body className="relative">
              <h3 className="display text-[clamp(2.25rem,4.4vw,4rem)] text-wax">{s.title}</h3>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-wax/75 lg:text-lg">{s.body}</p>
              <ul className="mt-6 flex flex-wrap gap-2" aria-label={`${s.title} includes`}>
                {s.tags.map((t) => (
                  <li key={t} className="rounded-full border border-honey/35 px-3.5 py-1.5 text-sm text-honey">
                    {t}
                  </li>
                ))}
              </ul>
              <Link
                href={servicePath(s.slug)}
                className="mt-7 inline-block text-base font-semibold text-wax underline decoration-honey/60 underline-offset-[6px] transition-colors hover:text-honey"
              >
                Explore {s.title}
              </Link>
            </div>
          </article>
        ))}
        <div aria-hidden className="hidden w-[6vw] shrink-0 md:block" />
      </div>

      <div aria-hidden className="absolute inset-x-5 bottom-8 hidden h-px bg-wax/15 sm:inset-x-8 md:block">
        <div ref={bar} className="h-full origin-left bg-honey" />
      </div>
    </section>
  );
}
