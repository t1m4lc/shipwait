import { defineStore } from "pinia";
import type { Project } from "~/types/projects";

interface State {
  projects: Project[];
  selectedProjectId: string;
}

export const useProjects = defineStore("projects", {
  state: (): State => ({
    projects: [
      {
        id: "1",
        name: "Waitly",
        domain: "wailtly.dev",
      },
      {
        id: "2",
        name: "Facebook",
        domain: "facebook.com",
      },
      {
        id: "3",
        name: "X",
        domain: "x.com",
      },
    ],
    selectedProjectId: "1", // TODO to projectId params router
  }),
});
