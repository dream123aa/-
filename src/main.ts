import { createApp } from 'vue';
import App from './App.vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import 'animate.css'; // 引入 animate.css
import { createPinia } from 'pinia';
import router from './router';
import './assets/styles.css'; // 保留引入 styles.css

createApp(App).use(ElementPlus).use(createPinia()).use(router).mount('#app');