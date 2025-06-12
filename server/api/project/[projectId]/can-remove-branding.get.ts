import { serverSupabaseServiceRole } from "#supabase/server";
import type { Database } from "~/types/supabase";

export default defineEventHandler(async (event) => {
  const projectId = getRouterParam(event, "projectId");

  if (!projectId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Project ID is required",
    });
  }

  const client = serverSupabaseServiceRole<Database>(event);

  try {
    // First, get the project owner
    const { data: project, error: projectError } = await client
      .from("projects")
      .select("user_id")
      .eq("id", projectId)
      .single();

    if (projectError || !project) {
      throw createError({
        statusCode: 404,
        statusMessage: "Project not found",
      });
    }

    const projectOwnerId = project.user_id;

    // Get the user's active subscription
    const { data: subscription } = await client
      .from("subscriptions")
      .select(
        `
        id,
        price_id,
        status,
        prices (
          stripe_price_id
        )
      `
      )
      .eq("user_id", projectOwnerId)
      .eq("status", "active")
      .single();

    // If no active subscription, user can't remove branding
    if (!subscription) {
      return {
        canRemoveBranding: false,
        reason: "no_subscription",
      };
    }

    const stripePriceId = subscription.prices?.stripe_price_id;

    // Check feature flags for the remove branding feature
    const { data: featureFlags, error: flagsError } = await client
      .from("feature_flags")
      .select("name, price_configs")
      .eq("name", "remove_branding_on_page")
      .single();

    if (flagsError || !featureFlags) {
      return {
        canRemoveBranding: false,
        reason: "feature_not_found",
      };
    }

    // Check if the user's subscription allows removing branding
    const priceConfigs = Array.isArray(featureFlags.price_configs)
      ? (featureFlags.price_configs as Array<{
          price_id: string | null;
          limit: string | boolean;
        }>)
      : [];

    // Look for a matching config for the user's subscription
    const matchingConfig = priceConfigs.find(
      (config) => config.price_id === stripePriceId
    );

    // If we found a matching config and the limit is not false, user can remove branding
    const canRemoveBranding = matchingConfig && matchingConfig.limit !== false;

    return {
      canRemoveBranding: !!canRemoveBranding,
      reason: canRemoveBranding ? "allowed" : "not_allowed_by_plan",
    };
  } catch (error) {
    console.error("Error checking branding removal permission:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal server error",
    });
  }
});
