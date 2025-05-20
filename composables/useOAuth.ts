import { useRuntimeConfig, useSupabaseClient } from "#imports";
import { toast } from "vue-sonner";

export function useGoogleOAuth() {
  const client = useSupabaseClient();
  const config = useRuntimeConfig();

  const loginWithGoogle = async () => {
    const { error } = await client.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${config.public.baseUrl}/confirm`,
      },
    });

    if (error) {
      toast.error(
        error.message || "Failed to login with Google. Please try again."
      );
    }
  };

  return { loginWithGoogle };
}
