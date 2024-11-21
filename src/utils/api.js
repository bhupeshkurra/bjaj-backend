import axios from 'axios';

const api = axios.create({
  baseURL: 'https://bhupesh-bfhl-api.vercel.app/bfhl', // Replace with your API URL
});

export const postJsonData = async (data) => {
  try {
    const response = await api.post('/endpoint', { data });
    return response.data;
  } catch (error) {
    console.error('Error calling API:', error);
    throw error;
  }
};
