import { serverSupabaseServiceRole } from "#supabase/server";
import { Database } from "~/types/supabase";

export default defineEventHandler(async (event) => {
  const res = event.node.res;
  const req = event.node.req;

  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    // Preflight request — respond with 204 No Content
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== "GET") {
    res.statusCode = 405;
    res.end("Method Not Allowed");
    return;
  }

  const query = getQuery(event);
  const projectId = query.projectId as string;
  const projectSlug = query.projectSlug as string;

  if (!projectId && !projectSlug) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing projectId or projectSlug parameter",
    });
  }

  const client = serverSupabaseServiceRole<Database>(event);

  // Determine the actual project ID for the query
  let actualProjectId = projectId;

  // If project slug is provided but no ID, look up the project ID by slug
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

  try {
    const { data: behaviors } = await client
      .from("submission_behaviors")
      .select("*")
      .eq("project_id", actualProjectId)
      .limit(1)
      .single();

    // ignore 404 errors

    return {
      success: true,
      data: behaviors,
    };
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "statusCode" in error) {
      throw error;
    }

    console.error("Error in submission-behaviors endpoint:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal server error",
    });
  }
});
