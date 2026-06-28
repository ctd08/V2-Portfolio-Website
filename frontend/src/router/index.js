import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import UnderConstructionView from '@/views/UnderConstructionView.vue'
import AboutView from '@/views/AboutView.vue'

const routes = [
  { path: '/',         component: HomeView },
  { path: '/about',    component: AboutView },
  { path: '/career',   component: UnderConstructionView },
  { path: '/projects', component: UnderConstructionView },
  { path: '/projects/:id', component: UnderConstructionView },
  { path: '/blog',     component: UnderConstructionView },
  { path: '/cv',       component: UnderConstructionView },
  { path: '/contact',  component: UnderConstructionView },
  
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router