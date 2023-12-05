import { createRouter, createWebHistory } from "vue-router";
import ChoiceQuestion from "../components/ChoiceQuestion.vue";
import HomePage from "../components/HomePage.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomePage,
    },
    {
      path: "/choice-question",
      name: "choiceQuestion",
      component: ChoiceQuestion,
    },
  ],
});

export default router;
