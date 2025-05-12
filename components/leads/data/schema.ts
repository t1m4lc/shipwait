import { z } from "zod";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const leadSchema = z.object({
  email: z.string(),
  country: z.string(),
  device: z.string(),
  createdAt: z.string(),
});

export type Lead = z.infer<typeof leadSchema>;
