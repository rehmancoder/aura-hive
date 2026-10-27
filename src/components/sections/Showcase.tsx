"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGsap } from "@/lib/motion";

/** A framed image that opens to full width as it scrolls into view, with its headline sliding across. */
export function Showcase() {
  const root = useRef<HTMLElement>(null);

  useGsap(root, (el) => {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: el, start: "top 85%", end: "center 45%", scrub: 1 },
    });
    tl.fromTo(
      el.querySelector("[data-frame]"),
      { clipPath: "inset(14% 12% 14% 12% round 40px)" },
      { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "none" },
      0,
    ).fromTo(el.querySelector("[data-photo]"), { scale: 1.35 }, { scale: 1, ease: "none" }, 0);

    // The two lines slide in from opposite sides and settle flush with the edges.
    const amp = window.innerWidth < 768 ? 10 : 18;
    gsap.fromTo(
      el.querySelectorAll("[data-line]"),
      { xPercent: (i) => (i % 2 ? amp : -amp) },
      {
        xPercent: 0,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "top 25%", scrub: true },
      },
    );
  });

  return (
    <section ref={root} aria-labelledby="showcase-title" className="relative">
      <div data-frame className="relative h-[90svh] overflow-hidden md:h-[110vh]">
        <div data-photo className="absolute inset-0">
          <Image
            src="/images/hive.webp"
            alt="A field of gold and black hexagons rising like a honeycomb"
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/10 to-ink/80" />
        <div className="absolute inset-0 flex flex-col justify-center overflow-hidden px-5 sm:px-8">
          <h2 id="showcase-title" data-allow-overflow className="display text-[clamp(2.6rem,12vw,12rem)] leading-[0.85] text-wax">
            <span data-line data-allow-overflow className="block whitespace-nowrap">Many agents.</span>
            <span data-line data-allow-overflow className="block whitespace-nowrap text-right text-honey">One hive.</span>
          </h2>
          <p className="mx-auto mt-8 max-w-xl rounded-3xl bg-ink/65 px-5 py-4 text-center text-base leading-relaxed text-wax/90 backdrop-blur-md sm:mt-10 sm:px-6 sm:py-5 sm:text-lg md:text-xl">
            Your ads, social pages, videos and CRM share one view of your customers. That shared memory is what makes
            each campaign smarter than the last.
          </p>
        </div>
      </div>
    </section>
  );
}
