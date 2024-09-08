<template>
  <el-dialog title="账号安全" :visible.sync="visible">
    <el-form>
      <el-form-item label="邮箱">
        <el-input v-model="localEmail" />
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="localPhone" />
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="saveAccountSecurity">保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import axios from 'axios'; // 导入 axios 用于 API 调用

export default {
  props: {
    value: Boolean,
    email: String,
    phone: String,
  },
  data() {
    return {
      visible: this.value, // 控制弹窗显示
      localEmail: this.email, // 本地存储邮箱，供表单使用
      localPhone: this.phone, // 本地存储手机号，供表单使用
    };
  },
  watch: {
    // 监听父组件传递的 'value' 属性，控制弹窗的显示/隐藏
    value(val) {
      this.visible = val;
    },
    // 监听本地 'visible' 变化，通知父组件更新 'value'
    visible(val) {
      this.$emit('input', val);
    },
  },
  methods: {
    // 保存账号安全设置
    async saveAccountSecurity() {
      try {
        // 调用后端 API 更新用户的邮箱和手机号
        await axios.post('/api/account/security', {
          email: this.localEmail,
          phone: this.localPhone,
        });
        this.$emit('updateAccountSecurity', {
          email: this.localEmail,
          phone: this.localPhone,
        });
        this.visible = false; // 关闭弹窗
      } catch (error) {
        console.error('保存账号安全信息失败:', error);
        // 可根据需求添加错误处理逻辑
      }
    },
  },
};
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}
</style>