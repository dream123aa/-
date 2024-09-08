// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import ChatView from '../views/ChatView.vue';  // 确保路径正确
import LoginView from '../views/Login/LoginView.vue';
import RegisterView from '../views/Login/RegisterView.vue';
import ForgotPasswordView from '../views/Login/ForgotPasswordView.vue';

const routes = [
  {
    path: '/',
    redirect: '/login'  // 默认重定向到登录页面
  },
  {
    path: '/chat',
    name: 'Chat',
    component: ChatView,
    meta: { requiresAuth: true }  // 聊天页面需要登录验证
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPasswordView
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';  // 从 localStorage 中检查登录状态

  // 如果访问需要身份验证的路由，并且用户未登录，重定向到登录页
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'Login' });  // 重定向到登录页
  } else {
    next();  // 继续路由跳转
  }
});

export default router;