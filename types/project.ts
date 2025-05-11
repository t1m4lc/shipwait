export type Project = {
  id: string;
  name: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  projects: Project[];
};
