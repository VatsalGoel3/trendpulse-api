import axios from 'axios';

const API_URL = "https://YOUR_API_ENDPOINT/Prod/enrich";
const API_KEY = "YOUR_API_KEY";

export const fetchTrends = async (query: string) => {
  const { data } = await axios.get(API_URL, {
    params: { query },
    headers: { "x-api-key": API_KEY },
  });
  return JSON.parse(data.body);
};