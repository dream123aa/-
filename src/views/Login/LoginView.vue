<template>
  <div class="login-page">
    <el-container class="login-container">
      <el-main class="login-main">
        <div class="login-header animate__animated animate__fadeInDown">
          您好，欢迎来到在线聊天平台！
        </div>
        <el-form @submit.prevent="login" class="login-form animate__animated animate__zoomIn">
          <el-form-item>
            <el-input v-model="username" placeholder="用户名" prefix-icon="el-icon-user" class="animate-pulse custom-input"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="password" type="password" placeholder="密码" prefix-icon="el-icon-lock" class="animate-pulse custom-input"></el-input>
          </el-form-item>
          <div class="form-links">
            <button @click="goToRegister" class="link-button">没有账号？注册</button>
            <button @click="goToForgotPassword" class="link-button">忘记密码？</button>
          </div>
          <el-form-item>
            <el-button type="primary" @click="login" round block class="login-button animate-pulse">登录</el-button>
          </el-form-item>
        </el-form>
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import axios from 'axios'; // 引入 axios
import { useChatStore } from '../../store';

export default defineComponent({
  name: 'LoginView',
  setup() {
    const router = useRouter();
    const chatStore = useChatStore();
    const username = ref('');
    const password = ref('');

    // 登录函数
    const login = async () => {
      // 前端简单验证
      if (!username.value.trim() || !password.value.trim()) {
        ElMessage.error('用户名和密码不能为空');
        return;
      }

      try {
        // 向后端发送 POST 请求进行登录验证
        const response = await axios.post('/api/login', { // 这里替换为你的后端接口地址
          username: username.value,
          password: password.value,
        });

        // 根据后端返回的数据判断是否登录成功
        if (response.data.success) { // 假设'success'是后端返回的标志
          // 登录成功后的逻辑
          chatStore.setUser(username.value); // 设置用户状态为已登录
          ElMessage.success('登录成功！');
          router.push({ name: 'Chat' }); // 跳转到聊天页面
        } else {
          // 登录失败的提示信息
          ElMessage.error(response.data.message || '登录失败，请检查用户名和密码');
        }
      } catch (error) {
        // 处理请求错误
        console.error('登录请求失败:', error);
        ElMessage.error('登录请求失败，请稍后重试');
      }
    };

    // 跳转到注册页面
    const goToRegister = () => {
      router.push('/register');
    };

    // 跳转到忘记密码页面
    const goToForgotPassword = () => {
      router.push('/forgot-password');
    };

    return { username, password, login, goToRegister, goToForgotPassword };
  }
});
</script>

<style scoped>
/* 背景设置 */
.login-page {
  background: url('src/assets/ink-background.jpg') no-repeat center center fixed;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  filter: brightness(0.9) contrast(1.2);
  position: relative;
}

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.login-main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  backdrop-filter: blur(10px);
}

.login-header {
  font-size: 2.5em;
  color: white;
  margin-bottom: 20px;
  text-align: center;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
  animation: glowText 2s infinite alternate;
}

/* 输入框样式 */
.custom-input .el-input__inner {
  background-color: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(255, 255, 255, 0.2);
  transition: box-shadow 0.3s, background-color 0.3s;
}

.custom-input .el-input__inner:focus {
  background-color: rgba(255, 255, 255, 0.4);
  box-shadow: 0 4px 20px rgba(255, 255, 255, 0.5);
}

/* 表单样式 */
.login-form {
  width: 400px;
  background: rgba(0, 0, 0, 0.6);
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.7);
}

/* 按钮样式 */
.el-button {
  border-radius: 50px;
  transition: all 0.3s ease;
}

.login-button {
  width: 100%;
  background: linear-gradient(135deg, #ff6f61, #d4418e);
  border: none;
  color: white;
  font-weight: bold;
  text-transform: uppercase;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 111, 97, 0.5);
}

.login-button:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(255, 111, 97, 0.8);
}

/* 链接按钮 */
.link-button {
  font-size: 0.9em;
  color: #ffffff;
  padding: 0;
  text-decoration: underline;
  cursor: pointer;
  border: none;
  background: none;
}

/* form-links 样式，左右分开按钮 */
.form-links {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;
}

/* 动画效果 */
@keyframes glowText {
  0% {
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
  }
  100% {
    text-shadow: 0 0 20px rgba(255, 255, 255, 1);
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.animate-pulse {
  animation: pulse 2s infinite;
}
</style>