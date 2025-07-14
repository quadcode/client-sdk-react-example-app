import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: window.location.origin,
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export { axiosInstance };
