import { serverSupabaseServiceRole } from "#supabase/server";
import { Database } from "~/types/supabase";
import { UAParser } from "ua-parser-js";

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
  const { email, projectId } = body;

  if (!email || !projectId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing email or projectId",
    });
  }

  const client = serverSupabaseServiceRole<Database>(event);

  // Check if the email already exists for the given projectId
  const { data: existingLead, error: fetchError } = await client
    .from("leads")
    .select("*", { count: "exact", head: true })
    .eq("project_id", projectId)
    .eq("email", email);

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
    project_id: projectId,
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
