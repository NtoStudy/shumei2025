import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

// 路由配置
const routes = [
  {
    path: '/',
    name: 'Welcome',
    component: () => import('@/views/Welcome.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/home/Home.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/emotion',
    name: 'Emotion',
    component: () => import('@/views/emotion/EmotionIndex.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: 'diary',
        name: 'EmotionDiary',
        component: () => import('@/views/emotion/EmotionDiary.vue')
      },
      {
        path: 'chart',
        name: 'EmotionChart',
        component: () => import('@/views/emotion/EmotionChart.vue')
      }
    ]
  },
  {
    path: '/tools',
    name: 'Tools',
    component: () => import('@/views/tools/ToolsIndex.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: 'breathing',
        name: 'Breathing',
        component: () => import('@/views/tools/Breathing.vue')
      },
      {
        path: 'meditation',
        name: 'Meditation',
        component: () => import('@/views/tools/Meditation.vue')
      },
      {
        path: 'cognition',
        name: 'Cognition',
        component: () => import('@/views/tools/Cognition.vue')
      }
    ]
  },
  {
    path: '/community',
    name: 'Community',
    component: () => import('@/views/community/CommunityIndex.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: 'treehole',
        name: 'Treehole',
        component: () => import('@/views/community/Treehole.vue')
      },
      {
        path: 'groups',
        name: 'Groups',
        component: () => import('@/views/community/Groups.vue')
      }
    ]
  },
  {
    path: '/growth',
    name: 'Growth',
    component: () => import('@/views/growth/GrowthIndex.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/views/growth/Profile.vue')
      },
      {
        path: 'report',
        name: 'Report',
        component: () => import('@/views/growth/Report.vue')
      }
    ]
  },
  {
    path: '/resources',
    name: 'Resources',
    component: () => import('@/views/resources/ResourcesIndex.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: 'knowledge',
        name: 'Knowledge',
        component: () => import('@/views/resources/Knowledge.vue')
      },
      {
        path: 'tests',
        name: 'Tests',
        component: () => import('@/views/resources/Tests.vue')
      },
      {
        path: 'crisis',
        name: 'Crisis',
        component: () => import('@/views/resources/Crisis.vue')
      }
    ]
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/Settings.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/help',
    name: 'Help',
    component: () => import('@/views/Help.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})


export default router
