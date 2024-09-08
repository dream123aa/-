import { defineStore } from 'pinia';

interface Message {
  id: number;
  text: string;
  sender: string;
  time: string;
  type: string;
  contactId?: number;
  groupId?: number;
  content?: string;
  recalledBy?: string;
}

export const useChatStore = defineStore('chat', {
  state: () => ({
    user: null as string | null,
    messages: [] as Message[],
    selectedContact: null as any,
    activeContact: null as string | null,
    currentGroup: null as number | null,
    groups: [
      { id: 1, name: 'Group 1' },
      { id: 2, name: 'Group 2' },
    ],
  }),
  actions: {
    setUser(user: string) {
      this.user = user;
    },
    addMessage(message: Message) {
      this.messages.push(message);
    },
    fetchMessages(contactId: number) {
      this.messages = [
        { id: 1, text: 'Hello Alice', sender: 'A', time: '10:00 AM', type: 'text', contactId: 1 },
        { id: 2, text: 'Hi Bob', sender: 'B', time: '10:05 AM', type: 'text', contactId: 2 },
        { id: 3, text: 'Hello Charlie', sender: 'C', time: '10:10 AM', type: 'text', contactId: 3 },
      ].filter(message => message.contactId === contactId);
    },
    fetchGroupMessages(groupId: number) {
      this.messages = [
        { id: 4, text: 'Hello Group 1', sender: 'D', time: '10:15 AM', type: 'text', groupId: 1 },
        { id: 5, text: 'Hi Group 2', sender: 'E', time: '10:20 AM', type: 'text', groupId: 2 },
      ].filter(message => message.groupId === groupId);
    },
    sendMessage(message: any) {
      // 通过 WebSocket 发送消息的逻辑
    },
  },
});