/**
 * Plugin to ensure all dashboard pages have noindex, nofollow meta tags
 * This adds an extra layer of protection in case the X-Robots-Tag header isn't processed
 */
export default defineNuxtPlugin({
  name: "dashboard-seo-plugin",
  enforce: "pre", // run before other plugins
  setup() {
    const route = useRoute();

    // Use a watcher to dynamically update head meta tags based on route
    watch(
      () => route.path,
      (newPath) => {
        if (newPath.startsWith("/dashboard")) {
          useHead({
            meta: [{ name: "robots", content: "noindex, nofollow" }],
          });
        }
      },
      { immediate: true }
    );
  },
});
