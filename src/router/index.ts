import { createRouter, createWebHistory } from 'vue-router'
import WidgetView from '../views/WidgetView.vue'
import OverlayView from '../views/OverlayView.vue'
import WavesView from '../views/WavesView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'widget',
      component: WidgetView
    },
    {
      path: '/overlay',
      name: 'overlay',
      component: OverlayView
    },
    {
      path: '/waves',
      name: 'waves',
      component: WavesView
    }
  ]
})

export default router
