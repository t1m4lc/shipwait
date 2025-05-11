export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;

  const user = event.context.user; // This would come from your auth middleware

  // Simulating a DB check for products that belong to the user
  const validProductIds = ["1", "2", "3"]; // Replace this with your actual lookup logic

  if (!id || !validProductIds.includes(id)) {
    throw createError({
      statusCode: 404,
      statusMessage: "Project not found",
    });
  }

  return {
    id,
    name: `Project ${id}`,
  };
});
