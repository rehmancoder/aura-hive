import type { Metadata } from "next";
import { BackgroundCanvas } from "@/components/three/BackgroundCanvas";
import { ServicesHero } from "@/components/services/ServicesHero";
import { ServiceGroup } from "@/components/services/ServiceGroup";
import { Combos } from "@/components/services/Combos";
import { Marquee } from "@/components/sections/Marquee";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";
import { servicePath, services, servicesPage, site, tools } from "@/lib/site";
import { siteUrl } from "@/lib/env";

export const metadata: Metadata = {
  title: servicesPage.title,
  description: servicesPage.description,
  alternates: { canonical: "/services" },
  openGraph: {
    url: "/services",
    title: `${servicesPage.title} | ${site.name}`,
    description: servicesPage.description,
  },
  twitter: {
    title: `${servicesPage.title} | ${site.name}`,
    description: servicesPage.description,
  },
};

// Structured data: the list of services (each linking to its own page), breadcrumb and FAQ answers.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": `${siteUrl}/services#webpage`,
      url: `${siteUrl}/services`,
      name: `${servicesPage.title} | ${site.name}`,
      description: servicesPage.description,
      isPartOf: { "@id": `${siteUrl}/#website` },
      about: { "@id": `${siteUrl}/#organization` },
      breadcrumb: { "@id": `${siteUrl}/services#breadcrumb` },
      mainEntity: { "@id": `${siteUrl}/services#list` },
    },
    {
      "@type": "ItemList",
      "@id": `${siteUrl}/services#list`,
      itemListElement: services.map((s, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Service",
          name: s.title,
          description: s.body,
          url: `${siteUrl}${servicePath(s.slug)}`,
          serviceType: s.title,
          provider: { "@id": `${siteUrl}/#organization` },
        },
      })),
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${siteUrl}/services#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
        { "@type": "ListItem", position: 2, name: "Services", item: `${siteUrl}/services` },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: servicesPage.faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default function ServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <BackgroundCanvas scene="services" />
      <main id="main" className="relative z-10">
        <ServicesHero />
        <Marquee items={tools} outline label="Platforms we work with" />
        <ServiceGroup index={0} stage={1} />
        <ServiceGroup index={1} stage={2} />
        <ServiceGroup index={2} stage={3} />
        <Combos />
        <Faq
          items={servicesPage.faqs}
          title="Questions about our services"
          intro="Still deciding? Send us your question and we'll point you to the right service."
        />
        <FinalCta lines={servicesPage.cta.lines} body={servicesPage.cta.body} stage={5} />
      </main>
    </>
  );
}
