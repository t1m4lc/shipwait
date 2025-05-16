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

  const client = serverSupabaseServiceRole<Database>(event);

  try {
    const { data: behaviors, error: behaviorsError } = await client
      .from("submission_behaviors")
      .select("*")
      .eq("project_id", projectId)
      .single();

    if (behaviorsError) {
      throw createError({
        statusCode: 500,
        statusMessage: "Error fetching submission behaviors",
      });
    }

    return {
      success: true,
      data: behaviors || [],
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
