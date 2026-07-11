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
import { FAQS, SERVICE_NAMES } from "@/lib/content";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_SLOGAN,
  SITE_URL,
} from "@/lib/site";

/*
 * JSON-LD şemaları. Telefon numarası, "hiçbir yerde metin olarak
 * görünmesin" kuralı gereği bilinçli olarak şemalara da eklenmemiştir.
 */
const businessJsonLd = {
  "@context": "https://schema.org",
  "@type": "MovingCompany",
  name: SITE_NAME,
  slogan: SITE_SLOGAN,
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  image: `${SITE_URL}/opengraph-image`,
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
    itemListElement: SERVICE_NAMES.map((service) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: service,
        areaServed: { "@type": "Country", name: "Türkiye" },
      },
    })),
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

function jsonLd(data: object): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export default function Page() {
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
      <Header />
      <main id="icerik">
        <Hero />
        <Services />
        <WhyUs />
        <Process />
        <Testimonials />
        <FaqSection />
        <Contact />
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}
