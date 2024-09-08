<template>
  <div class="contact-list">
    <!-- 搜索栏 -->
    <el-input
      v-model="searchQuery"
      placeholder="搜索联系人"
      class="search-bar"
      clearable
    />
  
    <!-- 联系人列表 -->
    <div
      v-for="(contact, index) in filteredContacts"
      :key="contact.id"
      @click="handleSelectContact(contact)"
      class="contact-item"
      :class="{ 'first-item': index === 0 }"
    >
      <el-avatar :src="contact.avatar" />
      <span>{{ contact.name }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: ['contacts'], // 从父组件传入联系人列表
  data() {
    return {
      searchQuery: '' // 搜索关键字
    };
  },
  computed: {
    // 过滤后的联系人列表，基于搜索关键字
    filteredContacts() {
      return this.contacts.filter(contact =>
        contact.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  },
  methods: {
    // 处理选择联系人
    handleSelectContact(contact) {
      this.$emit('selectContact', contact); // 通过事件将选中的联系人传递给父组件
    }
  }
};
</script>

<style scoped>
.contact-list {
  display: flex;
  flex-direction: column;
}

.search-bar {
  margin-bottom: 10px;
}

.contact-item {
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.contact-item.first-item {
  margin-top: 10px; /* 第一个联系人与搜索栏的间距 */
}

.contact-item .el-avatar {
  margin-right: 10px;
}
</style>