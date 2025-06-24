import { serverSupabaseServiceRole } from "#supabase/server";
import { UAParser } from "ua-parser-js";
import { Database } from "~/types/supabase";

export default defineEventHandler(async (event) => {
  const res = event.node.res;
  const req = event.node.req;

  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    // Preflight request — respond with 204 No Content
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== "POST") {
    res.statusCode = 405;
    res.end("Method Not Allowed");
    return;
  }

  const body = await readBody(event);
  const { email, projectId, projectSlug } = body;

  if (!email || (!projectId && !projectSlug)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing email or project identifier",
    });
  }

  const client = serverSupabaseServiceRole<Database>(event);

  // Determine the actual project ID (either direct or via slug lookup)
  let actualProjectId = projectId;

  // If slug is provided but no ID, look up the project ID by slug
  if (projectSlug && !projectId) {
    const { data: project, error: projectError } = await client
      .from("projects")
      .select("id")
      .eq("slug", projectSlug)
      .single();

    if (projectError || !project) {
      throw createError({
        statusCode: 404,
        statusMessage: "Project not found",
      });
    }

    actualProjectId = project.id;
  }

  // Check if the email already exists for the given projectId
  // Using count for better performance - stops once at least one match is found
  const { count: leadCount, error: fetchError } = await client
    .from("leads")
    .select("*", { count: "exact", head: true })
    .eq("project_id", actualProjectId)
    .eq("email", email)
    .limit(1);

  const existingLead = leadCount && leadCount > 0;

  if (fetchError) {
    throw createError({
      statusCode: 500,
      statusMessage: "Error checking existing lead",
    });
  }

  if (existingLead) {
    throw createError({
      statusCode: 409,
      statusMessage: "Email already exists for this project",
    });
  }

  // Get project owner to check their subscription and email limits
  const { data: project, error: projectError } = await client
    .from("projects")
    .select("user_id")
    .eq("id", actualProjectId)
    .single();

  if (projectError || !project) {
    throw createError({
      statusCode: 404,
      statusMessage: "Project not found",
    });
  }

  // Get current email count for this project
  const { count: currentEmailCount, error: countError } = await client
    .from("leads")
    .select("*", { count: "exact", head: true })
    .eq("project_id", actualProjectId);

  if (countError) {
    throw createError({
      statusCode: 500,
      statusMessage: "Error checking current email count",
    });
  }

  // Check user's subscription and email collection limits
  const { data: subscription } = await client
    .from("subscriptions")
    .select(
      `
      status,
      prices (
        stripe_price_id
      )
    `
    )
    .eq("user_id", project.user_id)
    .eq("status", "active")
    .single();

  // Get email collection limit feature flag
  const { data: emailLimitFeature, error: featureError } = await client
    .from("feature_flags")
    .select("price_configs")
    .eq("name", "email_collection_limit")
    .single();

  if (featureError || !emailLimitFeature) {
    // If feature flag doesn't exist, allow unlimited collection (fallback)
    console.warn(
      "Email collection limit feature flag not found, allowing unlimited collection"
    );
  } else {
    const priceConfigs = Array.isArray(emailLimitFeature.price_configs)
      ? (emailLimitFeature.price_configs as Array<{
          price_id: string | null;
          limit: string | boolean;
        }>)
      : [];

    let userLimit: string | boolean | null = null;

    if (subscription?.prices?.stripe_price_id) {
      // User has a subscription, check their limit
      const userConfig = priceConfigs.find(
        (config) =>
          subscription.prices &&
          config.price_id === subscription.prices.stripe_price_id
      );
      if (userConfig) {
        userLimit = userConfig.limit;
      }
    } else {
      // User has no subscription, use free tier limit
      const freeConfig = priceConfigs.find(
        (config) => config.price_id === null
      );
      if (freeConfig) {
        userLimit = freeConfig.limit;
      }
    }

    // Only check limits if we found a valid configuration
    if (userLimit !== null && userLimit !== "unlimited" && userLimit !== true) {
      const maxEmails = typeof userLimit === "string" ? Number(userLimit) : 0;
      const currentCount = currentEmailCount || 0;

      if (currentCount >= maxEmails) {
        throw createError({
          statusCode: 429, // Too Many Requests
          statusMessage: `Email collection limit reached. You can collect up to ${maxEmails} emails per project on your current plan. Upgrade to Pro for unlimited email collection.`,
        });
      }
    }
  }

  const uaString = event.node.req.headers["user-agent"] || "";
  const parser = new UAParser(uaString);
  const result = parser.getResult();

  const device_type =
    result.device.type === "mobile" || result.device.type === "tablet"
      ? result.device.type
      : "desktop";

  const browser = result.browser.name || "unknown";
  const os = result.os.name || "unknown";

  const referer = Array.isArray(event.node.req.headers.referer)
    ? event.node.req.headers.referer[0] || null
    : event.node.req.headers.referer || null;

  const country = Array.isArray(event.node.req.headers["x-vercel-ip-country"])
    ? event.node.req.headers["x-vercel-ip-country"][0] || null
    : event.node.req.headers["x-vercel-ip-country"] || null;

  // Add the new lead to the database
  const { error: insertError } = await client.from("leads").insert({
    email,
    project_id: actualProjectId,
    device_type,
    browser,
    os,
    referer,
    country,
  });

  if (insertError) {
    throw createError({
      statusCode: 500,
      statusMessage: "Error adding lead to the database",
    });
  }

  return { success: true, email, projectId };
});
