export default defineNuxtPlugin({
  name: "landing-seo-optimizations",
  setup() {
    // Only run on client-side for landing page
    if (process.client) {
      // Preload critical resources
      const preloadCriticalResources = () => {
        // Preload fonts
        const fontLink = document.createElement("link");
        fontLink.rel = "preload";
        fontLink.as = "font";
        fontLink.type = "font/woff2";
        fontLink.crossOrigin = "anonymous";
        fontLink.href = "/fonts/inter.woff2"; // Adjust to your font path
        document.head.appendChild(fontLink);

        // Preload critical images
        const imageLink = document.createElement("link");
        imageLink.rel = "preload";
        imageLink.as = "image";
        imageLink.href = "/img/hero-background.webp"; // Adjust to your hero image
        document.head.appendChild(imageLink);
      };

      // Add structured data for better rich snippets
      const addStructuredData = () => {
        const script = document.createElement("script");
        script.type = "application/ld+json";
        script.innerHTML = JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "ShipWait",
          description:
            "Create landing pages and collect emails in minutes. Test your ideas and build only what people want.",
          url: "https://www.shipwait.com",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Any",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
          author: {
            "@type": "Organization",
            name: "ShipWait",
          },
        });
        document.head.appendChild(script);
      };

      // Initialize optimizations
      setTimeout(() => {
        preloadCriticalResources();
        addStructuredData();
      }, 100);

      // Track Core Web Vitals
      if ("web-vital" in window) {
        // This would integrate with your analytics
        console.log("Web Vitals tracking enabled");
      }
    }
  },
});
