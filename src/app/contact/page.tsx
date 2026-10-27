import type { Metadata } from "next";
import { BackgroundCanvas } from "@/components/three/BackgroundCanvas";
import { ContactHero } from "@/components/contact/ContactHero";
import { LookAround } from "@/components/contact/LookAround";
import { Steps } from "@/components/service/Steps";
import { Faq } from "@/components/sections/Faq";
import { contactPage, site } from "@/lib/site";
import { siteUrl } from "@/lib/env";

export const metadata: Metadata = {
  title: contactPage.title,
  description: contactPage.description,
  alternates: { canonical: "/contact" },
  openGraph: {
    url: "/contact",
    title: `${contactPage.title} | ${site.name}`,
    description: contactPage.description,
  },
  twitter: {
    title: `${contactPage.title} | ${site.name}`,
    description: contactPage.description,
  },
};

// Structured data: a contact page for the organisation, with how to reach it and FAQ answers.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ContactPage",
      "@id": `${siteUrl}/contact#webpage`,
      url: `${siteUrl}/contact`,
      name: `${contactPage.title} | ${site.name}`,
      description: contactPage.description,
      isPartOf: { "@id": `${siteUrl}/#website` },
      about: {
        "@id": `${siteUrl}/#organization`,
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "sales",
          email: site.email,
          availableLanguage: ["English"],
          areaServed: site.areaServed,
        },
      },
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
          { "@type": "ListItem", position: 2, name: "Contact us", item: `${siteUrl}/contact` },
        ],
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: contactPage.faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <BackgroundCanvas scene="contact" />
      <main id="main" className="relative z-10">
        <ContactHero />
        <Steps steps={contactPage.steps} title="What happens next" stage={1} />
        <Faq
          items={contactPage.faqs}
          title="Before you get in touch"
          intro="Quick answers to what people usually ask before sending an enquiry."
          stage={2}
          contactLink={false}
        />
        <LookAround />
      </main>
    </>
  );
}
