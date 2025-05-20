/**
 * Generates a URL-friendly slug from a string
 *
 * @param text The text to convert to a slug
 * @returns A lowercase, hyphenated slug
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-") // Replace spaces, underscores and hyphens with a single hyphen
    .replace(/^-+|-+$/g, ""); // Remove leading and trailing hyphens
}

/**
 * Checks if a slug is available in the database
 *
 * @param slug The slug to check
 * @param projectId Optional current project ID to exclude from check (for updates)
 * @returns Object with availability status and suggested slug if original is taken
 */
export async function checkSlugAvailability(
  slug: string,
  projectId?: string
): Promise<{ available: boolean; suggestedSlug: string }> {
  const supabase = useSupabaseClient();

  // First check if the exact slug is available
  let query = supabase.from("projects").select("slug").eq("slug", slug);

  // If updating an existing project, exclude it from the check
  if (projectId) {
    query = query.neq("id", projectId);
  }

  const { data } = await query;

  // Slug is available if no results
  if (!data || data.length === 0) {
    return { available: true, suggestedSlug: slug };
  }

  // If exact slug is taken, find all similar slugs with pattern: slug-number
  let similarQuery = supabase
    .from("projects")
    .select("slug")
    .like("slug", `${slug}%`);

  // Only add the neq condition if projectId is provided
  if (projectId) {
    similarQuery = similarQuery.neq("id", projectId);
  }

  const { data: similarSlugs } = await similarQuery;

  // Find the highest number suffix using functional approach
  const highestNumber =
    similarSlugs?.reduce((maxNum, item: { slug: string }) => {
      const match = item.slug.match(new RegExp(`^${slug}-(\\d+)$`));
      if (match && match[1]) {
        const num = parseInt(match[1], 10);
        return !isNaN(num) && num > maxNum ? num : maxNum;
      }
      return maxNum;
    }, 0) || 0;

  // Generate a new slug with the next number
  const suggestedSlug = `${slug}${highestNumber + 1}`;

  return { available: false, suggestedSlug };
}
