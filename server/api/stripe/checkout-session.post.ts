import { useServerStripe } from "#stripe/server"; // Provided by @unlok-co/nuxt-stripe
import {
  serverSupabaseServiceRole,
  serverSupabaseUser,
} from "#supabase/server";
import { z } from "zod";
import type { Database } from "~/types/supabase";

const checkoutSessionSchema = z.object({
  priceId: z.string().startsWith("price_"), // Stripe Price ID
  // You could add planType: z.enum(['monthly', 'yearly']) if needed for more complex logic
});

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  if (!user || !user.id || !user.email) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const body = await readBody(event);
  const validation = checkoutSessionSchema.safeParse(body);

  if (!validation.success) {
    throw createError({
      statusCode: 400,
      message: "Invalid request body",
      data: validation.error.issues,
    });
  }

  const { priceId } = validation.data;
  const stripe = await useServerStripe(event);
  const supabaseAdminClient = await serverSupabaseServiceRole<Database>(event);
  const runtimeConfig = useRuntimeConfig(event);

  let stripeCustomerId: string | undefined | null;

  // Log the user ID being processed
  console.log(`Processing checkout for Supabase user ID: ${user.id}`);

  const { data: profileData, error: profileError } = await supabaseAdminClient
    .from("profiles")
    .select("stripe_customer_id, full_name") // Also select full_name if used for Stripe customer
    .eq("id", user.id)
    .single();

  if (profileError && profileError.code !== "PGRST116") {
    console.error(`Error fetching profile for user ${user.id}:`, profileError);
    throw createError({
      statusCode: 500,
      message: "Error fetching user profile.",
      data: { supabaseError: profileError },
    });
  }

  if (!profileData && profileError?.code === "PGRST116") {
    console.warn(
      `Profile not found for user ${user.id}. This might indicate an issue with the handle_new_user trigger.`
    );
    // Depending on your system's design, you might want to throw an error here
    // or attempt to create a profile. For now, we proceed, assuming the update
    // might fail if the row truly doesn't exist, which will be caught below.
  }

  stripeCustomerId = profileData?.stripe_customer_id;

  if (!stripeCustomerId) {
    console.log(
      `No Stripe customer ID found for user ${user.id}. Creating a new Stripe customer.`
    );
    try {
      const customer = await stripe.customers.create({
        email: user.email,
        name:
          profileData?.full_name ||
          user.user_metadata?.full_name ||
          user.email.split("@")[0],
        metadata: {
          supabase_user_id: user.id,
        },
      });
      stripeCustomerId = customer.id;
      console.log(
        `Created Stripe customer ${stripeCustomerId} for user ${user.id}.`
      );

      console.log(
        `Attempting to update profile for user ${user.id} with Stripe customer ID ${stripeCustomerId}.`
      );
      const { error: updateProfileError } = await supabaseAdminClient
        .from("profiles")
        .update({ stripe_customer_id: stripeCustomerId })
        .eq("id", user.id);

      if (updateProfileError) {
        console.error(
          `Critical: Error updating profile for user ${user.id} with Stripe Customer ID ${stripeCustomerId}:`,
          JSON.stringify(updateProfileError, null, 2) // Log the full error object
        );
        throw createError({
          statusCode: 500,
          message: "Failed to save Stripe customer ID.",
          data: { supabaseErrorDetails: updateProfileError }, // Send details to client
        });
      }
      console.log(
        `Successfully updated profile for user ${user.id} with Stripe customer ID.`
      );
    } catch (e: any) {
      // Catch errors from Stripe customer creation or the re-thrown updateProfileError
      console.error(
        `Error in Stripe customer creation or profile update block for user ${user.id}:`,
        e
      );
      const errorMessage =
        e.data?.supabaseErrorDetails?.message ||
        e.message ||
        "Failed to initialize customer for Stripe.";
      throw createError({
        statusCode: 500,
        message: errorMessage,
        data: e.data || { rawError: e.message },
      });
    }
  }

  try {
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${runtimeConfig.public.baseUrl}/dashboard/pro`,
      cancel_url: `${runtimeConfig.public.baseUrl}/pricing`, // Or a specific cancellation feedback page
      metadata: {
        supabase_user_id: user.id,
        stripe_price_id: priceId,
      },
    });

    return { sessionId: session.id, sessionUrl: session.url };
  } catch (error: any) {
    console.error("Stripe Checkout Session Error:", error);
    throw createError({
      statusCode: 500,
      message: error.message || "Failed to create checkout session",
    });
  }
});
