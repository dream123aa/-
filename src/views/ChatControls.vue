<template>
  <div class="chat-controls-container">
    <div class="chat-controls-bar">
      <!-- 查看聊天历史图标按钮 -->
      <el-button class="control-button" @click="showHistoryDialog" type="text">
        <font-awesome-icon icon="fa-solid fa-history" />
      </el-button>

      <!-- 搜索聊天记录图标按钮 -->
      <el-button class="control-button" @click="toggleSearch" type="text">
        <font-awesome-icon icon="fa-solid fa-magnifying-glass" />
      </el-button>

      <!-- 群聊管理按钮（仅在群聊时显示） -->
      <el-button
        v-if="isGroupChat && isGroupOwnerOrAdmin"
        class="control-button"
        @click="showGroupManagementDialog"
        type="text"
      >
        <font-awesome-icon icon="fa-solid fa-users-cog" />
      </el-button>

      <!-- 群公告按钮（仅在群聊时显示） -->
      <el-button
        v-if="isGroupChat && isGroupOwnerOrAdmin"
        class="control-button"
        @click="showGroupAnnouncementDialog"
        type="text"
      >
        <font-awesome-icon icon="fa-solid fa-bullhorn" />
      </el-button>

      <!-- 搜索输入框 -->
      <el-input
        v-if="searchVisible"
        v-model="searchQuery"
        placeholder="输入搜索词"
        clearable
        class="search-input"
        @input="searchMessages"
      />
    </div>

    <!-- 聊天历史弹窗 -->
    <el-dialog title="聊天历史" :visible.sync="historyDialogVisible" width="50%">
      <p v-if="historyMessages.length">聊天历史记录...</p>
      <ul v-if="historyMessages.length">
        <li v-for="(message, index) in historyMessages" :key="index">
          {{ message.content }}
        </li>
      </ul>
      <p v-if="!historyMessages.length">没有聊天历史。</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="historyDialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>

    <!-- 搜索聊天记录弹窗 -->
    <el-dialog title="搜索聊天记录" :visible.sync="searchDialogVisible" width="50%">
      <el-input
        v-model="searchQuery"
        placeholder="请输入搜索内容"
        clearable
        @input="searchMessages"
      />
      <div class="search-results">
        <p v-if="searchResults.length">搜索结果...</p>
        <ul v-if="searchResults.length">
          <li v-for="(result, index) in searchResults" :key="index">
            {{ result.content }}
          </li>
        </ul>
        <p v-if="!searchResults.length">没有找到匹配的消息。</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="searchDialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>

    <!-- 群聊管理弹窗 -->
    <el-dialog title="群聊管理" :visible.sync="groupManagementDialogVisible" width="50%">
      <div class="group-management">
        <p>群主和管理员可以管理群成员、修改群信息、解散群聊。</p>
        <el-button type="primary" @click="manageMembers">管理群成员</el-button>
        <el-button type="warning" @click="editGroupInfo">修改群信息</el-button>
        <el-button type="danger" @click="deleteGroup">解散群聊</el-button>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="groupManagementDialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>

    <!-- 群公告弹窗 -->
    <el-dialog title="群公告" :visible.sync="groupAnnouncementDialogVisible" width="50%">
      <el-input
        type="textarea"
        v-model="groupAnnouncement"
        placeholder="输入群公告"
        clearable
      />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="publishAnnouncement">发布公告</el-button>
        <el-button @click="groupAnnouncementDialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'; // 导入axios用于API调用

