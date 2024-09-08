<template>
  <el-container class="chat-window">
    <el-header class="chat-header">
      与 {{ selectedContact.name }} 聊天
      <ChatControls />
    </el-header>

    <el-main class="messages-container">
      <div class="messages">
        <div
          v-for="(message, index) in messages"
          :key="message.id"
          :class="['message', message.from === 1 ? 'sent' : 'received']"
        >
          <el-avatar
            v-if="message.from !== 1"
            :src="contactAvatar"
            class="avatar left-avatar"
            shape="circle"
          />

          <div class="bubble">
            <div v-if="!message.retracted" class="content">
              <div v-if="message.type === 'text'">{{ message.content }}</div>
              <el-image
                v-if="message.type === 'image'"
                :src="message.content"
                fit="cover"
                class="message-image"
              ></el-image>
              <a v-if="message.type === 'file'" :href="message.content" target="_blank">{{ message.fileName }}</a>
            </div>
            <div v-else class="content retracted">此消息已撤回</div>
            <div class="timestamp">{{ message.timestamp }}</div>

            <el-button
              v-if="!message.retracted && message.from === 1"
              class="retract-button"
              @click="retractMessage(index)"
              circle
              size="mini"
              :style="getRetractButtonStyle(message.from)"
            >
              ×
            </el-button>
          </div>

          <el-avatar
            v-if="message.from === 1"
            :src="userAvatar"
            class="avatar right-avatar"
            shape="circle"
          />
        </div>
      </div>
    </el-main>

    <el-footer class="footer">
      <div class="input-area">
        <el-input
          v-model="newMessage"
          placeholder="输入消息"
          @keyup.enter="handleSend"
          class="message-input"
          clearable
        ></el-input>

        <el-upload
          class="upload-button"
          action="#"
          :auto-upload="false"
          accept="image/*"
          :show-file-list="false"
          @change="handleFileChange"
        >
          <el-button slot="trigger" class="icon-button">
            <font-awesome-icon icon="fa-solid fa-image" />
          </el-button>
        </el-upload>

        <el-upload
          class="upload-button"
          action="#"
          :auto-upload="false"
          :show-file-list="false"
          @change="handleFileChange"
        >
          <el-button slot="trigger" class="icon-button">
            <font-awesome-icon icon="fa-solid fa-upload" />
          </el-button>
        </el-upload>

        <el-button type="primary" @click="handleSend" class="icon-button send-button">
          <font-awesome-icon icon="fa-solid fa-paper-plane" />
        </el-button>
      </div>
    </el-footer>
  </el-container>
</template>

<script>
import axios from 'axios';
import ChatControls from './ChatControls.vue';

