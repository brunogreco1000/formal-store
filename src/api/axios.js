import axios from 'axios';

export default axios.create({
  baseURL: 'http://localhost:5000', // o la URL de tu backend
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
});
