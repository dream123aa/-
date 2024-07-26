<template>
  <el-container class="register-container">
    <el-main class="register-main">
      <div class="register-header animate__animated animate__fadeInDown">注册新用户</div>
      <el-form @submit.prevent="register" class="register-form animate__animated animate__zoomIn">
        <el-form-item>
          <el-input v-model="email" placeholder="邮箱" prefix-icon="el-icon-mail" class="animate-pulse"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="phone" placeholder="手机号" prefix-icon="el-icon-phone" class="animate-pulse"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="password" type="password" placeholder="密码" prefix-icon="el-icon-lock" class="animate-pulse"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="register" round block class="full-width-button animate-pulse">注册</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="text" @click="goToLogin" round block class="link-button full-width-button">已有账号? 登录</el-button>
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';

export default defineComponent({
  name: 'RegisterView',
  setup() {
    const router = useRouter();
    const email = ref('');
    const phone = ref('');
    const password = ref('');

    const register = () => {
      if (email.value && phone.value && password.value) {
        ElMessage.success('注册成功！');
        router.push('/');
      } else {
        ElMessage.error('请填写所有字段');
      }
    };

    const goToLogin = () => {
      router.push('/');
    };

    return { email, phone, password, register, goToLogin };
  }
});
</script>

<style scoped>
@import 'animate.css';

.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.register-main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.register-header {
  font-size: 2.5em;
  color: white;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  text-align: center;
}

.register-form {
  width: 400px;
  background: rgba(255, 255, 255, 0.2);
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
}

.el-input {
  margin-bottom: 20px;
  border-radius: 5px;
  overflow: hidden;
}

.el-button {
  border-radius: 5px;
  transition: all 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
}

.el-button:hover {
  transform: scale(1.05);
}

.link-button {
  font-size: 0.9em;
  color: white;
  padding: 0;
  text-decoration: underline;
  cursor: pointer;
  border: none;
  background: none;
}

.full-width-button {
  width: 100%;
}
</style>