import Link from "next/link";

/** Closing band for the contact page: other places to go. The particle logo forms behind it. */
export function LookAround() {
  return (
    <section data-stage="3" aria-labelledby="look-title" className="relative flex min-h-[80svh] items-center overflow-hidden py-24">
      <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 hidden w-[60%] bg-gradient-to-r from-ink/90 via-ink/50 to-transparent md:block" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-ink via-ink/70 to-transparent md:hidden" />
      <div className="relative mx-auto w-full max-w-7xl px-5 pt-[30svh] sm:px-8 md:pt-0">
        <h2 id="look-title" className="display max-w-2xl text-[clamp(3rem,8vw,7rem)] text-wax">
          Want to look around <span className="text-honey">first?</span>
        </h2>
        <p className="mt-6 max-w-md text-base leading-relaxed text-wax/75 sm:text-lg">
          See everything we do, or read how Aura Hive works as a fully online team.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Link href="/services" className="rounded-full bg-honey px-7 py-4 text-base font-semibold text-ink transition-colors hover:bg-wax">
            Explore our services
          </Link>
          <Link
            href="/about"
            className="rounded-full border border-wax/25 px-7 py-4 text-base font-medium text-wax transition-colors hover:border-honey hover:text-honey"
          >
            About us
          </Link>
        </div>
      </div>
    </section>
  );
}
