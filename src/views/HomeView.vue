<!-- <template>
    <el-container class="chat-container">
      <el-header class="chat-header">
        <h1 class="chat-title">Online Chat</h1>
      </el-header>
      <el-main class="chat-main">
        <div class="chat-messages" ref="messages">
          <div v-for="(message, index) in messages" :key="index" class="chat-message">
            <span>{{ message }}</span>
          </div>
        </div>
      </el-main>
      <el-footer class="chat-footer">
        <el-input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Type a message" class="chat-input">
          <template #append>
            <el-button @click="sendMessage" type="primary" icon="el-icon-message"></el-button>
          </template>
        </el-input>
      </el-footer>
    </el-container>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue';
  import { ElMessage } from 'element-plus';
  
  export default defineComponent({
    name: 'HomeView',
    setup() {
      const messages = ref<string[]>([]);
      const newMessage = ref('');
      const messagesEnd = ref<HTMLElement | null>(null);
  
      const sendMessage = () => {
        if (newMessage.value.trim()) {
          messages.value.push(newMessage.value.trim());
          newMessage.value = '';
          scrollToEnd();
        } else {
          ElMessage.error('Message cannot be empty');
        }
      };
  
      const scrollToEnd = () => {
        if (messagesEnd.value) {
          messagesEnd.value.scrollTop = messagesEnd.value.scrollHeight;
        }
      };
  
      onMounted(() => {
        messagesEnd.value = document.querySelector('.chat-messages');
      });
  
      return { messages, newMessage, sendMessage };
    }
  });
  </script>
  
  <style scoped>
  .chat-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
  }
  
  .chat-header {
    text-align: center;
    background: linear-gradient(to right, #f953c6, #b91d73);
    color: white;
    padding: 20px;
  }
  
  .chat-title {
    font-size: 2em;
  }
  
  .chat-main {
    flex-grow: 1;
    padding: 20px;
    background: #f9f9f9;
  }
  
  .chat-messages {
    max-height: calc(100vh - 200px);
    overflow-y: auto;
    padding: 10px;
    background: white;
    border-radius: 5px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }
  
  .chat-message {
    padding: 10px;
    margin-bottom: 10px;
    background: #f1f1f1;
    border-radius: 5px;
  }
  
  .chat-footer {
    padding: 20px;
    background: white;
    display: flex;
    justify-content: space-between;
  }
  
  .chat-input {
    width: calc(100% - 100px);
  }
  </style> -->