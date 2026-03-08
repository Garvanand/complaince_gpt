import axios from 'axios';
import toast from 'react-hot-toast';

const apiClient = axios.create({
  baseURL: '/api',
  timeout: 120000,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      toast.error('Request timed out. Please try again.');
    } else if (!error.response) {
      toast.error('Network error. Check your connection.');
    } else {
      const status = error.response.status;
      const message = error.response.data?.error || error.message;
      if (status === 400) {
        toast.error(`Bad request: ${message}`);
      } else if (status === 404) {
        toast.error('Resource not found.');
      } else if (status >= 500) {
        toast.error('Server error. Please try again later.');
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
