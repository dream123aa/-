<template>
  <div class="chat-container">
    <div class="chat-sidebar">
      <el-input v-model="search" placeholder="搜索联系人..."></el-input>
      <el-menu :default-active="activeContact" class="el-menu-vertical-demo">
        <el-menu-item v-for="contact in filteredContacts" :key="contact.id" @click="selectContact(contact)">
          <span>{{ contact.name }}</span>
          <el-button @click.stop="deleteContact(contact.id)" circle size="mini">×</el-button>
        </el-menu-item>
      </el-menu>
      <div class="add-contact">
        <el-input v-model="newContactName" placeholder="新好友名称..."></el-input>
        <el-button @click="addContact" type="primary" circle size="mini">+</el-button>
      </div>
    </div>
    <div class="chat-main">
      <div class="chat-header">
        <span>{{ selectedContact ? selectedContact.name : '请选择一个联系人' }}</span>
      </div>
      <div class="chat-messages">
        <div v-for="message in messages" :key="message.id" :class="['message', message.sender === username ? 'sent' : 'received']">
          <div class="message-info">
            <span class="message-sender">{{ message.sender }}</span>
            <span class="message-time">{{ message.time }}</span>
            <el-button v-if="message.sender === username && message.type !== 'recall'" @click="recallMessage(message.id)" type="text" size="mini">撤回</el-button>
          </div>
          <div class="message-text">
            <span v-if="message.type === 'text'">{{ message.text }}</span>
            <img v-if="message.type === 'image'" :src="message.content" alt="图片" class="message-image">
            <a v-if="message.type === 'file'" :href="message.content" target="_blank" class="message-file">{{ message.text }}</a>
            <span v-if="message.type === 'recall'">消息已被 {{ message.recalledBy }} 撤回</span>
          </div>
        </div>
      </div>
      <div class="chat-input">
        <el-input v-model="newMessage" @keyup.enter="sendMessage" placeholder="输入消息..."></el-input>
        <input type="file" @change="handleFileUpload" ref="fileInput" style="display: none;">
        <el-button @click="sendMessage" type="primary">发送</el-button>
        <el-button @click="triggerFileInput" type="primary">上传文件</el-button>
        <el-button @click="triggerImageInput" type="primary">上传图片</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const username = ref(route.query.username || '未知用户');

const search = ref('');
const newMessage = ref('');
const messages = ref([]);
const activeContact = ref(null);
const selectedContact = ref(null);
const newContactName = ref('');
const fileInput = ref(null);
const contacts = ref([
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 3, name: 'Charlie' },
]);

const filteredContacts = computed(() => {
  return contacts.value.filter(contact => contact.name.toLowerCase().includes(search.value.toLowerCase()));
});

const selectContact = (contact) => {
  selectedContact.value = contact;
  activeContact.value = contact.id.toString();
  fetchMessages(contact.id);
};

const sendMessage = () => {
  if (newMessage.value.trim() === '') return;
  const timestamp = new Date().toLocaleTimeString();
  const message = { id: Date.now(), text: newMessage.value, sender: username.value, time: timestamp, type: 'text', contactId: selectedContact.value.id };
  messages.value.push(message); // 前端测试代码
  // ws.send(JSON.stringify({ type: 'message', data: message })); // 后端实现时启用
  newMessage.value = '';
};

const recallMessage = (messageId) => {
  const message = messages.value.find(msg => msg.id === messageId);
  if (message) {
    message.type = 'recall';
    message.recalledBy = username.value;
    // ws.send(JSON.stringify({ type: 'recall', data: { id: messageId, recalledBy: username.value } })); // 后端实现时启用
  }
};

const addContact = () => {
  if (newContactName.value.trim() === '') return;
  const newContact = { id: Date.now(), name: newContactName.value };
  contacts.value.push(newContact);
  newContactName.value = '';
};

const deleteContact = (contactId) => {
  contacts.value = contacts.value.filter(contact => contact.id !== contactId);
  if (selectedContact.value && selectedContact.value.id === contactId) {
    selectedContact.value = null;
    activeContact.value = null;
  }
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const timestamp = new Date().toLocaleTimeString();
      const message = { id: Date.now(), text: file.name, sender: username.value, time: timestamp, type: file.type.startsWith('image') ? 'image' : 'file', content: e.target.result, contactId: selectedContact.value.id };
      messages.value.push(message); // 前端测试代码
      // ws.send(JSON.stringify({ type: 'message', data: message })); // 后端实现时启用
    };
    reader.readAsDataURL(file);
  }
};

const triggerFileInput = () => {
  fileInput.value.accept = '*/*';
  fileInput.value.click();
};

const triggerImageInput = () => {
  fileInput.value.accept = 'image/*';
  triggerFileInput();
};

const fetchMessages = (contactId) => {
  // 模拟数据
  messages.value = [
    { id: 1, text: 'Hello Alice', sender: 'A', time: '10:00 AM', type: 'text', contactId: 1 },
    { id: 2, text: 'Hi Bob', sender: 'B', time: '10:05 AM', type: 'text', contactId: 2 },
    { id: 3, text: 'Hello Charlie', sender: 'C', time: '10:10 AM', type: 'text', contactId: 3 },
  ].filter(message => message.contactId === contactId);

  // 后端实现时启用
  /*
  try {
    const response = await axios.get(`/api/messages/${contactId}`);
    messages.value = response.data;
  } catch (error) {
    console.error("获取消息失败:", error);
  }
  */
};

onMounted(() => {
  // 获取联系人列表（可选）
  // fetchContacts();
});
</script>

<style scoped>
.chat-container {
  display: flex;
  height: 100vh;
}

.chat-sidebar {
  width: 250px;
  background-color: #2c3e50;
  padding: 20px;
  color: white;
}

.add-contact {
  display: flex;
  margin-top: 20px;
}

.add-contact .el-input {
  flex: 1;
  margin-right: 10px;
}

.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #ecf0f1;
}

.chat-header {
  background-color: #3498db;
  padding: 20px;
  color: white;
  font-size: 1.2em;
}

.chat-messages {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.message {
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
  max-width: 60%;
  word-wrap: break-word;
}

.sent {
  background-color: #e0e0e0;
  color: black;
  align-self: flex-end;
}

.received {
  background-color: #f0f0f0;
  color: black;
  align-self: flex-start;
}

.message-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.message-sender {
  font-weight: bold;
}

.message-time {
  font-size: 0.8em;
  color: #888;
}

.message-text {
  word-wrap: break-word;
}

.message-image {
  max-width: 100%;
  height: auto;
}

.message-file {
  color: #3498db;
  text-decoration: none;
}

.chat-input {
  display: flex;
  padding: 20px;
  background-color: #ecf0f1;
}

.chat-input .el-input {
  flex: 1;
  margin-right: 10px;
}
</style>