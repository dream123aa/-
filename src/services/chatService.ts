import axios from 'axios';

interface Message {
  content: string;
  senderId: string;
  receiverId: string;
}

export default {
  async getMessages() {
    const response = await axios.get('/api/messages');
    return response.data;
  },
  async sendMessage(message: Message) {
    const response = await axios.post('/api/messages', message);
    return response.data;
  },
  async deleteMessage(messageId: string) {
    const response = await axios.delete(`/api/messages/${messageId}`);
    return response.data;
  }
};