/**
 * Generates JSON-LD structured data for various content types
 * Helps search engines better understand and display your content in search results
 */

/**
 * Generate structured data for an organization
 */
export function useOrganizationSchema() {
  const config = useRuntimeConfig();

  useHead({
    script: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "ShipWait",
          url: config.public.baseUrl,
          logo: `${config.public.baseUrl}/img/logo.png`,
          sameAs: [
            "https://twitter.com/shipwait",
            "https://linkedin.com/company/shipwait",
            // Add other social profiles
          ],
          contactPoint: {
            "@type": "ContactPoint",
            telephone: "",
            contactType: "customer service",
            email: "support@shipwait.app",
          },
        }),
      },
    ],
  });
}

/**
 * Generate structured data for a product
 */
export function useProductSchema(product: {
  name: string;
  description: string;
  image: string;
  price: number;
  priceCurrency?: string;
  url?: string;
}) {
  const config = useRuntimeConfig();
  const route = useRoute();

  const {
    name,
    description,
    image,
    price,
    priceCurrency = "EUR",
    url = `${config.public.baseUrl}${route.path}`,
  } = product;

  useHead({
    script: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          name: name,
          description: description,
          image: image.startsWith("http")
            ? image
            : `${config.public.baseUrl}${image}`,
          offers: {
            "@type": "Offer",
            price: price,
            priceCurrency: priceCurrency,
            availability: "https://schema.org/InStock",
            url: url,
          },
        }),
      },
    ],
  });
}

/**
 * Generate structured data for an FAQ page
 */
export function useFaqSchema(faqs: { question: string; answer: string }[]) {
  useHead({
    script: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        }),
      },
    ],
  });
}
