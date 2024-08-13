import { createRouter, createWebHistory } from 'vue-router'
import Modeler from '../views/Modeler.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Modeler',
      component: Modeler
    },
  ]
})

export default router
