import { defineStore } from "pinia";
import instance from "@/axios/axios";
import { ENDPOINTS } from "@/config/api-routes";

export const useFlashcardsSetStore = defineStore("flashcards", {
  state: () => ({
    set: {},
    sets: [],
    userSets: [],
    likes: [],
  }),
  actions: {
    getById(id) {
      instance.get(ENDPOINTS.SET_GET.replace(":id", id)).then((response) => {
        this.set = response.data;
      });
    },
    update(updatedSet) {},
    getUserSets() {
      instance.get(ENDPOINTS.OWN_SETS_GET).then((response) => {
        this.userSets = response.data;
      });
    },
    getLikes() {
      console.log("request sent");
      instance.get(ENDPOINTS.GET_LIKED_SETS).then((response) => {
        console.log(response.data);
        this.likes = response.data;
      });
    },
  },
});
