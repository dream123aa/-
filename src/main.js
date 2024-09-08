import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'  // 使用 createPinia 来创建 Pinia 实例
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'animate.css/animate.min.css'
// import './assets/styles.css';  // 引入全局样式


// Font Awesome 配置
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faPaperPlane, faImage, faUpload, faHistory, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import '@fortawesome/fontawesome-free/css/all.css'  // 导入 Font Awesome 图标库的 CSS

// 将新图标添加到 Font Awesome 库中
library.add(faPaperPlane, faImage, faUpload, faHistory, faMagnifyingGlass)

const app = createApp(App)

// 创建 Pinia 实例
const pinia = createPinia()

// 注册 Font Awesome 组件
app.component('font-awesome-icon', FontAwesomeIcon)

// 使用 Pinia, Router 和 ElementPlus 插件
app.use(pinia)
app.use(router)
app.use(ElementPlus)

// 挂载应用
app.mount('#app')