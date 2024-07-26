import { createRouter, createWebHistory, RouteLocationNormalized, NavigationGuardNext } from 'vue-router';
import LoginView from '../components/LoginView.vue';
import RegisterView from '../components/RegisterView.vue';
import ForgotPasswordView from '../components/ForgotPasswordView.vue';
import HomeView from '../views/HomeView.vue';
import ChatView from '../views/ChatView.vue';
import { useChatStore } from '../store';

const routes = [
  { path: '/', component: LoginView },
  { path: '/register', component: RegisterView },
  { path: '/forgot-password', component: ForgotPasswordView },
  { 
    path: '/home', 
    component: HomeView,
    beforeEnter: (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
      const chatStore = useChatStore();
      if (chatStore.user) {
        next();
      } else {
        next('/');
      }
    }
  },
  { 
    path: '/chat', 
    component: ChatView,
    beforeEnter: (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
      const chatStore = useChatStore();
      if (chatStore.user) {
        next();
      } else {
        next('/');
      }
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;