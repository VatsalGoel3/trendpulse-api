import axios from 'axios';

const API_URL = "http://127.0.0.1:3000/enrich"; // 👈 Local SAM endpoint

export const fetchTrends = async (query: string) => {
  const { data } = await axios.get(API_URL, {
    params: { query },
    // Remove x-api-key for local testing
  });
  return JSON.parse(data.body);
};