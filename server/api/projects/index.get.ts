import { serverSupabaseUser, serverSupabaseClient } from "#supabase/server";
import { Database } from "~/types/supabase";

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  const client = serverSupabaseClient<Database>(event);

  if (!user) {
    return sendError(
      event,
      createError({ statusCode: 401, statusMessage: "Unauthorized" })
    );
  }

  const { data, error } = await (await client)
    .from("projects")
    .select("*")
    .eq("user_id", user.id)
    .order("name");

  if (error)
    throw createError({ statusCode: 500, statusMessage: error.message });

  return data;
});
