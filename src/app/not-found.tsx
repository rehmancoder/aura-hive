import type { Metadata } from "next";
import Link from "next/link";
import { LogoMark } from "@/components/Logo";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

/** Shown for any address that doesn't exist yet, including pages still being built. */
export default function NotFound() {
  return (
    <>
      <main id="main" className="relative flex min-h-[100svh] items-center overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute -right-32 top-1/4 h-[32rem] w-[32rem] rounded-full bg-honey/10 blur-3xl" />
        <div className="relative mx-auto w-full max-w-7xl px-5 py-32 sm:px-8">
          <LogoMark className="h-16 w-auto text-honey" />
          <h1 className="display mt-10 max-w-3xl text-[clamp(3rem,9vw,7.5rem)] text-wax">This page is on its way.</h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-wax/75 sm:text-lg">
            We couldn&apos;t find this page. It may not be published yet, or the link may be wrong. You can head back to
            the home page or email us at <span className="select-all text-wax">{site.email}</span>.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link href="/" className="rounded-full bg-honey px-7 py-4 text-base font-semibold text-ink transition-colors hover:bg-wax">
              Back to home
            </Link>
            <Link
              href="/services"
              className="rounded-full border border-wax/25 px-7 py-4 text-base font-medium text-wax transition-colors hover:border-honey hover:text-honey"
            >
              See our services
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
