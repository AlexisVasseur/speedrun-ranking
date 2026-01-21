import { createRouter, createWebHistory } from 'vue-router'
import WidgetView from '../views/WidgetView.vue'
import OverlayView from '../views/OverlayView.vue'
import WavesView from '../views/WavesView.vue'
import BoxView from '../views/BoxView.vue'
import ConfigureView from '../views/ConfigureView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/configure'
    },
    {
      path: '/configure',
      name: 'configure',
      component: ConfigureView
    },
    {
      path: '/ladderboard',
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
    },
    {
      path: '/box',
      name: 'box',
      component: BoxView
    }
  ]
})

export default router
