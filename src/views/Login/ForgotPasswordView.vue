<template>
  <div class="forgot-password-page">
    <el-container class="forgot-password-container">
      <el-main class="forgot-password-main">
        <div class="forgot-password-header animate__animated animate__fadeInDown">忘记密码</div>

        <!-- 验证码阶段 -->
        <el-form v-if="!isResettingPassword" @submit.prevent="validateCode" class="forgot-password-form animate__animated animate__zoomIn">
          <el-form-item>
            <el-input v-model="emailOrPhone" placeholder="邮箱或手机号" prefix-icon="el-icon-message" class="animate-pulse custom-input"></el-input>
          </el-form-item>

          <el-form-item>
            <el-input v-model="verificationCode" placeholder="验证码" prefix-icon="el-icon-key" class="animate-pulse custom-input"></el-input>
            <el-button type="primary" @click="sendCode" round block class="full-width-button send-code-button animate-pulse">发送验证码</el-button>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="validateCode" round block class="full-width-button reset-password-button animate-pulse">验证验证码</el-button>
          </el-form-item>

          <el-form-item>
            <el-button type="text" @click="goToLogin" round block class="link-button full-width-button">记得密码? 登录</el-button>
          </el-form-item>
        </el-form>

        <!-- 密码重置阶段 -->
        <el-form v-else @submit.prevent="confirmResetPassword" class="forgot-password-form animate__animated animate__zoomIn">
          <el-form-item>
            <el-input v-model="newPassword" type="password" placeholder="请输入新密码" prefix-icon="el-icon-lock" class="animate-pulse custom-input"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="confirmResetPassword" round block class="full-width-button confirm-button animate-pulse">确定</el-button>
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
  name: 'ForgotPasswordView',
  setup() {
    const router = useRouter();
    const emailOrPhone = ref('');
    const verificationCode = ref('');
    const newPassword = ref('');
    const isResettingPassword = ref(false); // 控制是否显示密码重置阶段

    // 发送验证码
    const sendCode = async () => {
      if (emailOrPhone.value) {
        try {
          // 调用后端接口发送验证码
          await axios.post('/api/send-code', { // 需要提供发送验证码的 API 接口
            emailOrPhone: emailOrPhone.value,
          });
          ElMessage.success('验证码已发送到您的邮箱或手机号');
        } catch (error) {
          console.error('发送验证码失败:', error);
          ElMessage.error('发送验证码失败，请稍后重试');
        }
      } else {
        ElMessage.error('请输入邮箱或手机号');
      }
    };

    // 验证验证码
    const validateCode = async () => {
      if (!emailOrPhone.value) {
        ElMessage.error('请输入邮箱或手机号');
        return;
      }
      if (!verificationCode.value) {
        ElMessage.error('请输入验证码');
        return;
      }
      try {
        // 调用后端接口验证验证码
        const response = await axios.post('/api/validate-code', { // 需要提供验证验证码的 API 接口
          emailOrPhone: emailOrPhone.value,
          verificationCode: verificationCode.value,
        });
        if (response.data.success) { // 根据后端返回的数据判断
          ElMessage.success('验证码验证成功，请输入新密码');
          isResettingPassword.value = true; // 显示密码重置输入框
        } else {
          ElMessage.error(response.data.message || '验证码错误');
        }
      } catch (error) {
        console.error('验证码验证失败:', error);
        ElMessage.error('验证码验证失败，请稍后重试');
      }
    };

    // 确认密码重置
    const confirmResetPassword = async () => {
      if (!newPassword.value) {
        ElMessage.error('请输入新密码');
        return;
      }
      try {
        // 调用后端接口进行密码重置
        const response = await axios.post('/api/reset-password', { // 需要提供重置密码的 API 接口
          emailOrPhone: emailOrPhone.value,
          newPassword: newPassword.value,
        });
        if (response.data.success) { // 根据后端返回的数据判断
          ElMessage.success('密码重置成功');
          router.push('/'); // 重置成功后跳转到登录页
        } else {
          ElMessage.error(response.data.message || '密码重置失败');
        }
      } catch (error) {
        console.error('密码重置失败:', error);
        ElMessage.error('密码重置失败，请稍后重试');
      }
    };

    const goToLogin = () => {
      router.push('/');
    };

    return { emailOrPhone, verificationCode, newPassword, sendCode, validateCode, confirmResetPassword, goToLogin, isResettingPassword };
  }
});
</script>

<style scoped>
/* 背景和布局与登录页保持一致 */
.forgot-password-page {
  background: url('src/assets/ink-background.jpg') no-repeat center center fixed;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  filter: brightness(0.9) contrast(1.2);
  position: relative;
}

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
  backdrop-filter: blur(10px);
}

.forgot-password-header {
  font-size: 2.5em;
  color: white;
  margin-bottom: 20px;
  text-align: center;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
  animation: glowText 2s infinite alternate;
}

/* 输入框样式与登录页面一致 */
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
.forgot-password-form {
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

.reset-password-button, .confirm-button {
  background: linear-gradient(135deg, #ff6f61, #d4418e);
  border: none;
  color: white;
  font-weight: bold;
  text-transform: uppercase;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 111, 97, 0.5);
}

.reset-password-button:hover, .confirm-button:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(255, 111, 97, 0.8);
}

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