import { createPinia, defineStore } from 'pinia'

// 创建 Pinia 实例
const pinia = createPinia()

export { pinia }

// 定义一个 store
export const useChatStore = defineStore('chat', {
  state: () => ({
    contacts: [],
    messages: []
  }),
  actions: {
    sendMessage(content) {
      const message = {
        id: Date.now(),
        from: 1,  // 1 代表当前用户
        content,
        timestamp: new Date().toLocaleTimeString(),
        retracted: false
      }
      this.messages.push(message)
    },
    retractMessage(index) {
      if (index >= 0 && index < this.messages.length) {
        this.messages[index].retracted = true
      }
    }
  }
})