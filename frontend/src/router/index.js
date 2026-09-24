import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import UnderConstructionView from '@/views/UnderConstructionView.vue'
import AboutView from '@/views/AboutView.vue'
import CareerView from '@/views/CareerView.vue'
import ContactView from '@/views/ContactView.vue'

const routes = [
  { path: '/',         component: HomeView },
  { path: '/about',    component: AboutView },
  { path: '/career',   component: CareerView },
  { path: '/career/tha-ti', component: UnderConstructionView },
  { path: '/career/tha-mt', component: UnderConstructionView },
  { path: '/career/fos', component: UnderConstructionView },
  { path: '/career/uka-kora', component: UnderConstructionView },
  { path: '/career/uka-mediha', component: UnderConstructionView },
  { path: '/career/uka-rad', component: UnderConstructionView },
  { path: '/career/igel', component: UnderConstructionView },
  { path: '/projects', component: UnderConstructionView },
  { path: '/projects/:id', component: UnderConstructionView },
  { path: '/blog',     component: UnderConstructionView },
  { path: '/cv',       component: UnderConstructionView },
  { path: '/contact',  component: ContactView },
  
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router