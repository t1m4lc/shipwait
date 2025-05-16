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

  if (!projectId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing projectId parameter",
    });
  }

  // Initialize Supabase client with service role
  const client = serverSupabaseServiceRole<Database>(event);

  try {
    // Just check if the project exists in the database
    const { data: project, error: projectError } = await client
      .from("projects")
      .select("id")
      .eq("id", projectId)
      .single();

    if (projectError) {
      throw createError({
        statusCode: 404,
        statusMessage: "Project not found",
      });
    }

    // Query submission behaviors for the specified project
    const { data: behaviors, error: behaviorsError } = await client
      .from("submission_behaviors")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false });

    if (behaviorsError) {
      throw createError({
        statusCode: 500,
        statusMessage: "Error fetching submission behaviors",
      });
    }

    // Return the submission behaviors
    return {
      success: true,
      data: behaviors || [],
    };
  } catch (error: unknown) {
    // If the error is already a structured error (created by createError),
    // it will be automatically handled by Nuxt
    if (typeof error === "object" && error !== null && "statusCode" in error) {
      throw error;
    }

    // Otherwise, create a generic error
    console.error("Error in submission-behaviors endpoint:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal server error",
    });
  }
});
