import Link from "next/link";
import { LogoMark } from "./Logo";
import { contactHref, footerLinks, servicePath, services, site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="relative z-10 overflow-hidden border-t border-wax/10 bg-ink pt-16 text-wax/70 md:pt-20">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-[1.5fr_1.3fr_1fr_1fr] lg:gap-10">
        <div>
          <Link href="/" className="flex w-fit items-center gap-3" aria-label={`${site.name} home`}>
            <LogoMark className="h-8 w-auto text-honey" />
            <span className="text-xl font-semibold text-wax">{site.name}</span>
          </Link>
          <p className="mt-4 max-w-xs text-[15px] leading-relaxed">
            Online digital marketing agency. Ads, social media, brand, AI video and CRM automation for growing brands.
          </p>
          <Link
            href={contactHref()}
            className="mt-6 inline-block rounded-full border border-honey/50 px-5 py-2.5 text-[15px] font-medium text-honey transition-colors hover:bg-honey hover:text-ink"
          >
            Start a project
          </Link>
        </div>

        <nav aria-labelledby="footer-services">
          <h2 id="footer-services" className="text-[15px] font-semibold text-wax">
            Services
          </h2>
          <ul className="mt-4 space-y-2.5 text-[15px]">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={servicePath(s.slug)} className="transition-colors hover:text-honey">
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-labelledby="footer-company">
          <h2 id="footer-company" className="text-[15px] font-semibold text-wax">
            Company
          </h2>
          <ul className="mt-4 space-y-2.5 text-[15px]">
            {footerLinks.company.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition-colors hover:text-honey">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-[15px] font-semibold text-wax">Connect</h2>
          <ul className="mt-4 space-y-2.5 text-[15px]">
            <li className="select-all break-all">{site.email}</li>
            <li>
              <a href={site.socials.instagram} rel="noopener" target="_blank" className="transition-colors hover:text-honey">
                Instagram
              </a>
            </li>
            <li>
              <a href={site.socials.linkedin} rel="noopener" target="_blank" className="transition-colors hover:text-honey">
                LinkedIn
              </a>
            </li>
          </ul>
          <p className="mt-6 max-w-[16rem] text-sm leading-relaxed text-wax/55">
            We&apos;re 100% online, with no shop or office. We work with you over video calls, WhatsApp and email.
          </p>
        </div>
      </div>

      {/* Oversized wordmark that bleeds off the bottom edge */}
      <p
        aria-hidden
        data-allow-overflow
        className="display mt-16 select-none whitespace-nowrap text-center text-[23vw] leading-[0.72] text-comb"
      >
        Aura Hive
      </p>
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-6 text-[13px] text-wax/45 sm:flex-row sm:justify-between sm:px-8">
        <span>© 2026 {site.legalName}. All rights reserved.</span>
        <span>Digital marketing, delivered online</span>
      </div>
    </footer>
  );
}
