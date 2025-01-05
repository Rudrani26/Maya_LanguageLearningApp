import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://192.168.1.2:8000', // Replace with your server's IP and port
  timeout: 5000, // Optional: Set a timeout
  headers: { 'Content-Type': 'application/json' },
});

export default instance;
