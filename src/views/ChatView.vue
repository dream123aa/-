<template>
  <el-container class="chat-container">
    <el-header class="chat-header">
      <h1 class="chat-title">在线聊天平台</h1>
    </el-header>
    <el-main class="chat-main">
      <div class="chat-messages" ref="messages">
        <div v-for="(message, index) in chatStore.messages" :key="index" class="chat-message animate__animated animate__fadeInUp">
          <span>{{ message }}</span>
        </div>
      </div>
    </el-main>
    <el-footer class="chat-footer">
      <el-input v-model="newMessage" @keyup.enter="sendMessage" placeholder="输入消息..." class="chat-input">
        <template #append>
          <el-button @click="sendMessage" type="primary" icon="el-icon-message"></el-button>
        </template>
      </el-input>
    </el-footer>
  </el-container>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useChatStore } from '../store';

export default defineComponent({
  name: 'ChatView',
  setup() {
    const chatStore = useChatStore();
    const newMessage = ref('');
    const socket = ref<WebSocket | null>(null);

    // 发送消息函数
    const sendMessage = () => {
      if (newMessage.value.trim()) {
        if (socket.value) {
          socket.value.send(newMessage.value.trim());
          chatStore.addMessage(newMessage.value.trim());  // 将消息添加到本地存储中
          newMessage.value = '';
        }
      } else {
        alert('消息不能为空');
      }
    };

    // 初始化WebSocket连接
    onMounted(() => {
      socket.value = new WebSocket('ws://localhost:8080');
      socket.value.onmessage = (event) => {
        chatStore.addMessage(event.data);
      };
    });

    return { chatStore, newMessage, sendMessage };
  }
});
</script>

<style scoped>
@import 'animate.css';

/* 主容器样式 */
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: linear-gradient(to right, #ff4b2b, #ff416c);
}

/* 标题样式 */
.chat-header {
  text-align: center;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 20px;
}

.chat-title {
  font-size: 2em;
  font-weight: bold;
}

/* 聊天消息区域样式 */
.chat-main {
  flex-grow: 1;
  padding: 20px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
  margin: 10px;
  overflow-y: auto;
}

.chat-messages {
  max-height: calc(100vh - 200px);
  overflow-y: auto;
  padding: 10px;
}

.chat-message {
  padding: 10px;
  margin-bottom: 10px;
  background: #ffefef;
  border-radius: 5px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

/* 输入消息区域样式 */
.chat-footer {
  padding: 20px;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: space-between;
  border-radius: 10px;
  margin: 10px;
}

.chat-input {
  width: calc(100% - 50px);
}
</style>