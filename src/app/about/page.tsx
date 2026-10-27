import type { Metadata } from "next";
import { BackgroundCanvas } from "@/components/three/BackgroundCanvas";
import { AboutHero } from "@/components/about/AboutHero";
import { NameStory } from "@/components/about/NameStory";
import { Mission } from "@/components/about/Mission";
import { Values } from "@/components/about/Values";
import { OnlineModel } from "@/components/about/OnlineModel";
import { ServicesOverview } from "@/components/about/ServicesOverview";
import { Marquee } from "@/components/sections/Marquee";
import { FinalCta } from "@/components/sections/FinalCta";
import { about, site } from "@/lib/site";
import { siteUrl } from "@/lib/env";

export const metadata: Metadata = {
  title: about.title,
  description: about.description,
  alternates: { canonical: "/about" },
  openGraph: {
    url: "/about",
    title: `${about.title} | ${site.name}`,
    description: about.description,
  },
  twitter: {
    title: `${about.title} | ${site.name}`,
    description: about.description,
  },
};

// Structured data: tells Google this is the About page of the Aura Hive organisation, with a breadcrumb trail.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AboutPage",
      "@id": `${siteUrl}/about#webpage`,
      url: `${siteUrl}/about`,
      name: `${about.title} | ${site.name}`,
      description: about.description,
      isPartOf: { "@id": `${siteUrl}/#website` },
      about: { "@id": `${siteUrl}/#organization` },
      breadcrumb: { "@id": `${siteUrl}/about#breadcrumb` },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${siteUrl}/about#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
        { "@type": "ListItem", position: 2, name: "About us", item: `${siteUrl}/about` },
      ],
    },
  ],
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <BackgroundCanvas scene="about" />
      <main id="main" className="relative z-10">
        <AboutHero />
        <Marquee items={about.marquee} label="What we bring" />
        <NameStory />
        <Mission />
        <Values />
        <OnlineModel />
        <ServicesOverview />
        <FinalCta lines={about.cta.lines} body={about.cta.body} stage={4} />
      </main>
    </>
  );
}
