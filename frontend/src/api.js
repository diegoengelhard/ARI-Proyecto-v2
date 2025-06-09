import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api/conversion',   // prefijo común
  headers: { 'Content-Type': 'application/json' }
});

export const convert = (endpoint, payload) =>
  api.post(endpoint, payload).then(res => res.data);
