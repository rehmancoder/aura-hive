import Link from "next/link";
import { ContactForm } from "./ContactForm";
import { CopyEmail } from "./CopyEmail";
import { contactPage, site } from "@/lib/site";

/** Contact page opening: who to reach and how on the left, the enquiry form on the right. */
export function ContactHero() {
  return (
    <section aria-labelledby="contact-title" className="relative overflow-hidden pb-20 pt-28 md:pb-28 md:pt-36">
      <div className="relative mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <nav aria-label="Breadcrumb" className="fade-rise mb-6 text-sm text-wax/60" style={{ animationDelay: "var(--intro)" }}>
            <ol className="flex items-center gap-2">
              <li>
                <Link href="/" className="transition-colors hover:text-honey">
                  Home
                </Link>
              </li>
              <li aria-hidden className="h-3 w-[2px] rounded-full bg-honey/60" />
              <li aria-current="page" className="text-wax">
                Contact us
              </li>
            </ol>
          </nav>

          <h1 id="contact-title" className="display text-[clamp(3.25rem,9vw,7.5rem)] text-wax">
            {contactPage.hero.headline.map((w, i) => (
              <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-top">
                <span
                  className={`word-rise inline-block ${w === "grow" ? "text-honey" : ""}`}
                  style={{ animationDelay: `calc(var(--intro) + ${80 + i * 70}ms)` }}
                >
                  {w}
                </span>
                {i < contactPage.hero.headline.length - 1 ? " " : null}
              </span>
            ))}
          </h1>
          <p
            className="fade-rise mt-6 max-w-md text-base leading-relaxed text-wax/80 sm:text-lg"
            style={{ animationDelay: "calc(var(--intro) + 500ms)" }}
          >
            {contactPage.hero.body}
          </p>

          <div className="fade-rise mt-10 space-y-8 border-t border-wax/10 pt-8" style={{ animationDelay: "calc(var(--intro) + 650ms)" }}>
            <div>
              <h2 className="text-sm font-medium text-wax/60">Email us</h2>
              <div className="mt-2">
                <CopyEmail email={site.email} />
              </div>
            </div>

            {site.whatsapp ? (
              <div>
                <h2 className="text-sm font-medium text-wax/60">Chat on WhatsApp</h2>
                <a
                  href={`https://wa.me/${site.whatsapp}`}
                  target="_blank"
                  rel="noopener"
                  className="mt-3 inline-flex items-center gap-2 rounded-full bg-wax/[0.08] px-5 py-3 text-[15px] font-semibold text-wax transition-colors hover:bg-honey hover:text-ink"
                >
                  Message us on WhatsApp
                </a>
              </div>
            ) : null}

            <div>
              <h2 className="text-sm font-medium text-wax/60">Follow us</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                <li>
                  <a
                    href={site.socials.instagram}
                    target="_blank"
                    rel="noopener"
                    className="inline-block rounded-full border border-wax/15 px-4 py-2 text-[15px] text-wax/85 transition-colors hover:border-honey hover:text-honey"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href={site.socials.linkedin}
                    target="_blank"
                    rel="noopener"
                    className="inline-block rounded-full border border-wax/15 px-4 py-2 text-[15px] text-wax/85 transition-colors hover:border-honey hover:text-honey"
                  >
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>

            <p className="inline-flex items-center gap-2.5 rounded-full border border-honey/30 bg-ink/60 px-4 py-2 text-sm text-wax backdrop-blur-md">
              <span className="relative flex h-2.5 w-2.5" aria-hidden>
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-honey/60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-honey" />
              </span>
              100% online: we work with you wherever you are
            </p>
          </div>
        </div>

        <div id="contact-form" className="fade-rise scroll-mt-24" style={{ animationDelay: "calc(var(--intro) + 300ms)" }}>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
