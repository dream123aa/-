<!-- <template>
    <div>
      <h1>Register</h1>
      <form @submit.prevent="register">
        <input v-model="email" type="email" placeholder="Email" required />
        <input v-model="password" type="password" placeholder="Password" required />
        <button type="submit">Register</button>
      </form>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { useStore } from 'vuex';
  import { useRouter } from 'vue-router';
  
  export default defineComponent({
    name: 'RegisterView',
    setup() {
      const store = useStore();
      const router = useRouter();
      const email = ref('');
      const password = ref('');
  
      const register = async () => {
        try {
          await store.dispatch('register', { email: email.value, password: password.value });
          router.push('/');
        } catch (error) {
          console.error(error);
        }
      };
  
      return { email, password, register };
    }
  });
  </script>
  
  <style scoped>
  /* 注册组件样式 */
  </style> -->