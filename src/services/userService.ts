// import axios from 'axios';

// interface Contact {
//   id: string;
//   name: string;
// }

// interface Profile {
//   avatar: string;
//   nickname: string;
//   signature: string;
// }

// export default {
//   async getContacts() {
//     const response = await axios.get('/api/contacts');
//     return response.data;
//   },
//   async addContact(contact: Contact) {
//     const response = await axios.post('/api/contacts', contact);
//     return response.data;
//   },
//   async updateProfile(profile: Profile) {
//     const response = await axios.put('/api/profile', profile);
//     return response.data;
//   }
// };