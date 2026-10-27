"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { contactHref, faqs as homeFaqs } from "@/lib/site";

type Props = {
  items?: readonly { q: string; a: string }[];
  title?: string;
  intro?: string;
  /** This section's step in the page's 3D scene, if it has one. */
  stage?: number;
  /** Show a link to the contact page under the intro (off on the contact page itself). */
  contactLink?: boolean;
};

/**
 * Accordion where only one answer is open at a time.
 * Every answer stays in the HTML (collapsed with CSS), so Google can read all of them.
 */
export function Faq({
  items: faqs = homeFaqs,
  title = "Questions we often hear",
  intro = "Something else on your mind? Send us your question and we'll get back to you.",
  stage,
  contactLink = true,
}: Props) {
  const [open, setOpen] = useState<number | null>(0);
  const base = useId();

  return (
    <section id="faq" data-stage={stage} aria-labelledby="faq-title" className="relative scroll-mt-20 py-24 md:py-36">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-24">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <h2 id="faq-title" className="display text-[clamp(2.75rem,6.5vw,6rem)] text-wax">
            {title}
          </h2>
          <p className="mt-6 max-w-sm text-base leading-relaxed text-wax/70 sm:text-lg">
            {intro}
          </p>
          {contactLink ? (
            <Link
              href={contactHref()}
              className="mt-5 inline-block text-base font-semibold text-wax underline decoration-honey/60 underline-offset-[6px] transition-colors hover:text-honey"
            >
              Ask us a question
            </Link>
          ) : null}
        </div>

        <div className="rounded-[24px] border border-wax/10 bg-ink/70 px-5 backdrop-blur-md sm:px-8 md:rounded-[28px] md:px-10">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            const btn = `${base}-q${i}`;
            const panel = `${base}-a${i}`;
            return (
              <div key={f.q} className="border-b border-wax/10 last:border-b-0">
                <h3>
                  <button
                    id={btn}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panel}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className={`flex w-full items-center justify-between gap-5 py-6 text-left text-lg font-medium leading-snug transition-colors hover:text-honey sm:text-xl md:py-7 md:text-[1.35rem] ${
                      isOpen ? "text-honey" : "text-wax"
                    }`}
                  >
                    {f.q}
                    {/* Plus sign built from two bars; the vertical bar folds away when open */}
                    <span aria-hidden className="relative h-5 w-5 shrink-0">
                      <span className="absolute left-0 top-1/2 h-[3px] w-5 -translate-y-1/2 rounded-full bg-honey" />
                      <span
                        className={`absolute left-1/2 top-0 h-5 w-[3px] -translate-x-1/2 rounded-full bg-honey transition-transform duration-500 ease-[var(--ease-honey)] ${
                          isOpen ? "scale-y-0" : "scale-y-100"
                        }`}
                      />
                    </span>
                  </button>
                </h3>
                <div
                  id={panel}
                  role="region"
                  aria-labelledby={btn}
                  className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[var(--ease-honey)] ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden" inert={!isOpen}>
                    <p className="max-w-2xl pb-7 pr-6 text-base leading-relaxed text-wax/75 sm:text-lg">{f.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