export default {
  components: {
    ChatControls,
  },
  props: {
    messages: {
      type: Array,
      required: true,
      default: () => [],
    },
    userAvatar: {
      type: String,
      default: 'path/to/default/user/avatar.png',
    },
    contactAvatar: {
      type: String,
      default: 'path/to/default/contact/avatar.png',
    },
    selectedContact: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      newMessage: '',
    };
  },
  emits: ['sendMessage', 'retractMessage', 'update:messages'],
  async created() {
    await this.loadMessages();
  },
  methods: {
    // 发送文本消息
    async handleSend() {
      if (this.newMessage.trim()) {
        const message = {
          type: 'text',
          content: this.newMessage.trim(),
          from: 1, // 假设 1 是用户 ID
          timestamp: new Date().toISOString(),
        };
        this.$emit('sendMessage', message);
        this.newMessage = '';

        // 将消息保存到后端
        try {
          await axios.post('/api/messages', {
            contactId: this.selectedContact.id,
            message: message,
          });
        } catch (error) {
          console.error('发送消息失败:', error);
        }
      }
    },
    // 处理文件上传
    async handleFileChange(file) {
      let message;
      if (file.raw.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          message = {
            type: 'image',
            content: e.target.result,
            from: 1,
            timestamp: new Date().toISOString(),
          };
          this.$emit('sendMessage', message);

          // 保存到后端
          try {
            await axios.post('/api/messages', {
              contactId: this.selectedContact.id,
              message: message,
            });
          } catch (error) {
            console.error('发送图片消息失败:', error);
          }
        };
        reader.readAsDataURL(file.raw);
      } else {
        message = {
          type: 'file',
          content: file.url,
          fileName: file.raw.name,
          from: 1,
          timestamp: new Date().toISOString(),
        };
        this.$emit('sendMessage', message);

        // 保存到后端
        try {
          await axios.post('/api/messages', {
            contactId: this.selectedContact.id,
            message: message,
          });
        } catch (error) {
          console.error('发送文件消息失败:', error);
        }
      }
    },
    // 撤回消息
    async retractMessage(index) {
      const message = this.messages[index];
      if (!message.retracted) {
        this.$emit('retractMessage', index);
        try {
          await axios.post('/api/messages/retract', { id: message.id });
        } catch (error) {
          console.error('撤回消息失败:', error);
        }
      }
    },
    // 加载历史消息
    async loadMessages() {
      try {
        const response = await axios.get('/api/messages', {
          params: { contactId: this.selectedContact.id },
        });
        this.$emit('update:messages', response.data);
      } catch (error) {
        console.error('加载消息失败:', error);
      }
    },
    // 获取撤回按钮样式
    getRetractButtonStyle(from) {
      return {
        color: 'lightgray',
        fontSize: '18px',
        backgroundColor: 'transparent',
        boxShadow: 'none',
        border: 'none',
        lineHeight: '1',
      };
    },
  },
};
</script>

<style scoped>
/* 聊天窗口整体布局 */
.chat-window {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f9f9f9;
}

.chat-header {
  background-color: #bed1e6;
  color: white;
  padding: 1px;
  text-align: center;
  font-size: 18px;
  border-bottom: none;
  position: relative;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background-color: #fff;
}

.message {
  display: flex;
  align-items: flex-end;
  margin-bottom: 20px;
  position: relative;
}

.sent {
  justify-content: flex-end;
}

.received {
  justify-content: flex-start;
}

.avatar {
  margin: 0 10px;
}

.bubble {
  max-width: 60%;
  padding: 12px 18px;
  border-radius: 20px;
  position: relative;
  word-wrap: break-word;
  word-break: break-all;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  font-size: 14px;
}

.sent .bubble {
  background-color: #409eff;
  color: white;
  border-bottom-right-radius: 0;
  text-align: right;
}

.received .bubble {
  background-color: #e2e2e2;
  color: black;
  border-bottom-left-radius: 0;
  text-align: left;
}

.retracted {
  color: gray;
  font-style: italic;
}

.timestamp {
  font-size: 12px;
  color: gray;
  margin-top: 5px;
}

.footer {
  background-color: #f9f9f9;
  border-top: 1px solid #dcdcdc;
  padding: 10px 20px;
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 10;
}

.input-area {
  display: flex;
  align-items: center;
  flex: 1;
}

.message-input {
  flex: 0.68;
  margin-right: 10px;
  padding: 10px;
  border: 1px solid #dcdcdc;
  border-radius: 20px;
  font-size: 14px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.message-input:focus {
  outline: none;
  border-color: #409eff;
}

.icon-button {
  margin-left: 10px;
  padding: 8px;
  font-size: 20px;
  border: none;
  border-radius: 50%;
  background-color: transparent;
  transition: background-color 0.3s;
}

.icon-button:hover {
  background-color: #e0e0e0;
}

.send-button {
  background-color: #007bff;
  color: white;
}

.send-button:hover {
  background-color: #0056b3;
}

.upload-button {
  margin-left: 10px;
}

.left-avatar {
  margin-right: 10px;
}

.right-avatar {
  margin-left: 10px;
}

.message-image {
  max-width: 100%;
  border-radius: 10px;
}

.retract-button {
  position: absolute;
  top: 50%;
  right: -20px;
  transform: translateY(-50%);
  cursor: pointer;
}
</style>