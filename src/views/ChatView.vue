<template>
  <el-container style="height: 100%; flex-direction: column;">
    <!-- 顶部标题栏 -->
    <el-header class="header">
      <h1 class="header-title">在线聊天平台</h1>
    </el-header>

    <!-- 主内容区域 -->
    <el-container style="flex: 1; display: flex;">
      <!-- 侧边栏 -->
      <Sidebar
        :userAvatar="userAvatar"
        @openProfile="profileDialogVisible = true"
        @changeView="handleChangeView"
        @openAddFriendDialog="addFriendDialogVisible = true"
      />

      <!-- 内容区域 -->
      <el-container style="flex: 1;">
        <!-- 左侧聊天列表或好友列表 -->
        <el-aside width="300px" style="background-color: #e0e0e0; padding: 20px;">
          <component
            :is="currentView === 'chat' ? 'ChatList' : 'FriendList'"
            :contacts="contacts"
            @selectContact="selectContact"
          />
        </el-aside>

        <!-- 主体区域 - 调整聊天对话窗口 -->
        <el-main class="chat-main">
          <Chat
            v-if="selectedContact"
            :messages="selectedContactMessages"
            :userAvatar="userAvatar"
            :contactAvatar="selectedContact.avatar"
            :selectedContact="selectedContact"
            @sendMessage="sendMessage"
            @retractMessage="retractMessage"
          />
        </el-main>
      </el-container>
    </el-container>

    <!-- 个人资料对话框 -->
    <ProfileDialog
      v-model="profileDialogVisible"
      :userAvatar="userAvatar"
      :nickname="nickname"
      :signature="signature"
      :email="email"
      :phone="phone"
      @updateProfile="updateProfile"
    />

    <!-- 添加好友对话框 -->
    <AddFriendDialog v-model="addFriendDialogVisible" />
  </el-container>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import axios from 'axios'; // 引入 axios

import Sidebar from '../components/Sidebar.vue';
import ChatList from '../components/ChatList.vue';
import FriendList from '../components/FriendList.vue';
import Chat from './Chat.vue';
import ProfileDialog from '../components/ProfileDialog.vue';
import AddFriendDialog from '../components/AddFriendDialog.vue';

export default defineComponent({
  components: {
    Sidebar,
    ChatList,
    FriendList,
    Chat,
    ProfileDialog,
    AddFriendDialog,
  },
  setup() {
    const router = useRouter();
    const currentView = ref('friend'); // 默认显示好友列表
    const userAvatar = ref('path/to/user/avatar.jpg');
    const nickname = ref('用户昵称');
    const signature = ref('这是我的个性签名');
    const email = ref('user@example.com'); // 示例邮箱
    const phone = ref('1234567890'); // 示例手机号
    const contacts = ref([
      { id: 1, name: 'Friend 1', avatar: 'path/to/friend1/avatar.jpg', type: 'friend' },
      { id: 2, name: 'Friend 2', avatar: 'path/to/friend2/avatar.jpg', type: 'friend' },
      { id: 3, name: 'Group 1', avatar: 'path/to/group1/avatar.jpg', type: 'group' },
      { id: 4, name: 'Group 2', avatar: 'path/to/group2/avatar.jpg', type: 'group' },
    ]);
    const messages = ref<{ [key: number]: Array<any> }>({
      1: [], // Friend 1's messages
      2: [], // Friend 2's messages
    });
    const selectedContact = ref(null);
    const profileDialogVisible = ref(false);
    const addFriendDialogVisible = ref(false);

    const selectedContactMessages = computed(() => {
      return selectedContact.value ? messages.value[selectedContact.value.id] : [];
    });

    const handleChangeView = (view: string) => {
      currentView.value = view;
    };

    const sendMessage = async (message: { content: string; type?: string; fileName?: string }) => {
      if (selectedContact.value) {
        const newMessage = {
          id: (messages.value[selectedContact.value.id]?.length || 0) + 1,
          from: 1, // Assuming 1 is the current user's ID
          content: message.content,
          timestamp: new Date().toLocaleTimeString(),
          type: message.type || 'text',
          retracted: false,
          fileName: message.fileName || '',
        };
        try {
          // 调用后端接口发送消息
          await axios.post('/api/send-message', {
            contactId: selectedContact.value.id,
            message: newMessage,
          });
          messages.value[selectedContact.value.id] = messages.value[selectedContact.value.id] || [];
          messages.value[selectedContact.value.id].push(newMessage);
        } catch (error) {
          console.error('发送消息失败:', error);
          ElMessage.error('发送消息失败，请稍后重试');
        }
      }
    };

    const retractMessage = (index: number) => {
      if (selectedContact.value) {
        messages.value[selectedContact.value.id][index].retracted = true;
      }
    };

    const selectContact = (contact: any) => {
      selectedContact.value = contact;
    };

    const updateProfile = async ({ avatar, nickname, signature, email, phone }: any) => {
      try {
        // 调用后端接口更新用户资料
        await axios.post('/api/update-profile', { // 需要提供更新用户资料的 API 接口
          avatar,
          nickname,
          signature,
          email,
          phone,
        });
        userAvatar.value = avatar;
        nickname.value = nickname;
        signature.value = signature;
        email.value = email;
        phone.value = phone;
      } catch (error) {
        console.error('更新资料失败:', error);
        ElMessage.error('更新资料失败，请稍后重试');
      }
    };

    return {
      currentView,
      userAvatar,
      nickname,
      signature,
      email,
      phone,
      contacts,
      messages,
      selectedContact,
      profileDialogVisible,
      addFriendDialogVisible,
      selectedContactMessages,
      handleChangeView,
      sendMessage,
      retractMessage,
      selectContact,
      updateProfile,
    };
  }
});
</script>

<style scoped>
.el-aside {
  background-color: #e0e0e0;
}

.el-main.chat-main {
  background-color: #f5f5f5;
  padding: 0;
  margin: 0;
}

.header {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center;     /* 垂直居中 */
  background: linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d); /* 渐变背景 */
  color: #ffffff;
  height: 60px;           /* 调整后的标题栏高度 */
  padding: 0 20px;        /* 减少上下内边距 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  border-bottom: 3px solid #282828;
  position: relative;
  z-index: 10;
  animation: gradientBackground 5s ease infinite;
}

.header-title {
  margin: 0;
  font-size: 28px;  /* 调整后的字体大小 */
  font-weight: 700;
  font-family: 'Orbitron', sans-serif;
  text-transform: uppercase;
  letter-spacing: 3px;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.8), 0 0 30px rgba(255, 255, 255, 0.6);
  animation: glowText 2s infinite alternate;
}

/* 动态渐变背景 */
@keyframes gradientBackground {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* 发光效果 */
@keyframes glowText {
  0% {
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.5);
  }
  100% {
    text-shadow: 0 0 20px rgba(255, 255, 255, 1), 0 0 30px rgba(255, 255, 255, 0.8);
  }
}
</style>