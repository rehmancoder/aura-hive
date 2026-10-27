"use client";

import Image from "next/image";
import { useRef } from "react";
import { industries } from "@/lib/site";
import { gsap, useGsap } from "@/lib/motion";

const STACK_QUERY = "(min-width: 1024px) and (min-height: 700px)";

/** Industry cards stack on top of each other as you scroll; each one recedes as the next slides over it. */
export function Industries() {
  const root = useRef<HTMLElement>(null);

  useGsap(root, (el) => {
    const cards = gsap.utils.toArray<HTMLElement>("[data-card]", el);
    const mm = gsap.matchMedia();

    // Image parallax everywhere.
    cards.forEach((card) => {
      gsap.fromTo(
        card.querySelector("[data-img]"),
        { yPercent: -8, scale: 1.15 },
        {
          yPercent: 8,
          scale: 1.15,
          ease: "none",
          scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    });

    // Stacking only where the cards are pinned (large, tall screens; see STACK below).
    mm.add(STACK_QUERY, () => {
      cards.forEach((card, i) => {
        const next = cards[i + 1];
        if (!next) return;
        gsap.to(card.querySelector("[data-inner]"), {
          scale: 0.9,
          rotateX: 8,
          filter: "brightness(0.35)",
          ease: "none",
          scrollTrigger: { trigger: next, start: "top bottom", end: "top 18%", scrub: true },
        });
      });
    });

    // Smaller screens: cards simply rise into view.
    mm.add(`not all and ${STACK_QUERY}`, () => {
      cards.forEach((card) => {
        gsap.from(card, {
          y: 60,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 88%" },
        });
      });
    });

    return () => mm.revert();
  });

  return (
    <section id="industries" ref={root} aria-labelledby="industries-title" className="relative scroll-mt-16 py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h2 id="industries-title" className="display max-w-3xl text-[clamp(2.75rem,7vw,6.5rem)] text-wax">
            Built for fast-growing industries
          </h2>
          <p className="max-w-sm text-base leading-relaxed text-wax/70 sm:text-lg">
            Each industry gets its own playbook, audiences and creative style, refined across every account we run.
          </p>
        </div>

        <ul className="mt-12 space-y-6 [perspective:1600px] md:mt-20 [@media(min-width:1024px)_and_(min-height:700px)]:space-y-0">
          {industries.map((ind, i) => (
            <li
              key={ind.name}
              data-card
              className="[@media(min-width:1024px)_and_(min-height:700px)]:sticky [@media(min-width:1024px)_and_(min-height:700px)]:mb-10 [@media(min-width:1024px)_and_(min-height:700px)]:last:mb-0"
              style={{ top: `calc(12vh + ${i * 18}px)` }}
            >
              <article
                data-inner
                className="grid origin-top overflow-hidden rounded-[24px] border border-wax/10 bg-comb md:grid-cols-[1.05fr_1fr] md:rounded-[32px] lg:min-h-[min(70vh,44rem)]"
              >
                <div className="relative aspect-[4/3] overflow-hidden md:aspect-auto">
                  <div data-img className="absolute inset-0">
                    <Image
                      src={ind.image}
                      alt={ind.alt}
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="flex flex-col justify-between gap-8 p-6 sm:p-8 lg:p-12">
                  <div>
                    <p className="text-sm font-medium text-honey">
                      {String(i + 1).padStart(2, "0")} of {String(industries.length).padStart(2, "0")}
                    </p>
                    <h3 className="display mt-3 text-[clamp(2.5rem,5.5vw,5.25rem)] text-wax">{ind.name}</h3>
                    <p className="mt-4 max-w-md text-base leading-relaxed text-wax/75 sm:text-lg">{ind.body}</p>
                  </div>
                  <ul className="space-y-3 border-t border-wax/10 pt-6">
                    {ind.points.map((p) => (
                      <li key={p} className="flex items-center gap-3 text-[15px] text-wax/85 sm:text-base">
                        <span aria-hidden className="h-4 w-1.5 rounded-full bg-honey" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
