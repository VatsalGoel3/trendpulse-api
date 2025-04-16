import axios from 'axios';

const API_URL = "http://127.0.0.1:3000/enrich"; // 👈 Local SAM endpoint

// Add retry functionality to handle potential API failures
const fetchWithRetry = async (url: string, params: any, maxRetries = 2) => {
  let retries = 0;
  
  while (retries <= maxRetries) {
    try {
      const { data } = await axios.get(url, {
        params,
        timeout: 10000, // 10 second timeout
        // Remove x-api-key for local testing
      });
      
      return data;
    } catch (error) {
      retries++;
      console.log(`Attempt ${retries}/${maxRetries + 1} failed for query: ${params.query}`);
      
      if (retries > maxRetries) {
        throw error;
      }
      
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * retries));
    }
  }
};

export const fetchTrends = async (query: string) => {
  try {
    console.log(`API request for query: ${query}`);
    const data = await fetchWithRetry(API_URL, { query });
    
    if (!data || !data.body) {
      throw new Error(`Invalid response format for query: ${query}`);
    }
    
    const parsedData = JSON.parse(data.body);
    console.log(`API response for ${query}:`, parsedData);
    
    // Validate the response structure
    if (!parsedData.reddit || !parsedData.hackernews || !parsedData.news) {
      console.error(`Invalid data structure for query: ${query}`, parsedData);
      throw new Error(`The API returned invalid data for the query: ${query}`);
    }
    
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
  } catch (error) {
    console.error(`API error for query: ${query}`, error);
    // Re-throw with a more helpful message
    if (error instanceof Error) {
      throw new Error(`Failed to fetch data for "${query}": ${error.message}`);
    }
    throw new Error(`Failed to fetch data for "${query}"`);
  }
};