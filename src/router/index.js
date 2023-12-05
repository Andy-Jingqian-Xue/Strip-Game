import { createRouter, createWebHistory } from "vue-router";
import ChoiceQuestion from "../components/ChoiceQuestion.vue";
import HomePage from "../components/HomePage.vue";
import EndPage from "../components/EndPage.vue";

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
    {
      path: "/cq-endpage",
      name: "EndPage",
      component: EndPage,
      props: true,
    },
  ],
});

export default router;
