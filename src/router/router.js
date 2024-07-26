import { createRouter, createWebHistory } from 'vue-router';
import HomeView from './views/HomeView.vue';
import ChatView from './views/ChatView.vue';

const routes = [
  { path: '/', name: 'HomeView', component: HomeView },
  { path: '/chat', name: 'ChatView', component: ChatView }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;