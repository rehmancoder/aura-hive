"use client";

import { useRef } from "react";
import { about } from "@/lib/site";
import { gsap, useGsap } from "@/lib/motion";

/** How a fully online agency works. The particle globe sits on the left on desktop. */
export function OnlineModel() {
  const root = useRef<HTMLElement>(null);

  useGsap(root, (el) => {
    gsap.from(el.querySelectorAll("[data-point]"), {
      x: 60,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      stagger: 0.12,
      scrollTrigger: { trigger: el.querySelector("[data-points]"), start: "top 80%" },
    });
  });

  return (
    <section ref={root} data-stage="3" aria-labelledby="online-title" className="relative py-24 md:py-36">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16">
        {/* Left column on desktop stays mostly open for the 3D globe */}
        <div className="lg:min-h-[32rem]">
          <p className="inline-flex items-center gap-2.5 rounded-full border border-honey/30 bg-ink/60 px-4 py-2 text-sm text-wax backdrop-blur-md">
            <span className="relative flex h-2.5 w-2.5" aria-hidden>
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-honey/60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-honey" />
            </span>
            Online, wherever you are
          </p>
          <h2 id="online-title" className="display mt-6 text-[clamp(2.75rem,7vw,6.5rem)] text-wax">
            {about.online.title}
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-wax/70 sm:text-lg">{about.online.intro}</p>
        </div>

        <ul data-points className="grid gap-px self-center overflow-hidden rounded-[24px] border border-wax/10 bg-wax/10 md:rounded-[28px]">
          {about.online.points.map((p) => (
            <li key={p.title} data-point className="flex gap-5 bg-ink/80 p-6 backdrop-blur-md sm:p-8">
              <span aria-hidden className="flex h-7 shrink-0 items-end gap-[3px] pt-1">
                {[0.55, 1, 0.55].map((h, b) => (
                  <span key={b} className="w-[4px] rounded-full bg-honey" style={{ height: `${h * 100}%` }} />
                ))}
              </span>
              <div>
                <h3 className="text-xl font-semibold tracking-tight text-wax sm:text-2xl">{p.title}</h3>
                <p className="mt-2 text-base leading-relaxed text-wax/70">{p.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
