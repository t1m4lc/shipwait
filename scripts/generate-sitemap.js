/**
 * Script to generate sitemap.xml
 * Run with: node scripts/generate-sitemap.js
 */
import fs from "fs";
import path from "path";

const NUXT_PUBLIC_SITE_URL =
  process.env.NUXT_PUBLIC_SITE_URL || "https://shipwait.app";
const PUBLIC_DIR = path.join(process.cwd(), "public");
const now = new Date().toISOString().slice(0, 10);

// Pages that should be included in the sitemap
const pages = [
  { url: "/", priority: 1.0 },
  { url: "/login", priority: 0.8 },
  { url: "/register", priority: 0.8 },
  { url: "/privacy", priority: 0.6 },
  { url: "/terms", priority: 0.6 },
  { url: "/about", priority: 0.7 },
  { url: "/contact", priority: 0.7 },
  { url: "/features", priority: 0.8 },
  { url: "/pricing", priority: 0.8 },
];

// Generate XML content
const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `  <url>
    <loc>${NUXT_PUBLIC_SITE_URL}${page.url}</loc>
    <lastmod>${now}</lastmod>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

// Write to file
fs.writeFileSync(path.join(PUBLIC_DIR, "sitemap.xml"), xmlContent);

console.log("Sitemap generated successfully!");
