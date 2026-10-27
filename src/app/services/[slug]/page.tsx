import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BackgroundCanvas } from "@/components/three/BackgroundCanvas";
import { ServiceHero } from "@/components/service/ServiceHero";
import { Included } from "@/components/service/Included";
import { Steps } from "@/components/service/Steps";
import { Related } from "@/components/service/Related";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";
import { contactHref, servicePath, serviceDetails, services, site } from "@/lib/site";
import { siteUrl } from "@/lib/env";

type Props = { params: Promise<{ slug: string }> };

const find = (slug: string) => {
  const service = services.find((s) => s.slug === slug);
  return service ? { service, detail: serviceDetails[service.slug] } : null;
};

/** All nine service pages are built ahead of time as static HTML. */
export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const found = find(slug);
  if (!found) return {};
  const { detail } = found;
  const title = detail.seoTitle;
  const description = `${detail.intro} Aura Hive is an online digital marketing agency.`;
  return {
    title,
    description,
    alternates: { canonical: servicePath(slug) },
    openGraph: { url: servicePath(slug), title: `${title} | ${site.name}`, description },
    twitter: { title: `${title} | ${site.name}`, description },
  };
}

// With Partial Prefetching, params must be read inside <Suspense> so Next.js can build the
// route's shared App Shell. The nine known slugs are still fully prerendered as static HTML.
export default function ServicePage({ params }: Props) {
  return (
    <Suspense fallback={<main id="main" className="relative z-10 min-h-svh" />}>
      <ServiceContent params={params} />
    </Suspense>
  );
}

async function ServiceContent({ params }: Props) {
  const { slug } = await params;
  const found = find(slug);
  if (!found) notFound();
  const { service, detail } = found;
  const url = `${siteUrl}${servicePath(slug)}`;

  // Structured data: the service itself, its place in the site (breadcrumb) and its FAQ answers.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: service.title,
        serviceType: service.title,
        description: detail.intro,
        url,
        provider: { "@id": `${siteUrl}/#organization` },
        areaServed: site.areaServed,
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: `${service.title}: what's included`,
          itemListElement: service.includes.map((item) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: item },
          })),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
          { "@type": "ListItem", position: 2, name: "Services", item: `${siteUrl}/services` },
          { "@type": "ListItem", position: 3, name: service.title, item: url },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: detail.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <BackgroundCanvas shape={detail.shape} />
      <main id="main" className="relative z-10">
        <ServiceHero service={service} detail={detail} />
        <Included service={service} />
        <Steps steps={detail.steps} />
        <Faq
          items={detail.faqs}
          title={`${service.title} questions`}
          intro="Something else you'd like to know? Send us your question and we'll get back to you."
        />
        <Related service={service} />
        <FinalCta
          lines={["Let's talk", `${service.title}.`]}
          body={`Tell us about your business and your goals. We'll send a short ${service.title} plan with a clear proposal.`}
          stage={4}
          href={contactHref({ service: service.slug })}
        />
      </main>
    </>
  );
}
