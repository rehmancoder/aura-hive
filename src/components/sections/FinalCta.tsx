"use client";

import { useRef } from "react";
import { MagneticLink } from "../motion/Magnetic";
import { contactHref, site } from "@/lib/site";
import { gsap, useGsap } from "@/lib/motion";

type Props = {
  /** Two short lines; the second is set in gold. */
  lines?: [string, string];
  body?: string;
  /** Which data-stage this section is in the page's 3D scene (its last stage). */
  stage?: number;
  /** Where the button goes, e.g. a contact link that pre-selects a service. */
  href?: string;
};

/** Closing call to action, used at the end of every page. The particle swarm re-forms the logo behind it. */
export function FinalCta({
  lines = ["Let's build", "your hive."],
  body = "Tell us about your brand and your goals. We'll review your ads, social pages and CRM, and send a short plan with a clear proposal.",
  stage = 5,
  href = contactHref(),
}: Props) {
  const root = useRef<HTMLElement>(null);

  useGsap(root, (el) => {
    gsap.from(el.querySelectorAll("[data-cta-line] > span"), {
      yPercent: 110,
      ease: "power4.out",
      duration: 1.2,
      stagger: 0.12,
      scrollTrigger: { trigger: el, start: "top 40%" },
    });
  });

  return (
    <section
      ref={root}
      data-stage={stage}
      aria-labelledby="cta-title"
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden pb-20 pt-[45svh] md:min-h-[110svh] md:justify-center md:pb-24 md:pt-40"
    >
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-ink via-ink/70 to-transparent md:hidden" />
      <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 hidden w-[60%] bg-gradient-to-r from-ink/90 via-ink/50 to-transparent md:block" />
      <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8">
        <h2 id="cta-title" className="display text-[clamp(3.4rem,12vw,11.5rem)] leading-[0.82] text-wax">
          <span data-cta-line className="block overflow-hidden pb-[0.06em]">
            <span className="inline-block">{lines[0]}</span>
          </span>
          <span data-cta-line className="block overflow-hidden pb-[0.06em]">
            <span className="inline-block text-honey">{lines[1]}</span>
          </span>
        </h2>
        <p className="mt-7 max-w-lg text-base leading-relaxed text-wax/75 sm:text-lg">
          {body}
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-6 md:gap-8">
          <MagneticLink
            href={href}
            strength={0.45}
            className="inline-flex h-32 w-32 items-center justify-center rounded-full bg-honey text-center text-base font-semibold text-ink transition-colors hover:bg-wax sm:h-36 sm:w-36 md:h-44 md:w-44 md:text-lg"
          >
            Start a project
          </MagneticLink>
          <p className="text-[15px] text-wax/65 sm:text-base">
            or email <span className="select-all text-wax">{site.email}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
