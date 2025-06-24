/**
 * Generate structured data for landing pages
 */
export const generateLandingPageStructuredData = () => {
  const config = useRuntimeConfig();

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${config.public.baseUrl}/#organization`,
        name: "ShipWait",
        url: config.public.baseUrl,
        logo: {
          "@type": "ImageObject",
          url: `${config.public.baseUrl}/img/logo.png`,
          width: 512,
          height: 512,
        },
        description:
          "Create landing pages and collect emails in minutes. Test your ideas and build only what people want.",
        foundingDate: "2024",
        sameAs: ["https://twitter.com/shipwait"],
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer service",
          email: "support@shipwait.com",
        },
      },
      {
        "@type": "WebSite",
        "@id": `${config.public.baseUrl}/#website`,
        url: config.public.baseUrl,
        name: "ShipWait",
        description:
          "Create landing pages and collect emails in minutes. Test your ideas and build only what people want.",
        publisher: {
          "@id": `${config.public.baseUrl}/#organization`,
        },
        potentialAction: [
          {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: `${config.public.baseUrl}/search?q={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
          },
        ],
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${config.public.baseUrl}/#software`,
        name: "ShipWait",
        description:
          "Create landing pages and collect emails in minutes. Test your ideas and build only what people want.",
        url: config.public.baseUrl,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web Browser",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "EUR",
          availability: "https://schema.org/InStock",
          priceValidUntil: "2025-12-31",
        },
        publisher: {
          "@id": `${config.public.baseUrl}/#organization`,
        },
        featureList: [
          "Landing page builder",
          "Email collection",
          "Idea validation",
          "Customizable forms",
          "Analytics dashboard",
          "Export capabilities",
        ],
      },
      {
        "@type": "WebPage",
        "@id": `${config.public.baseUrl}/#webpage`,
        url: config.public.baseUrl,
        name: "ShipWait - Validate Your Ideas Before Building Them",
        description:
          "Create landing pages and collect emails in minutes. Test your ideas and build only what people want.",
        isPartOf: {
          "@id": `${config.public.baseUrl}/#website`,
        },
        about: {
          "@id": `${config.public.baseUrl}/#software`,
        },
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: config.public.baseUrl,
            },
          ],
        },
      },
    ],
  };
};
