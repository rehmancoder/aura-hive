import Link from "next/link";
import { MagneticLink } from "../motion/Magnetic";
import { contactHref, groupOf, type Service, type ServiceDetail } from "@/lib/site";

/** Hero for a single service page. The service name leads the H1 for search; the headline sells it. */
export function ServiceHero({ service, detail }: { service: Service; detail: ServiceDetail }) {
  const group = groupOf(service.slug);
  const words = detail.headline.split(" ");

  return (
    <section aria-labelledby="service-title" className="relative flex min-h-[max(100svh,640px)] items-end overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 hidden w-[64%] bg-gradient-to-r from-ink/90 via-ink/55 to-transparent md:block"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[72%] bg-gradient-to-t from-ink via-ink/90 to-transparent md:h-1/2 md:via-ink/30"
      />

      <div className="relative mx-auto w-full max-w-7xl px-5 pb-16 pt-28 sm:px-8 md:pb-24">
        <nav aria-label="Breadcrumb" className="fade-rise mb-6 text-sm text-wax/60" style={{ animationDelay: "var(--intro)" }}>
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="transition-colors hover:text-honey">
                Home
              </Link>
            </li>
            <li aria-hidden className="h-3 w-[2px] rounded-full bg-honey/60" />
            <li>
              <Link href="/services" className="transition-colors hover:text-honey">
                Services
              </Link>
            </li>
            <li aria-hidden className="h-3 w-[2px] rounded-full bg-honey/60" />
            <li aria-current="page" className="text-wax">
              {service.title}
            </li>
          </ol>
        </nav>

        <div className="max-w-[46rem]">
          <h1 id="service-title">
            <span
              className="fade-rise flex items-center gap-3 text-lg font-semibold text-honey sm:text-xl"
              style={{ animationDelay: "calc(var(--intro) + 60ms)" }}
            >
              <span aria-hidden className="flex h-5 items-end gap-[3px]">
                {[0.55, 1, 0.55].map((h, i) => (
                  <span key={i} className="w-[4px] rounded-full bg-honey" style={{ height: `${h * 100}%` }} />
                ))}
              </span>
              {service.title}
            </span>
            <span className="display mt-4 block text-[clamp(3rem,8.6vw,7.5rem)] text-wax">
              {words.map((w, i) => (
                <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-top">
                  <span className="word-rise inline-block" style={{ animationDelay: `calc(var(--intro) + ${120 + i * 60}ms)` }}>
                    {w}
                  </span>
                  {i < words.length - 1 ? " " : null}
                </span>
              ))}
            </span>
          </h1>
          <p
            className="fade-rise mt-6 max-w-[36rem] text-base leading-relaxed text-wax/80 sm:text-lg md:mt-7 md:text-xl"
            style={{ animationDelay: "calc(var(--intro) + 650ms)" }}
          >
            {detail.intro}
          </p>
          <div className="fade-rise mt-9 flex flex-wrap items-center gap-3" style={{ animationDelay: "calc(var(--intro) + 800ms)" }}>
            <MagneticLink
              href={contactHref({ service: service.slug })}
              className="inline-block rounded-full bg-honey px-7 py-4 text-base font-semibold text-ink transition-colors hover:bg-wax sm:px-8"
            >
              Start a project
            </MagneticLink>
            <span className="rounded-full border border-wax/15 bg-ink/50 px-4 py-2.5 text-sm text-wax/75 backdrop-blur-md">
              Part of {group.title}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
