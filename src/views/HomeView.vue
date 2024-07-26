<template>
  <div class="home">
    <h1>欢迎使用在线聊天系统</h1>
    <el-button @click="enterChat" type="primary" size="large">进入聊天</el-button>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const enterChat = () => {
  const username = route.query.username;
  router.push({ path: '/chat', query: { username } });
};
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(to right, #6a11cb, #2575fc);
  color: white;
  text-align: center;
}

.home h1 {
  font-size: 4em;
  margin-bottom: 20px;
}
</style>