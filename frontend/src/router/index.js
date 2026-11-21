import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import UnderConstructionView from '@/views/UnderConstructionView.vue'
import AboutView from '@/views/AboutView.vue'
import CareerView from '@/views/CareerView.vue'
import ContactView from '@/views/ContactView.vue'

const routes = [
  { path: '/',         component: HomeView, meta: { ambient: 'both' }},
  { path: '/about',    component: AboutView, meta: { ambient: 'stars' } },
  { path: '/career',   component: CareerView, meta: { ambient: 'circuit' } },
  { path: '/career/tha-ti', component: UnderConstructionView, meta: { ambient: 'circuit' } },
  { path: '/career/tha-mt', component: UnderConstructionView, meta: { ambient: 'circuit' } },
  { path: '/career/fos', component: UnderConstructionView, meta: { ambient: 'stars' } },
  { path: '/career/uka-kora', component: UnderConstructionView, meta: { ambient: 'stars' } },
  { path: '/career/uka-mediha', component: UnderConstructionView, meta: { ambient: 'stars' } },
  { path: '/career/uka-rad', component: UnderConstructionView, meta: { ambient: 'circuit' } },
  { path: '/career/igel', component: UnderConstructionView, meta: { ambient: 'circuit' } },
  { path: '/projects', component: UnderConstructionView, meta: { ambient: 'circuit' } },
  { path: '/projects/:id', component: UnderConstructionView , meta: { ambient: 'circuit' }},
  { path: '/blog',     component: UnderConstructionView, meta: { ambient: 'stars' } },
  { path: '/cv',       component: UnderConstructionView, meta: { ambient: 'circuit' } },
  { path: '/contact',  component: ContactView, meta: { ambient: 'stars' } },
  
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

