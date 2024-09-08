// import { io } from 'socket.io-client'

class WebSocketService {
    constructor() {
      this.socket = null
    }
  
    connect(token) {
      // 模拟 WebSocket 连接成功
      console.log('WebSocket connected (simulated)')
    }
  
    sendMessage(message) {
      // 模拟消息发送
      console.log('Message sent (simulated):', message)
    }
  
    disconnect() {
      // 模拟 WebSocket 断开连接
      console.log('WebSocket disconnected (simulated)')
    }
  }
  
  export default new WebSocketService()