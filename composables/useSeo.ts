/**
 * A composable for consistent SEO metadata across the site
 */
export const useSeo = (options: {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
  robots?: string;
  keywords?: string[];
  articleTags?: string[];
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
}) => {
  const config = useRuntimeConfig();
  const route = useRoute();

  const {
    title,
    description,
    image = "/img/og-image.svg",
    url = `${config.public.baseUrl}${route.path}`,
    type = "website",
    robots = "index, follow",
    keywords = [],
    articleTags = [],
    publishedTime,
    modifiedTime,
    author = "ShipWait",
  } = options;

  const fullImageUrl = image.startsWith("http")
    ? image
    : `${config.public.baseUrl}${image}`;

  // Use the enhanced SEO capabilities from @nuxtjs/seo
  useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogImage: fullImageUrl,
    ogType: type,
    ogUrl: url,
    ogSiteName: "ShipWait",
    twitterCard: "summary_large_image",
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: fullImageUrl,
    twitterSite: "@shipwait",
    twitterCreator: "@shipwait",
    robots,
    keywords: keywords.join(", "),
  });

  // Additional meta tags using useHead
  useHead({
    meta: [
      { name: "author", content: author },
      { name: "format-detection", content: "telephone=no" },
      ...(type === "article" && publishedTime
        ? [{ name: "article:published_time", content: publishedTime }]
        : []),
      ...(type === "article" && modifiedTime
        ? [{ name: "article:modified_time", content: modifiedTime }]
        : []),
      ...(articleTags.length > 0
        ? articleTags.map((tag) => ({ name: "article:tag", content: tag }))
        : []),
    ],
  });

  // Enhanced structured data for better rich snippets
  if (type === "website") {
    useSchemaOrg([
      defineWebSite({
        name: "ShipWait",
        url: config.public.baseUrl,
        description:
          "Create landing pages and collect emails in minutes. Test your ideas and build only what people want.",
        potentialAction: [
          {
            "@type": "SearchAction",
            target: `${config.public.baseUrl}/search?q={search_term_string}`,
            "query-input": "required name=search_term_string",
          },
        ],
      }),
      defineOrganization({
        name: "ShipWait",
        url: config.public.baseUrl,
        logo: `${config.public.baseUrl}/img/logo.png`,
        description:
          "Create landing pages and collect emails in minutes. Test your ideas and build only what people want.",
        sameAs: ["https://twitter.com/shipwait"],
      }),
    ]);
  }

  // Set canonical URL
  useHead({
    link: [{ rel: "canonical", href: url }],
  });
};
