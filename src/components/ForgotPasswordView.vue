<template>
  <el-container class="forgot-password-container">
    <el-main class="forgot-password-main">
      <div class="forgot-password-header animate__animated animate__fadeInDown">忘记密码</div>
      <el-form @submit.prevent="resetPassword" class="forgot-password-form animate__animated animate__zoomIn">
        <el-form-item>
          <el-input v-model="emailOrPhone" placeholder="邮箱或手机号" prefix-icon="el-icon-message" class="animate-pulse"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="resetPassword" round block class="full-width-button animate-pulse">重置密码</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="text" @click="goToLogin" round block class="link-button full-width-button">记得密码? 登录</el-button>
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
  name: 'ForgotPasswordView',
  setup() {
    const router = useRouter();
    const emailOrPhone = ref('');

    const resetPassword = () => {
      if (emailOrPhone.value) {
        ElMessage.success('密码重置链接已发送！');
        router.push('/');
      } else {
        ElMessage.error('请输入邮箱或手机号');
      }
    };

    const goToLogin = () => {
      router.push('/');
    };

    return { emailOrPhone, resetPassword, goToLogin };
  }
});
</script>

<style scoped>
@import 'animate.css';

.forgot-password-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.forgot-password-main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.forgot-password-header {
  font-size: 2.5em;
  color: white;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  text-align: center;
}

.forgot-password-form {
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