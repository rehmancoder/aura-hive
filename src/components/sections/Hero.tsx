import { HeroSignals } from "./HeroSignals";
import { MagneticLink } from "../motion/Magnetic";
import { contactHref } from "@/lib/site";

const headline = ["A", "hive", "of", "AI", "working", "on", "your", "growth."];

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative flex min-h-[max(100svh,620px)] items-end overflow-hidden">
      {/* Legibility over the 3D scene */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 hidden w-[62%] bg-gradient-to-r from-ink/90 via-ink/50 to-transparent md:block"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-ink via-ink/90 to-transparent md:h-1/2 md:via-ink/30"
      />

      <HeroSignals />

      <div className="relative mx-auto w-full max-w-7xl px-5 pb-16 pt-28 sm:px-8 md:pb-28">
        <div className="max-w-[42rem]">
          <h1 id="hero-title" className="display text-[clamp(3.25rem,10.5vw,9rem)] text-wax">
            {headline.map((w, i) => (
              <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-top">
                <span className="word-rise inline-block" style={{ animationDelay: `calc(var(--intro) + ${i * 70}ms)` }}>
                  {w}
                </span>
                {i < headline.length - 1 ? " " : null}
              </span>
            ))}
          </h1>
          <p
            className="fade-rise mt-6 max-w-[34rem] text-base leading-relaxed text-wax/80 sm:text-lg md:mt-7 md:text-xl"
            style={{ animationDelay: "calc(var(--intro) + 600ms)" }}
          >
            Aura Hive is an online digital marketing agency. We run your Google and Meta ads, social media, AI videos
            and CRM as one system, so your brand grows and more of your budget turns into customers.
          </p>
          <div className="fade-rise mt-10 flex flex-wrap items-center gap-3" style={{ animationDelay: "calc(var(--intro) + 750ms)" }}>
            <MagneticLink
              href={contactHref()}
              className="inline-block rounded-full bg-honey px-7 py-4 text-base font-semibold text-ink transition-colors hover:bg-wax sm:px-8"
            >
              Start a project
            </MagneticLink>
            <a
              href="#hive"
              className="rounded-full px-5 py-4 text-base font-medium text-wax/85 underline decoration-honey/50 underline-offset-[6px] transition-colors hover:text-honey"
            >
              Meet the hive
            </a>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div
        aria-hidden
        className="fade-rise absolute bottom-8 right-5 hidden items-center gap-3 text-sm text-wax/50 sm:right-8 md:flex"
        style={{ animationDelay: "calc(var(--intro) + 1050ms)" }}
      >
        Scroll
        <span className="relative block h-12 w-px overflow-hidden bg-wax/15">
          <span className="scroll-cue absolute inset-x-0 top-0 h-1/2 bg-honey" />
        </span>
      </div>
    </section>
  );
}
