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
