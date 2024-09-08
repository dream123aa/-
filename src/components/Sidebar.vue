<template>
  <el-aside width="70px" class="sidebar-container">
    <!-- 用户头像 -->
    <el-avatar 
      :src="userAvatar" 
      size="large" 
      class="user-avatar" 
      @click="openProfileDialog"
    />

    <!-- 按钮容器，按钮在头像下方垂直排列 -->
    <div class="button-container">
      <!-- 聊天按钮 -->
      <button
        class="action-button"
        @click="changeView('chat')"
      >
        <i class="fas fa-comments"></i> <!-- 聊天图标 -->
      </button>

      <!-- 好友按钮 -->
      <button
        class="action-button"
        @click="changeView('friend')"
      >
        <i class="fas fa-user-friends"></i> <!-- 好友图标 -->
      </button>

      <!-- 添加好友按钮 -->
      <button
        class="action-button"
        @click="openAddFriendDialog"
      >
        <i class="fas fa-user-plus"></i> <!-- 添加好友图标 -->
      </button>

      <!-- 创建群聊按钮 -->
      <button
        class="action-button"
        @click="openCreateGroupDialog"
      >
        <i class="fas fa-users"></i> <!-- 群聊图标 -->
      </button>
    </div>

    <!-- 创建群聊对话框 -->
    <el-dialog
      title="创建群聊"
      :visible.sync="isCreateGroupDialogVisible"
      width="400px"
      @close="resetCreateGroupForm"
    >
      <el-form :model="createGroupForm" ref="createGroupFormRef">
        <el-form-item label="群聊名称" :label-width="formLabelWidth">
          <el-input v-model="createGroupForm.groupName" placeholder="请输入群聊名称" />
        </el-form-item>
        <el-form-item label="邀请用户" :label-width="formLabelWidth">
          <el-select
            v-model="createGroupForm.invitedUsers"
            multiple
            placeholder="请选择用户"
          >
            <el-option
              v-for="user in users"
              :key="user.id"
              :label="user.name"
              :value="user.id"
            />
          </el-select>
        </el-form-item>
        <div slot="footer" class="dialog-footer">
          <el-button @click="isCreateGroupDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="createGroup">创建</el-button>
        </div>
      </el-form>
    </el-dialog>
  </el-aside>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    userAvatar: {
      type: String,
      default: 'path/to/default/avatar.jpg'
    },
    users: {
      type: Array,
      default: () => [] // 传递用户列表以供选择
    }
  },
  data() {
    return {
      isCreateGroupDialogVisible: false, // 控制对话框的显示
      createGroupForm: {
        groupName: '',
        invitedUsers: []
      },
      formLabelWidth: '100px' // 标签宽度
    };
  },
  methods: {
    openProfileDialog() {
      this.$emit('openProfile');
    },
    changeView(view) {
      this.$emit('changeView', view);
    },
    openAddFriendDialog() {
      this.$emit('openAddFriendDialog');
    },
    openCreateGroupDialog() {
      this.isCreateGroupDialogVisible = true;
    },
    async createGroup() {
      try {
        // 发送请求到模拟接口以创建群聊
        const response = await axios.post('/api/groups', this.createGroupForm);
        if (response.data.success) {
          this.$message.success('群聊创建成功');
          this.isCreateGroupDialogVisible = false;
          this.resetCreateGroupForm();
          this.$emit('groupCreated');
        } else {
          this.$message.error('创建群聊失败: ' + response.data.message);
        }
      } catch (error) {
        this.$message.error('创建群聊时发生错误');
        console.error('API request failed:', error);
      }
    },
    resetCreateGroupForm() {
      this.createGroupForm.groupName = '';
      this.createGroupForm.invitedUsers = [];
    }
  }
}
</script>

<style scoped>
.sidebar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f2f2f2;
  height: 100%;
  border-right: 1px solid #ddd;
  padding-top: 20px;
}

.user-avatar {
  margin-bottom: 20px;
  cursor: pointer;
}

.button-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.action-button {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: #ffffff;
  border: none;
  font-size: 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s;
  cursor: pointer;
}

.action-button:hover {
  background-color: #f0f0f0;
}

.action-button i {
  margin: 0;
}

.dialog-footer {
  text-align: right;
}
</style>
