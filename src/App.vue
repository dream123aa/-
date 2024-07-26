<template>
  <div id="app">
    <LoginView />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import LoginView from './components/LoginView.vue';

export default defineComponent({
  name: 'App',
  components: {
    LoginView,
  },
});
</script>