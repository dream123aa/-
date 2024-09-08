<template>
  <el-container class="chat-window">
    <!-- 头部：显示聊天对象名称 -->
    <el-header class="chat-header">
      与 {{ selectedContact.name || '联系人' }} 聊天
    </el-header>

    <!-- 主体：聊天消息列表 -->
    <el-main class="messages-container">
      <div class="messages">
        <div
          v-for="(message, index) in filteredMessages"
          :key="message.id"
          :class="['message', message.from === 1 ? 'sent' : 'received']"
        >
          <!-- 对方的头像显示在左侧，消息在右侧 -->
          <el-avatar
            v-if="message.from !== 1"
            :src="contactAvatar"
            class="avatar left-avatar"
            shape="circle"
          />

          <!-- 消息气泡 -->
          <div class="bubble">
            <div v-if="!message.retracted" class="content">
              <!-- 文本消息 -->
              <div v-if="message.type === 'text'">{{ message.content }}</div>
              <!-- 图片消息 -->
              <el-image
                v-if="message.type === 'image'"
                :src="message.content"
                fit="cover"
                class="message-image"
              ></el-image>
              <!-- 文件消息 -->
              <a v-if="message.type === 'file'" :href="message.content" target="_blank">{{ message.fileName }}</a>
            </div>
            <div v-else class="content retracted">此消息已撤回</div>
            <div class="timestamp">{{ message.timestamp }}</div>

            <!-- 撤回按钮 -->
            <el-button
              v-if="!message.retracted"
              class="retract-button"
              @click="retractMessage(index)"
              circle
              size="mini"
              :style="getRetractButtonStyle(message.from)"
            >
              ×
            </el-button>
          </div>

          <!-- 己方的头像显示在右侧，消息在左侧 -->
          <el-avatar
            v-if="message.from === 1"
            :src="userAvatar"
            class="avatar right-avatar"
            shape="circle"
          />
        </div>
      </div>
    </el-main>

    <!-- 固定在底部的输入区域 -->
    <el-footer class="footer">
      <div class="input-area">
        <!-- 输入框 -->
        <el-input
          v-model="newMessage"
          placeholder="输入消息"
          @keyup.enter="handleSend"
          class="message-input"
          clearable
        ></el-input>

        <!-- 上传图片按钮（图标形式） -->
        <el-upload
          class="upload-button"
          action="#"
          :auto-upload="false"
          accept="image/*"
          :show-file-list="false"
          @change="handleFileChange"
        >
          <el-button
            slot="trigger"
            class="icon-button"
          >
            <font-awesome-icon icon="fa-solid fa-image" />
          </el-button>
        </el-upload>

        <!-- 上传文件按钮（图标形式） -->
        <el-upload
          class="upload-button"
          action="#"
          :auto-upload="false"
          :show-file-list="false"
          @change="handleFileChange"
        >
          <el-button
            slot="trigger"
            class="icon-button"
          >
            <font-awesome-icon icon="fa-solid fa-upload" />
          </el-button>
        </el-upload>

        <!-- 发送按钮（图标形式） -->
        <el-button
          type="primary"
          @click="handleSend"
          class="icon-button send-button"
        >
          <font-awesome-icon icon="fa-solid fa-paper-plane" />
        </el-button>
      </div>
    </el-footer>
  </el-container>
</template>

<script>
import axios from 'axios'; // Import axios for API requests

