/**
 * A composable for consistent SEO metadata across the site
 */
export const useSeo = (options: {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: string;
  robots?: string;
}) => {
  const config = useRuntimeConfig();
  const route = useRoute();

  const {
    title,
    description,
    image = "/img/og-image.jpg",
    url = `${config.public.baseUrl}${route.path}`,
    type = "website",
    robots = "index, follow",
  } = options;

  useHead({
    title,
    meta: [
      { name: "description", content: description },
      { name: "robots", content: robots },
      // Open Graph
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:image", content: image },
      { property: "og:type", content: type },
      { property: "og:url", content: url },
      // Twitter Card
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: image },
      // Additional
      { name: "author", content: "ShipWait" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
    ],
    link: [{ rel: "canonical", href: url }],
  });
};
