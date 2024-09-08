<template>
  <el-dialog title="找回密码" :visible.sync="visible" width="400px">
    <div class="recover-password-dialog">
      <el-form>
        <el-form-item label="绑定邮箱">
          <el-input v-model="localEmail" placeholder="请输入绑定的邮箱" />
        </el-form-item>
        <el-form-item label="绑定手机号">
          <el-input v-model="localPhone" placeholder="请输入绑定的手机号" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="sendRecoveryEmail">发送找回密码邮件</el-button>
          <el-button type="primary" @click="sendRecoverySms">发送找回密码短信</el-button>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import axios from 'axios'; // Import axios for API requests

export default {
  props: {
    visible: Boolean,
    email: String,
    phone: String,
  },
  data() {
    return {
      localEmail: this.email || '',
      localPhone: this.phone || '',
    };
  },
  watch: {
    visible(val) {
      this.$emit('update:visible', val);
    },
  },
  methods: {
    async sendRecoveryEmail() {
      if (!this.localEmail) {
        this.$message.error('请输入绑定的邮箱');
        return;
      }
      try {
        const response = await axios.post('/api/sendRecoveryEmail', { email: this.localEmail });
        if (response.data.success) {
          this.$message.success('找回密码邮件已发送至 ' + this.localEmail);
        } else {
          this.$message.error('发送找回密码邮件失败: ' + response.data.message);
        }
      } catch (error) {
        this.$message.error('发送找回密码邮件时发生错误');
        console.error('API request failed:', error);
      }
    },
    async sendRecoverySms() {
      if (!this.localPhone) {
        this.$message.error('请输入绑定的手机号');
        return;
      }
      try {
        const response = await axios.post('/api/sendRecoverySms', { phone: this.localPhone });
        if (response.data.success) {
          this.$message.success('找回密码短信已发送至 ' + this.localPhone);
        } else {
          this.$message.error('发送找回密码短信失败: ' + response.data.message);
        }
      } catch (error) {
        this.$message.error('发送找回密码短信时发生错误');
        console.error('API request failed:', error);
      }
    },
  },
};
</script>

<style scoped>
.recover-password-dialog {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