export default {
  props: {
    messages: {
      type: Array,
      required: true,
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
      default: () => ({}), // Provide a default empty object
    },
  },
  data() {
    return {
      newMessage: '',
    };
  },
  computed: {
    filteredMessages() {
      // 在这里你可以添加过滤或处理 messages 的逻辑
      // 例如，这里只是简单返回 messages，如果需要其他处理，请修改
      return this.messages;
    },
  },
  emits: ['sendMessage', 'retractMessage'],
  methods: {
    async handleSend() {
      if (this.newMessage.trim()) {
        try {
          const response = await axios.post('/api/sendMessage', {
            type: 'text',
            content: this.newMessage.trim(),
          });
          if (response.data.success) {
            this.$emit('sendMessage', {
              type: 'text',
              content: this.newMessage.trim(),
            });
            this.newMessage = '';
          } else {
            console.error('Message sending failed:', response.data.message);
          }
        } catch (error) {
          console.error('API request failed:', error);
        }
      }
    },
    async handleFileChange(file) {
      try {
        let fileData;
        if (file.raw.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = async (e) => {
            fileData = e.target.result;
            const response = await axios.post('/api/sendMessage', {
              type: 'image',
              content: fileData,
            });
            if (response.data.success) {
              this.$emit('sendMessage', {
                type: 'image',
                content: fileData,
              });
            } else {
              console.error('Image sending failed:', response.data.message);
            }
          };
          reader.readAsDataURL(file.raw);
        } else {
          const response = await axios.post('/api/sendMessage', {
            type: 'file',
            content: file.url,
            fileName: file.raw.name,
          });
          if (response.data.success) {
            this.$emit('sendMessage', {
              type: 'file',
              content: file.url,
              fileName: file.raw.name,
            });
          } else {
            console.error('File sending failed:', response.data.message);
          }
        }
      } catch (error) {
        console.error('API request failed:', error);
      }
    },
    async retractMessage(index) {
      try {
        const response = await axios.post('/api/retractMessage', {
          messageId: this.filteredMessages[index].id,
        });
        if (response.data.success) {
          this.$emit('retractMessage', index);
        } else {
          console.error('Message retracting failed:', response.data.message);
        }
      } catch (error) {
        console.error('API request failed:', error);
      }
    },
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
.chat-window {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #f9f9f9;
}

.chat-header {
  background-color: #409eff;
  color: white;
  padding: 10px;
  text-align: center;
  font-size: 18px;
  border-bottom: 1px solid #dcdcdc;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 10px 15px; /* 减少内边距以适应屏幕 */
  background-color: #fff;
}

.messages {
  display: flex;
  flex-direction: column;
}

.message {
  display: flex;
  align-items: flex-end;
  margin-bottom: 15px; /* 减少底部边距 */
  position: relative;
}

.sent {
  justify-content: flex-end;
}

.received {
  justify-content: flex-start;
}

.avatar {
  margin: 0 8px; /* 减少头像间距 */
}

.bubble {
  max-width: 60%; /* 增加最大宽度以适应不同屏幕 */
  padding: 10px 15px; /* 调整气泡内边距 */
  border-radius: 15px; /* 调整气泡圆角 */
  position: relative;
  word-wrap: break-word;
  word-break: break-all;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); /* 调整阴影 */
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
  display: flex;
  align-items: center;
  padding: 10px 15px; /* 调整内边距 */
  background-color: #f9f9f9;
  border-top: 1px solid #dcdcdc;
}

.input-area {
  display: flex;
  align-items: center;
  flex: 1;
}

.message-input {
  flex: 1;
  margin-right: 8px; /* 减少输入框右边距 */
  padding: 10px;
  border: 1px solid #dcdcdc;
  border-radius: 20px;
  font-size: 14px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.message-input:focus {
  outline: none;
  border-color: #409eff;
}

.icon-button {
  margin-left: 8px; /* 减少按钮间距 */
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
  margin-left: 8px; /* 减少上传按钮间距 */
}

.left-avatar {
  margin-right: 8px; /* 减少左侧头像间距 */
}

.right-avatar {
  margin-left: 8px; /* 减少右侧头像间距 */
}

.message-image {
  max-width: 100%;
  border-radius: 10px;
}

.retract-button {
  position: absolute;
  top: 50%;
  right: -18px; /* 调整撤回按钮位置 */
  transform: translateY(-50%);
  cursor: pointer;
}
</style>