import Contact from "@/components/Contact";
import FaqSection from "@/components/FaqSection";
import FloatingButtons from "@/components/FloatingButtons";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Process from "@/components/Process";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";
import WhyUs from "@/components/WhyUs";
import { getHomePageData } from "@/lib/data/public";

// İçerik admin panelden anlık düzenlenebildiği için sayfa her istekte
// taze veriyle render edilir (CMS-driven bir site için statik/ISR yerine
// bilinçli tercih).
export const dynamic = "force-dynamic";

/*
 * JSON-LD şemaları. Telefon numarası, "hiçbir yerde metin olarak
 * görünmesin" kuralı gereği bilinçli olarak şemalara da eklenmemiştir.
 */
function buildBusinessJsonLd({
  siteName,
  siteSlogan,
  siteDescription,
  siteUrl,
  serviceNames,
}: {
  siteName: string;
  siteSlogan: string;
  siteDescription: string;
  siteUrl: string;
  serviceNames: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "MovingCompany",
    name: siteName,
    slogan: siteSlogan,
    description: siteDescription,
    url: siteUrl,
    image: `${siteUrl}/opengraph-image`,
    areaServed: { "@type": "Country", name: "Türkiye" },
    priceRange: "₺₺",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "00:00",
        closes: "23:59",
      },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Nakliye Hizmetleri",
      itemListElement: serviceNames.map((service) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service,
          areaServed: { "@type": "Country", name: "Türkiye" },
        },
      })),
    },
  };
}

function buildFaqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

function jsonLd(data: object): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export default async function Page() {
  const data = await getHomePageData();
  const { settings } = data;
  const serviceNames = data.services.map((s) => s.title);
  const cityNames = data.cities.map((c) => c.name);

  const businessJsonLd = buildBusinessJsonLd({
    siteName: settings.siteName,
    siteSlogan: settings.siteSlogan,
    siteDescription: settings.siteDescription,
    siteUrl: settings.siteUrl,
    serviceNames,
  });
  const faqJsonLd = buildFaqJsonLd(data.faqs);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(businessJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(faqJsonLd) }}
      />
      <Header navItems={data.navItems} />
      <main id="icerik">
        {data.hero && (
          <Hero hero={data.hero} stats={data.stats} cities={cityNames} phoneE164={settings.phoneE164} />
        )}
        <Services services={data.services} />
        <WhyUs cards={data.whyUsCards} />
        <Process steps={data.processSteps} />
        <Testimonials
          testimonials={data.testimonials}
          serviceOptions={data.services.map((s) => ({ id: s.id, title: s.title }))}
        />
        <FaqSection faqs={data.faqs} phoneE164={settings.phoneE164} />
        <Contact
          phoneE164={settings.phoneE164}
          workingHours={settings.workingHours ?? "Haftanın 7 günü hizmet, 7/24 destek hattı"}
          serviceOptions={serviceNames}
        />
      </main>
      <Footer
        navItems={data.navItems}
        serviceNames={serviceNames}
        cities={cityNames}
        phoneE164={settings.phoneE164}
        siteName={settings.siteName}
        siteSlogan={settings.siteSlogan}
        siteDescription={settings.siteDescription}
      />
      <FloatingButtons phoneE164={settings.phoneE164} />
    </>
  );
}
