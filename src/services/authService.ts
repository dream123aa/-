import axios from 'axios';

interface Credentials {
  email: string;
  password: string;
}

interface UserData {
  email: string;
  password: string;
}

interface ResetPasswordData {
  email: string;
}

export default {
  async login(credentials: Credentials) {
    const response = await axios.post('/api/login', credentials);
    return response.data;
  },
  async register(data: UserData) {
    const response = await axios.post('/api/register', data);
    return response.data;
  },
  async resetPassword(data: ResetPasswordData) {
    const response = await axios.post('/api/reset-password', data);
    return response.data;
  }
};