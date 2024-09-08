<template>
  <div class="friend-list">
    <!-- 搜索栏 -->
    <el-input
      v-model="searchQuery"
      placeholder="搜索"
      class="search-bar"
      clearable
    />

    <!-- 我的好友分组 -->
    <div class="group">
      <div class="group-header" @click="toggleFriends">
        <h3 class="group-title">我的好友</h3>
        <button class="icon-button" :class="{ 'rotated': !friendsCollapsed }">
          <i :class="friendsCollapsed ? 'fas fa-chevron-right' : 'fas fa-chevron-down'"></i>
        </button>
      </div>
      <div v-if="!friendsCollapsed" class="group-content">
        <div
          v-for="(friend, index) in filteredFriends"
          :key="friend.id"
          @dblclick="handleSelect(friend)"
          class="friend-item"
          :class="{ 'first-item': index === 0 }"
        >
          <el-avatar :src="friend.avatar" />
          <span>{{ friend.name }}</span>
        </div>
      </div>
    </div>

    <!-- 我的群聊分组 -->
    <div class="group">
      <div class="group-header" @click="toggleGroups">
        <h3 class="group-title">我的群聊</h3>
        <button class="icon-button" :class="{ 'rotated': !groupsCollapsed }">
          <i :class="groupsCollapsed ? 'fas fa-chevron-right' : 'fas fa-chevron-down'"></i>
        </button>
      </div>
      <div v-if="!groupsCollapsed" class="group-content">
        <div
          v-for="(group, index) in filteredGroups"
          :key="group.id"
          @dblclick="handleSelect(group)"
          class="group-item"
          :class="{ 'first-item': index === 0 }"
        >
          <el-avatar :src="group.avatar" />
          <span>{{ group.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'; // Import axios for API requests

export default {
  props: {
    contacts: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      searchQuery: '', // 搜索关键字
      friendsCollapsed: false, // 控制好友列表的展开/收起状态
      groupsCollapsed: false,  // 控制群聊列表的展开/收起状态
    };
  },
  computed: {
    filteredFriends() {
      return this.contacts.filter(contact =>
        contact.type === 'friend' &&
        contact.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    filteredGroups() {
      return this.contacts.filter(contact =>
        contact.type === 'group' &&
        contact.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  },
  methods: {
    toggleFriends() {
      this.friendsCollapsed = !this.friendsCollapsed;
    },
    toggleGroups() {
      this.groupsCollapsed = !this.groupsCollapsed;
    },
    async handleSelect(contact) {
      try {
        const response = await axios.post('/api/selectContact', { contactId: contact.id });
        if (response.data.success) {
          this.$emit('selectContact', contact);
        } else {
          console.error('Contact selection failed:', response.data.message);
        }
      } catch (error) {
        console.error('API request failed:', error);
      }
    }
  }
};
</script>

<style scoped>
.friend-list {
  display: flex;
  flex-direction: column;
}

.search-bar {
  margin-bottom: 10px;
}

.group {
  margin-bottom: 20px;
}

.group-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
}

.group-title {
  font-size: 18px;
  font-weight: bold;
  margin: 0;
}

.icon-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  font-size: 14px;
  color: #333;
  transition: transform 0.2s ease;
}

.icon-button.rotated i {
  transform: rotate(90deg);
}

.group-content {
  margin-top: 10px;
}

.friend-item,
.group-item {
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.friend-item.first-item,
.group-item.first-item {
  margin-top: 10px; /* 保证第一个好友和搜索栏之间的间距 */
}

.friend-item .el-avatar,
.group-item .el-avatar {
  margin-right: 10px;
}
</style>
