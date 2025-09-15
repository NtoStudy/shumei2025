import { createRouter, createWebHistory } from 'vue-router'

// 布局组件
const DefaultLayout = () => import('@/components/layout/DefaultLayout.vue')
const SimpleLayout = () => import('@/components/layout/SimpleLayout.vue')

// 路由配置
const routes = [
  {
    path: '/',
    component: SimpleLayout,
    children: [
      {
        path: '',
        name: 'Welcome',
        component: () => import('@/views/Welcome.vue'),
        meta: { requiresAuth: false }
      }
    ]
  },
  {
    path: '/login',
    component: SimpleLayout,
    children: [
      {
        path: '',
        name: 'Login',
        component: () => import('@/views/Login.vue'),
        meta: { requiresAuth: false }
      }
    ]
  },
  {
    path: '/register',
    component: SimpleLayout,
    children: [
      {
        path: '',
        name: 'Register',
        component: () => import('@/views/Register.vue'),
        meta: { requiresAuth: false }
      }
    ]
  },
  // 需要认证的主要页面，使用DefaultLayout
  {
    path: '/app',
    component: DefaultLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '/home',
        name: 'Home',
        component: () => import('@/views/home/Home.vue')
      },
      {
        path: '/emotion',
        name: 'Emotion',
        component: () => import('@/views/emotion/EmotionIndex.vue'),
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
        component: () => import('@/views/tools/ToolsIndex.vue')
      },
      {
        path: '/community',
        name: 'Community',
        component: () => import('@/views/community/CommunityIndex.vue'),
        children: [
          {
            path: 'treehole',
            name: 'Treehole',
            component: () => import('@/views/community/TreeholeEnhanced.vue')
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
        children: [
          {
            path: 'profile',
            name: 'Profile',
            component: () => import('@/views/growth/ProfileEnhanced.vue')
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
        redirect: '/resources/knowledge',
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
        component: () => import('@/views/Settings.vue')
      },
      {
        path: '/tools/breathing',
        name: 'Breathing',
        component: () => import('@/views/tools/BreathingEnhanced.vue')
      },
      {
        path: '/tools/meditation',
        name: 'Meditation',
        component: () => import('@/views/tools/Meditation.vue')
      },
      {
        path: '/tools/cognition',
        name: 'Cognition',
        component: () => import('@/views/tools/Cognition.vue')
      },
      {
        path: '/tools/relaxation',
        name: 'Relaxation',
        component: () => import('@/views/tools/Relaxation.vue')
      },
      {
        path: '/tools/stress-management',
        name: 'StressManagement',
        component: () => import('@/views/tools/StressManagement.vue')
      },
      {
        path: '/tools/emotion-regulation',
        name: 'EmotionRegulation',
        component: () => import('@/views/tools/EmotionRegulation.vue')
      },
      {
        path: '/article/:id',
        name: 'ArticleDetail',
        component: () => import('@/views/ArticleDetail.vue')
      }
    ]
  },
  // 帮助页面，使用SimpleLayout
  {
    path: '/help',
    component: SimpleLayout,
    children: [
      {
        path: '',
        name: 'Help',
        component: () => import('@/views/Help.vue'),
        meta: { requiresAuth: false }
      }
    ]
  },
  // 404页面，使用SimpleLayout
  {
    path: '/:pathMatch(.*)*',
    component: SimpleLayout,
    children: [
      {
        path: '',
        name: 'NotFound',
        component: () => import('@/views/NotFound.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 动态导入用户store
  import('@/stores/user').then(({ useUserStore }) => {
    const userStore = useUserStore()
    
    // 检查路由是否需要认证
    if (to.meta.requiresAuth) {
      // 检查用户是否已完成初始设置
      if (userStore.isFirstTime) {
        // 首次使用，引导到欢迎页面
        next('/')
        return
      }
      
      // 检查是否有用户昵称（简单的认证检查）
      if (!userStore.profile.nickname) {
        // 没有完成注册，跳转到登录页
        next('/login')
        return
      }
    }
    
    // 如果已登录用户访问登录/注册页面，重定向到首页
    if ((to.name === 'Login' || to.name === 'Register') && userStore.profile.nickname) {
      next('/home')
      return
    }
    
    next()
  })
})

export default router
