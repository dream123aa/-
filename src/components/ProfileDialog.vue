<template>
  <el-dialog title="个人资料" :visible.sync="visible">
    <div class="profile-dialog">
      <!-- 头像上传区域 -->
      <el-upload
        class="avatar-uploader"
        action="#"
        :show-file-list="false"
        :before-upload="beforeAvatarUpload"
        :on-change="handleAvatarChange"
      >
        <img v-if="avatarUrl" :src="avatarUrl" class="avatar" />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>

      <!-- 个人信息表单 -->
      <el-form>
        <el-form-item label="昵称">
          <el-input v-model="localNickname" />
        </el-form-item>
        <el-form-item label="签名">
          <el-input type="textarea" v-model="localSignature" />
        </el-form-item>
      </el-form>

      <!-- 账户安全部分 -->
      <el-divider></el-divider>
      <h3>账户安全</h3>
      <el-form>
        <el-form-item label="绑定邮箱">
          <div class="form-item-content">
            <span>{{ email || '未绑定' }}</span>
            <el-button 
              type="primary" 
              @click="sendEmailVerification"
              :disabled="!email"
            >
              重新发送验证邮件
            </el-button>
          </div>
        </el-form-item>
        <el-form-item label="绑定手机号">
          <div class="form-item-content">
            <span>{{ phone || '未绑定' }}</span>
            <el-button 
              type="primary" 
              @click="sendSmsVerification"
              :disabled="!phone"
            >
              重新发送验证码
            </el-button>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="openRecoverPasswordDialog">找回密码</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 底部操作按钮 -->
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="saveProfile">保存</el-button>
    </span>

    <!-- 找回密码对话框 -->
    <RecoverPasswordDialog
      :visible="recoverPasswordDialogVisible"
      :email="email"
      :phone="phone"
      @update:visible="recoverPasswordDialogVisible = $event"
    />
  </el-dialog>
</template>

<script>
import axios from 'axios'; // Import axios for API requests
import RecoverPasswordDialog from './RecoverPasswordDialog.vue';

export default {
  components: {
    RecoverPasswordDialog,
  },
  props: {
    value: Boolean,
    userAvatar: String,
    nickname: String,
    signature: String,
    email: String,
    phone: String,
  },
  data() {
    return {
      visible: this.value,
      avatarUrl: this.userAvatar,
      localNickname: this.nickname,
      localSignature: this.signature,
      recoverPasswordDialogVisible: false,
    };
  },
  watch: {
    value(val) {
      this.visible = val;
    },
    visible(val) {
      this.$emit('input', val);
    },
  },
  methods: {
    beforeAvatarUpload(file) {
      const isImage = file.type.startsWith('image/');
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isImage) {
        this.$message.error('上传的文件必须是图片!');
      }
      if (!isLt2M) {
        this.$message.error('上传的图片大小不能超过 2MB!');
      }
      return isImage && isLt2M;
    },
    handleAvatarChange(file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        this.avatarUrl = event.target.result;
      };
      reader.readAsDataURL(file.raw);
    },
    async saveProfile() {
      try {
        const response = await axios.post('/api/updateProfile', {
          avatar: this.avatarUrl,
          nickname: this.localNickname,
          signature: this.localSignature,
          email: this.email,
          phone: this.phone,
        });
        if (response.data.success) {
          this.$message.success('个人资料已保存');
          this.visible = false;
          this.$emit('updateProfile', response.data.profile); // Update the profile with the response data
        } else {
          this.$message.error('保存失败: ' + response.data.message);
        }
      } catch (error) {
        this.$message.error('保存个人资料时发生错误');
        console.error('API request failed:', error);
      }
    },
    async sendEmailVerification() {
      if (!this.email) {
        this.$message.error('请绑定邮箱以进行验证');
        return;
      }
      try {
        const response = await axios.post('/api/sendEmailVerification', { email: this.email });
        if (response.data.success) {
          this.$message.success('验证邮件已发送至 ' + this.email);
        } else {
          this.$message.error('发送验证邮件失败: ' + response.data.message);
        }
      } catch (error) {
        this.$message.error('发送验证邮件时发生错误');
        console.error('API request failed:', error);
      }
    },
    async sendSmsVerification() {
      if (!this.phone) {
        this.$message.error('请绑定手机号以进行验证');
        return;
      }
      try {
        const response = await axios.post('/api/sendSmsVerification', { phone: this.phone });
        if (response.data.success) {
          this.$message.success('验证码已发送至 ' + this.phone);
        } else {
          this.$message.error('发送验证码失败: ' + response.data.message);
        }
      } catch (error) {
        this.$message.error('发送验证码时发生错误');
        console.error('API request failed:', error);
      }
    },
    openRecoverPasswordDialog() {
      this.recoverPasswordDialogVisible = true;
    },
  },
};
</script>

<style scoped>
.profile-dialog {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar-uploader {
  display: inline-block;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid #ccc;
}

.avatar {
  width: 100%;
  height: 100%;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  text-align: center;
  line-height: 100px;
}

.form-item-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.form-item-content span {
  flex: 1;
}

.form-item-content el-button {
  margin-left: 10px;
}
</style>
