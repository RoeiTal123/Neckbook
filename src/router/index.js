import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import MainPage from '../pages/MainPage.vue'
import Friends from '../pages/Friends.vue'
import Videos from '../pages/Videos.vue'
import Marketplace from '../pages/Marketplace.vue'
import Games from '../pages/Games.vue'
import Messenger from '../pages/Messenger.vue'
import Groups from '../pages/Groups.vue'
import ProfilePage from '../pages/ProfilePage.vue'

import PostDisplay from '../components/PostDisplay.vue'
import PageDisplay from '../components/PageDisplay.vue'
import ProductDisplay from '../components/ProductDisplay.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage
    },
    {
      path: '/main/:catchAll*',
      name: 'main',
      component: MainPage
    },
    {
      path: '/friends',
      name: 'friends',
      component: Friends,
      children: [{
        path: ':category',
        name: 'friend-requests',
        children: [{
          path: ':id/:catchAll*',
          name: 'request',
          component: PageDisplay,
        }]
      }]
    },
    {
      path: '/videos/:catchAll*',
      name: 'videos',
      component: Videos
    },
    {
      path: '/marketplace',
      name: 'marketplace',
      component: Marketplace,
      children: [{
        path: 'product',
        name: 'product-display',
        children: [{
          path: ':id',
          name: 'product-display',
          component: ProductDisplay
        }]
      }]
    },
    {
      path: '/games',
      name: 'games',
      component: Games
    },
    {
      path: '/messenger',
      name: 'messenger',
      component: Messenger,
      children: [{
        path: ':id',
        name: 'chat-display',
        component: PageDisplay
      }]
    },
    {
      path: '/groups',
      name: 'groups',
      component: Groups,
      children: [{
        path: ':id/:catchAll*',
        name: 'group-page',
        component: PageDisplay
      }]
    },
    {
      path: '/profile/:id/:catchAll*',
      name: 'profile',
      component: ProfilePage
    },
    // {
    //   path: '/:catchAll*/post/:id',
    //   name: 'post-display',
    //   component: PostDisplay
    // }
  ]
})

export default router
