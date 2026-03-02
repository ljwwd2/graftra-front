import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '@/utils/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: () => import('../views/LandingView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/app',
      name: 'app',
      component: () => import('../views/AppView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { requiresAuth: false, isLogin: true }
    },
  ],
})

/**
 * 路由守卫
 */
router.beforeEach((to, from, next) => {
  const isAuthenticated = auth.isAuthenticated()
  const requiresAuth = to.meta.requiresAuth
  const isLogin = to.meta.isLogin

  // 如果路由需要认证但用户未登录，重定向到登录页
  if (requiresAuth && !isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
    return
  }

  // 如果用户已登录且访问登录页，重定向到应用页或原始目标
  if (isLogin && isAuthenticated) {
    const redirect = to.query.redirect as string
    next(redirect || { name: 'app' })
    return
  }

  next()
})

export default router
