import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Change to LAN IP if testing on device
  // You can add headers, interceptors, etc. here
});

export default api;