export default {
  data() {
    return {
      historyDialogVisible: false,
      searchDialogVisible: false,
      groupManagementDialogVisible: false,
      groupAnnouncementDialogVisible: false,
      searchVisible: false,
      searchQuery: '',
      searchResults: [],
      groupAnnouncement: '',
      historyMessages: [], // 存储聊天历史
      isGroupChat: false, // 假设是否为群聊的标识
      isGroupOwnerOrAdmin: true, // 假设用户是群主或管理员
    };
  },
  methods: {
    // 展示聊天历史弹窗
    showHistoryDialog() {
      this.historyDialogVisible = true;
      this.loadHistoryMessages(); // 加载历史消息
    },
    // 切换搜索框显示状态
    toggleSearch() {
      this.searchVisible = !this.searchVisible;
      if (!this.searchVisible) {
        this.searchQuery = ''; // 清空搜索框
        this.searchResults = [];
      }
    },
    // 搜索聊天记录
    searchMessages() {
      const query = this.searchQuery.trim().toLowerCase();
      if (!query) {
        this.searchResults = [];
        return;
      }
      // 搜索当前聊天记录
      this.searchResults = this.$parent.messages.filter((message) =>
        message.content.toLowerCase().includes(query)
      );
    },
    // 加载聊天历史
    async loadHistoryMessages() {
      try {
        // API 调用：获取聊天历史
        const response = await axios.get('/api/messages/history', {
          params: { contactId: this.$parent.selectedContact.id },
        });
        this.historyMessages = response.data; // 从后端获取的数据
      } catch (error) {
        console.error('加载聊天历史失败:', error);
      }
    },
    // 群聊管理功能
    showGroupManagementDialog() {
      this.groupManagementDialogVisible = true;
    },
    manageMembers() {
      alert('管理群成员功能');
      // 这里可以调用后端API来管理群成员
    },
    editGroupInfo() {
      alert('修改群信息功能');
      // 这里可以调用后端API来修改群信息
    },
    deleteGroup() {
      if (confirm('确定要解散群聊吗？')) {
        // API 调用：解散群聊
        axios
          .post('/api/groups/delete', { groupId: this.$parent.selectedContact.id })
          .then(() => {
            alert('群聊已解散');
          })
          .catch((error) => {
            console.error('解散群聊失败:', error);
          });
      }
    },
    // 群公告发布逻辑
    showGroupAnnouncementDialog() {
      this.groupAnnouncementDialogVisible = true;
    },
    publishAnnouncement() {
      if (this.groupAnnouncement.trim()) {
        // API 调用：发布群公告
        axios
          .post('/api/groups/announcement', {
            groupId: this.$parent.selectedContact.id,
            announcement: this.groupAnnouncement,
          })
          .then(() => {
            alert('群公告已发布');
            this.groupAnnouncementDialogVisible = false;
          })
          .catch((error) => {
            console.error('发布群公告失败:', error);
          });
      } else {
        alert('请输入群公告内容');
      }
    },
  },
  mounted() {
    // 假设有一个函数或属性 `this.$parent.isGroupChat` 来判断是否为群聊
    this.isGroupChat = this.$parent.isGroupChat; // 根据实际场景设置
  },
};
</script>

<style scoped>
/* 功能栏整体样式 */
.chat-controls-container {
  position: fixed;
  z-index: 1000;
  bottom: 670px; /* 距离底部 */
  right: 12px; /* 距离右边 */
}

/* 功能栏按钮样式 */
.chat-controls-bar {
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.8); /* 半透明背景 */
  border-radius: 12px; /* 圆角 */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* 阴影效果 */
  padding: 10px;
}

/* 图标按钮样式 */
.control-button {
  font-size: 18px; /* 图标大小 */
  padding: 10px; /* 按钮内边距 */
  margin-right: 10px; /* 按钮间距 */
  border-radius: 50%; /* 圆形按钮 */
  background-color: #fff; /* 按钮背景 */
  border: 1px solid #409eff; /* 边框 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 轻微的阴影效果 */
  transition: background-color 0.3s, color 0.3s, box-shadow 0.3s; /* 动效 */
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 悬停时效果 */
.control-button:hover {
  background-color: #66b1ff; /* 悬停时背景色变化 */
  color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* 悬停时阴影增强 */
}

/* 搜索输入框样式 */
.search-input {
  width: 200px;
  margin-left: 10px;
  border: 1px solid #dcdcdc;
}

/* 弹窗底部按钮样式 */
.dialog-footer {
  text-align: right;
}

.search-results {
  margin-top: 10px;
}

.group-management {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>