import Link from "next/link";
import { FloatingCards } from "../shared/FloatingCards";
import { MagneticLink } from "../motion/Magnetic";
import { about, contactHref } from "@/lib/site";

// Cards float around the particle halo on the right.
const spots = [
  { className: "right-[33%] top-[20%]", depth: 30 },
  { className: "right-[5%] top-[24%]", depth: 44 },
  { className: "right-[36%] top-[62%]", depth: 36 },
  { className: "right-[6%] top-[66%]", depth: 22 },
];

export function AboutHero() {
  return (
    <section aria-labelledby="about-title" className="relative flex min-h-[max(100svh,620px)] items-end overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 hidden w-[62%] bg-gradient-to-r from-ink/90 via-ink/50 to-transparent md:block"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-ink via-ink/90 to-transparent md:h-1/2 md:via-ink/30"
      />

      <FloatingCards cards={about.chips} spots={spots} />

      <div className="relative mx-auto w-full max-w-7xl px-5 pb-16 pt-28 sm:px-8 md:pb-28">
        <nav aria-label="Breadcrumb" className="fade-rise mb-6 text-sm text-wax/60" style={{ animationDelay: "var(--intro)" }}>
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/" className="transition-colors hover:text-honey">
                Home
              </Link>
            </li>
            <li aria-hidden className="h-3 w-[2px] rounded-full bg-honey/60" />
            <li aria-current="page" className="text-wax">
              About us
            </li>
          </ol>
        </nav>

        <div className="max-w-[44rem]">
          <h1 id="about-title" className="display text-[clamp(3.25rem,10vw,8.5rem)] text-wax">
            {about.hero.headline.map((w, i) => (
              <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-top">
                <span
                  className={`word-rise inline-block ${w === "aura" ? "text-honey" : ""}`}
                  style={{ animationDelay: `calc(var(--intro) + ${80 + i * 70}ms)` }}
                >
                  {w}
                </span>
                {i < about.hero.headline.length - 1 ? " " : null}
              </span>
            ))}
          </h1>
          <p
            className="fade-rise mt-6 max-w-[34rem] text-base leading-relaxed text-wax/80 sm:text-lg md:mt-7 md:text-xl"
            style={{ animationDelay: "calc(var(--intro) + 650ms)" }}
          >
            {about.hero.body}
          </p>
          <div className="fade-rise mt-10 flex flex-wrap items-center gap-3" style={{ animationDelay: "calc(var(--intro) + 800ms)" }}>
            <MagneticLink
              href={contactHref()}
              className="inline-block rounded-full bg-honey px-7 py-4 text-base font-semibold text-ink transition-colors hover:bg-wax sm:px-8"
            >
              Start a project
            </MagneticLink>
            <a
              href="#story"
              className="rounded-full px-5 py-4 text-base font-medium text-wax/85 underline decoration-honey/50 underline-offset-[6px] transition-colors hover:text-honey"
            >
              Read our story
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
