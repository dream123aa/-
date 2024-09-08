<template>
  <div class="register-page">
    <el-container class="register-container">
      <el-main class="register-main">
        <div class="register-header animate__animated animate__fadeInDown">注册新用户</div>
        <el-form @submit.prevent="register" class="register-form animate__animated animate__zoomIn">
          <!-- 输入邮箱 -->
          <el-form-item>
            <el-input v-model="email" placeholder="邮箱" prefix-icon="el-icon-mail" class="animate-pulse custom-input"></el-input>
          </el-form-item>
          <!-- 输入手机号 -->
          <el-form-item>
            <el-input v-model="phone" placeholder="手机号" prefix-icon="el-icon-phone" class="animate-pulse custom-input"></el-input>
          </el-form-item>
          <!-- 输入密码 -->
          <el-form-item>
            <el-input v-model="password" type="password" placeholder="密码" prefix-icon="el-icon-lock" class="animate-pulse custom-input"></el-input>
          </el-form-item>
          <!-- 验证码 -->
          <el-form-item>
            <el-input v-model="verificationCode" placeholder="验证码" prefix-icon="el-icon-key" class="animate-pulse custom-input"></el-input>
            <el-button type="primary" @click="sendCode" round block class="full-width-button send-code-button animate-pulse">发送验证码</el-button>
          </el-form-item>
          <!-- 注册按钮 -->
          <el-form-item>
            <el-button type="primary" @click="register" round block class="full-width-button register-button animate-pulse">注册</el-button>
          </el-form-item>
          <!-- 跳转登录 -->
          <el-form-item>
            <el-button type="text" @click="goToLogin" round block class="link-button full-width-button">已有账号？登录</el-button>
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

export default defineComponent({
  name: 'RegisterView',
  setup() {
    const router = useRouter();
    const email = ref('');
    const phone = ref('');
    const password = ref('');
    const verificationCode = ref('');

    // 发送验证码
    const sendCode = async () => {
      if (email.value || phone.value) {
        try {
          // 调用后端接口发送验证码
          await axios.post('/api/send-code', { // 需要提供发送验证码的 API 接口
            email: email.value,
            phone: phone.value,
          });
          ElMessage.success('验证码已发送到您的邮箱或手机号');
        } catch (error) {
          console.error('发送验证码失败:', error);
          ElMessage.error('发送验证码失败，请稍后重试');
        }
      } else {
        ElMessage.error('请填写邮箱或手机号');
      }
    };

    // 注册用户
    const register = async () => {
      if (!email.value && !phone.value) {
        ElMessage.error('请填写邮箱或手机号');
        return;
      }
      if (!password.value) {
        ElMessage.error('请填写密码');
        return;
      }
      if (!verificationCode.value) {
        ElMessage.error('请填写验证码');
        return;
      }
      try {
        // 调用后端接口进行用户注册
        const response = await axios.post('/api/register', { // 需要提供注册用户的 API 接口
          email: email.value,
          phone: phone.value,
          password: password.value,
          verificationCode: verificationCode.value,
        });
        if (response.data.success) { // 根据后端返回的数据判断
          ElMessage.success('注册成功！');
          router.push('/'); // 注册成功后跳转到登录页
        } else {
          ElMessage.error(response.data.message || '注册失败');
        }
      } catch (error) {
        console.error('注册失败:', error);
        ElMessage.error('注册失败，请稍后重试');
      }
    };

    const goToLogin = () => {
      router.push('/');
    };

    return { email, phone, password, verificationCode, sendCode, register, goToLogin };
  }
});
</script>

<style scoped>
/* 与登录页一致的背景与布局样式 */
.register-page {
  background: url('src/assets/ink-background.jpg') no-repeat center center fixed;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  filter: brightness(0.9) contrast(1.2);
  position: relative;
}

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
  backdrop-filter: blur(10px);
}

.register-header {
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
.register-form {
  width: 400px;
  background: rgba(0, 0, 0, 0.6);
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.7);
}

/* 按钮样式 */
.full-width-button {
  width: 100%;
}

.el-button {
  border-radius: 50px;
  transition: all 0.3s ease;
}

.register-button {
  background: linear-gradient(135deg, #ff6f61, #d4418e);
  border: none;
  color: white;
  font-weight: bold;
  text-transform: uppercase;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 111, 97, 0.5);
}

.register-button:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(255, 111, 97, 0.8);
}

/* 发送验证码按钮 */
.send-code-button {
  margin-top: 10px;
  background: linear-gradient(135deg, #1fa2ff, #12d8fa, #a6ffcb);
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