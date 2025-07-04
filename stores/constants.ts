export const SOCIAL_X = "https://x.com/t1m4lc";
export const INSIGHTO = "https://insigh.to/b/shipwait";
export const CONTACT_EMAIL = "timothy.alcaide@gmail.com";

export const SHIPWAIT_SNIPPET_CDN_URL =
  "https://cdn.jsdelivr.net/gh/t1m4lc/shipwait-script-dist@v1.0.3/main.js";

const isProduction = process.env.NODE_ENV === "production";

export const STRIPE_MONTHLY_PRICE_ID = isProduction
  ? "price_1Rd8PcAO7Z9aERoyahvlULIv" // live mode
  : "price_1Rbd4ZAO7Z9aERoyb0Y4iEGx"; // test mode

export const STRIPE_YEARLY_PRICE_ID = isProduction
  ? "price_1Rd8P5AO7Z9aERoyRbPSGXjL" // live mode
  : "price_1Rbd8qAO7Z9aERoyJzV2JUfx"; // test mode

export const STRIPE_LIFETIME_PRICE_ID = isProduction
  ? "price_1Rd8QDAO7Z9aERoy6Pe2KGls" // live mode
  : "price_1RbdSDAO7Z9aERoyLc8ZklJk"; // test mode

export const FEATURE_FLAGS = {
  PROJECT_LIMIT: "project_limit",
  REMOVE_BRANDING_ON_PAGE: "remove_branding_on_page",
  EMAIL_COLLECTION_LIMIT: "email_collection_limit",
} as const;
