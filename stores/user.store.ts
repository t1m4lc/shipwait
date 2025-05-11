import { defineStore } from "pinia";
import type { Project, User } from "~/types/project";

interface State {
  user: User | null;
}

// export const useUser = defineStore("user", {
//   state: (): State => ({
//     user: null,
//   }),
// });

export const useUser = defineStore("user", {
  state: (): State => ({
    user: {
      id: "string",
      name: "Tim",
      email: "tim@gmail.com",
      projects: [{ id: "trtyfsqhgsq", name: "test" }],
    },
  }),
});
