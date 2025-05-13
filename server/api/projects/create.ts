import type { Project } from "~/types/projects";

export default defineEventHandler(async (event) => {
  try {
    // Get request body
    const body = await readBody(event);

    // Validate request
    if (!body.name || !body.domain) {
      throw createError({
        statusCode: 400,
        message: "Project name and domain are required",
      });
    }

    // Generate a unique ID using native JavaScript
    const id = crypto.randomUUID();

    // Create new project
    const project: Project = {
      id,
      name: body.name,
      domain: body.domain,
    };

    // In a real app, we would save this to a database
    // For now, we just return the created project

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      project,
      message: "Project created successfully",
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "An error occurred while creating the project",
    });
  }
});
