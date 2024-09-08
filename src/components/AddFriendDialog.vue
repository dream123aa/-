<template>
  <el-dialog
    title="添加好友或群聊"
    :visible.sync="visible"
    width="50%"
    @close="handleClose"
  >
    <el-tabs v-model="activeTab">
      <!-- 搜索用户标签页 -->
      <el-tab-pane label="搜索用户" name="user">
        <el-form>
          <el-form-item label="用户名">
            <el-input v-model="searchQuery" placeholder="请输入用户名" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchUser">搜索</el-button>
          </el-form-item>
        </el-form>
        <!-- 显示搜索结果 -->
        <el-card
          v-for="user in searchResults.users"
          :key="user.id"
          class="result-item"
        >
          <div>{{ user.username }}</div>
          <el-button @click="addUser(user)" type="primary">添加好友</el-button>
        </el-card>
      </el-tab-pane>

      <!-- 搜索群聊标签页 -->
      <el-tab-pane label="搜索群聊" name="group">
        <el-form>
          <el-form-item label="群聊名称">
            <el-input v-model="searchQuery" placeholder="请输入群聊名称" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchGroup">搜索</el-button>
          </el-form-item>
        </el-form>
        <!-- 显示群聊搜索结果 -->
        <el-card
          v-for="group in searchResults.groups"
          :key="group.id"
          class="result-item"
        >
          <div>{{ group.name }}</div>
          <el-button @click="addGroup(group)" type="primary">加入群聊</el-button>
        </el-card>
      </el-tab-pane>
    </el-tabs>

    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import axios from 'axios'; // 用于 API 调用

export default {
  props: {
    value: Boolean
  },
  data() {
    return {
      visible: this.value,
      activeTab: 'user', // 默认选中用户搜索标签
      searchQuery: '', // 搜索输入框绑定的值
      searchResults: {
        users: [], // 搜索结果中的用户列表
        groups: [] // 搜索结果中的群聊列表
      }
    };
  },
  watch: {
    // 监听父组件传递的 'value'，控制弹窗显示
    value(val) {
      this.visible = val;
    },
    // 监听 'visible'，通知父组件更新 'value'
    visible(val) {
      this.$emit('input', val);
    }
  },
  methods: {
    // 处理关闭弹窗
    handleClose() {
      this.visible = false;
      this.$emit('input', false); // 关闭时通知父组件
    },
    // 搜索用户
    async searchUser() {
      try {
        const response = await axios.get(`/api/search/users`, {
          params: { query: this.searchQuery }
        });
        this.searchResults.users = response.data; // 将 API 返回的用户列表保存到本地
      } catch (error) {
        console.error('用户搜索失败:', error);
        this.$message.error('用户搜索失败，请重试');
      }
    },
    // 搜索群聊
    async searchGroup() {
      try {
        const response = await axios.get(`/api/search/groups`, {
          params: { query: this.searchQuery }
        });
        this.searchResults.groups = response.data; // 将 API 返回的群聊列表保存到本地
      } catch (error) {
        console.error('群聊搜索失败:', error);
        this.$message.error('群聊搜索失败，请重试');
      }
    },
    // 添加好友操作
    async addUser(user) {
      try {
        await axios.post(`/api/friends/add`, { userId: user.id });
        this.$message.success(`好友请求已发送至 ${user.username}`);
      } catch (error) {
        console.error('添加好友失败:', error);
        this.$message.error('添加好友失败，请重试');
      }
    },
    // 加入群聊操作
    async addGroup(group) {
      try {
        await axios.post(`/api/groups/join`, { groupId: group.id });
        this.$message.success(`已加入群聊 ${group.name}`);
      } catch (error) {
        console.error('加入群聊失败:', error);
        this.$message.error('加入群聊失败，请重试');
      }
    }
  }
};
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}

.el-tabs__header {
  margin-bottom: 20px;
}

.result-item {
  margin-top: 20px;
  padding: 10px;
  border: 1px solid #ddd;
}

.el-card {
  margin-bottom: 10px;
}
</style>