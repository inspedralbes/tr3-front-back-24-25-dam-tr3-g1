/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router/auto'
import { setupLayouts } from 'virtual:generated-layouts'
import { routes } from 'vue-router/auto-routes'

import EditCharacter from '@/pages/EditCharacter.vue'
import AboutPage from '@/pages/AboutPage.vue'
import CharacterManager from '@/pages/CharacterManager.vue'
import CreateCharacter from '@/pages/CreateCharacter.vue'
import DownloadPage from '@/pages/DownloadPage.vue'
import Register from '@/pages/Register.vue'
import Login from '@/pages/Login.vue'
import Welcome from '@/components/Welcome.vue'
import Stats from '@/pages/Stats.vue'


// Add the new route to the routes array
const customRoutes = [
  {
    path: '/',
    name: 'Home',
    component: Welcome,
  },
  {
    path: '/EditCharacter/:id',
    name: 'EditCharacter',
    component: EditCharacter,
    props: true // This allows passing the `id` parameter as a prop to the component
  },
  {
    path: '/AboutPage',
    name: 'AboutPage',
    component: AboutPage,
  },
  {
    path: '/CharacterManager',
    name: 'CharacterManager',
    component: CharacterManager,
  },
  {
    path: '/CreateCharacter',
    name: 'CreateCharacter',
    component: CreateCharacter,
  },
  {
    path: '/DownloadPage',
    name: 'DownloadPage',
    component: DownloadPage,
  },
  {
    path: '/Register',
    name: 'Register',
    component: Register,
  },
  {
    path: '/Login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/Stats',
    name: 'Stats',
    component: Stats,
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: setupLayouts([...customRoutes]), // Merge the auto-generated routes with the custom routes
})

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    } else {
      console.error('Dynamic import error, reloading page did not fix it', err)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router
