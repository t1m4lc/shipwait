export type SlugCheckState =
  | "not-set"
  | "loading"
  | "available"
  | "unavailable";

export interface CreatedProject {
  id: string;
  slug: string;
}
