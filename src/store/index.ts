import { defineStore } from 'pinia';

export const useChatStore = defineStore('chat', {
  state: () => ({
    user: null as string | null,
    messages: [] as string[],
  }),
  actions: {
    setUser(user: string) {
      this.user = user;
    },
    addMessage(message: string) {
      this.messages.push(message);
    },
  },
});