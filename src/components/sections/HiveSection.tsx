"use client";

import { useRef } from "react";
import { agents } from "@/lib/site";
import { gsap, useGsap } from "@/lib/motion";
import { TiltCard } from "../motion/TiltCard";

const statement =
  "Behind every Aura Hive client is a hive of six AI agents. They test ads, create content and follow up leads around the clock, while our strategists decide what goes live.";

export function HiveSection() {
  const root = useRef<HTMLElement>(null);

  useGsap(root, (el) => {
    // Words light up as the statement scrolls through the screen.
    gsap.fromTo(
      el.querySelectorAll("[data-word]"),
      { opacity: 0.14 },
      {
        opacity: 1,
        ease: "none",
        stagger: 0.08,
        scrollTrigger: { trigger: el.querySelector("[data-statement]"), start: "top 80%", end: "bottom 40%", scrub: true },
      },
    );
    gsap.from(el.querySelectorAll("[data-agent]"), {
      y: 80,
      rotateX: -25,
      opacity: 0,
      duration: 1.1,
      ease: "power3.out",
      stagger: { each: 0.08, grid: "auto", from: "start" },
      scrollTrigger: { trigger: el.querySelector("[data-agents]"), start: "top 85%" },
    });
  });

  return (
    <section
      id="hive"
      ref={root}
      data-stage="1"
      aria-labelledby="hive-title"
      className="relative scroll-mt-0 py-24 md:py-36"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-3xl">
          <h2 id="hive-title" className="display text-[clamp(2.75rem,7vw,6.5rem)] text-honey">
            Meet the hive
          </h2>
          <p data-statement className="mt-7 text-[clamp(1.4rem,3.2vw,2.6rem)] font-medium leading-[1.25] tracking-tight text-wax">
            {statement.split(" ").map((w, i) => (
              <span key={i} data-word className="inline">
                {w}{" "}
              </span>
            ))}
          </p>
        </div>

        <ul data-agents className="mt-14 grid gap-4 [perspective:1200px] sm:grid-cols-2 lg:mt-24 lg:grid-cols-3 lg:gap-5">
          {agents.map((a) => (
            <li key={a.name} data-agent>
              <TiltCard className="h-full rounded-[24px] border border-wax/10 bg-comb/55 p-6 backdrop-blur-md sm:p-7 md:rounded-[28px] md:p-8">
                <div aria-hidden className="flex h-14 items-end gap-1.5">
                  {a.bars.map((h, i) => (
                    <span
                      key={i}
                      className="eq-bar w-2 rounded-full bg-honey"
                      style={{ height: `${h * 100}%`, animationDelay: `${i * 0.13 + a.bars[0]}s` }}
                    />
                  ))}
                </div>
                <h3 className="mt-7 text-xl font-semibold tracking-tight text-wax sm:text-2xl">{a.name}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-wax/70 sm:text-base">{a.body}</p>
              </TiltCard>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
