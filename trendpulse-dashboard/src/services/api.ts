import axios from 'axios';

const API_URL = "http://127.0.0.1:3000/enrich"; // 👈 Local SAM endpoint

export const fetchTrends = async (query: string) => {
  const { data } = await axios.get(API_URL, {
    params: { query },
    // Remove x-api-key for local testing
  });
  
  // Parse the response body
  const parsedData = JSON.parse(data.body);
  
  // Add some mock sentiment values for testing if you're getting zeros
  // This is just for testing and can be removed once the real API is providing sentiment values
  const addMockSentiment = (items: any[]) => {
    return items.map((item: any) => {
      // Only add mock data if sentiment is missing or zero
      if (!item.sentiment || 
          (typeof item.sentiment === 'number' && item.sentiment === 0) ||
          (typeof item.sentiment === 'object' && (!item.sentiment.score || item.sentiment.score === 0))) {
        
        // Generate a random sentiment between -1 and 1
        const mockSentiment = (Math.random() * 2 - 1).toFixed(2);
        
        return {
          ...item,
          sentiment: parseFloat(mockSentiment)
        };
      }
      return item;
    });
  };
  
  // Add mock sentiment data to test the UI
  return {
    reddit: addMockSentiment(parsedData.reddit || []),
    hackernews: addMockSentiment(parsedData.hackernews || []),
    news: addMockSentiment(parsedData.news || [])
  };
};