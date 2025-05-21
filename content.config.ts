import { defineCollection, defineContentConfig } from "@nuxt/content";

export default defineContentConfig({
  collections: {
    // legal: defineCollection({
    //   source: "*.md",
    //   type: "page",
    //   schema: z.object({
    //     title: z.string(),
    //     description: z.string(),
    //     date: z.date(),
    //   }),
    // }),
    content: defineCollection({
      type: "page",
      source: "**/*.md",
    }),
  },
});
