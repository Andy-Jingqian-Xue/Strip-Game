import { createRouter, createWebHistory } from 'vue-router'
import GameOne from '../components/GameOne.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: GameOne
    },
  ]
})

export default router
