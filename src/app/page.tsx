import { BackgroundCanvas } from "@/components/three/BackgroundCanvas";
import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { HiveSection } from "@/components/sections/HiveSection";
import { ServicesScroller } from "@/components/sections/ServicesScroller";
import { Industries } from "@/components/sections/Industries";
import { Showcase } from "@/components/sections/Showcase";
import { Process } from "@/components/sections/Process";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";
import { faqs, industries, marqueeServices, services, site, tools } from "@/lib/site";
import { siteUrl } from "@/lib/env";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { url: "/" },
};

// Structured data: helps Google show the business, services and FAQ answers in results.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      // Fully online business: no shop or office, so no street address or opening hours.
      "@type": "OnlineBusiness",
      "@id": `${siteUrl}/#organization`,
      name: site.name,
      description: site.description,
      url: siteUrl,
      logo: `${siteUrl}/icon.svg`,
      image: `${siteUrl}/opengraph-image.png`,
      email: site.email,
      areaServed: site.areaServed,
      sameAs: Object.values(site.socials),
      knowsAbout: services.map((s) => s.title),
      audience: industries.map((i) => ({ "@type": "BusinessAudience", audienceType: i.name })),
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Digital marketing services",
        itemListElement: services.map((s) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: s.title, description: s.body },
        })),
      },
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: site.name,
      publisher: { "@id": `${siteUrl}/#organization` },
      inLanguage: "en",
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <BackgroundCanvas scene="home" />
      <main id="main" className="relative z-10">
        <Hero />
        <Marquee items={marqueeServices} label="Our services" />
        <HiveSection />
        <ServicesScroller />
        <Industries />
        <Showcase />
        <Process />
        <Marquee items={tools} reverse outline label="Platforms we work with" />
        <Faq stage={4} />
        <FinalCta />
      </main>
    </>
  );
}
