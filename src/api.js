import axios from 'axios';

const API_BASE = 'https://personal-blog-backend-w7kn.vercel.app/';
const DEFAULT_TIMEOUT = 30000; // Increased from 15s to 30s

const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: DEFAULT_TIMEOUT,
});

// Add retry logic for failed requests
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    
    // Retry logic for timeout and network errors
    if (
      (error.code === 'ECONNABORTED' || error.message.includes('timeout')) &&
      config &&
      !config._retry &&
      config._retryCount < 2
    ) {
      config._retry = true;
      config._retryCount = (config._retryCount || 0) + 1;
      
      console.log(`Retrying request (attempt ${config._retryCount + 1})...`);
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return apiClient(config);
    }
    
    return Promise.reject(error);
  }
);

export const api = {
  // Health check
  health: async () => {
    const response = await apiClient.get('/api/health');
    return response.data;
  },

  // Tags
  getTags: async () => {
    const response = await apiClient.get('/api/tags');
    return response.data;
  },

  createTag: async (name) => {
    const response = await apiClient.post('/api/tags', { name });
    return response.data;
  },

  createTagsBatch: async (tagNames) => {
    const results = [];
    let created = 0;
    let requested = tagNames.length;

    for (const name of tagNames) {
      try {
        const response = await apiClient.post('/api/tags', { name });
        results.push(response.data);
        created++;
      } catch (error) {
        // If tag already exists, that's okay - we'll count it as created
        if (error.response?.status === 400 || error.response?.status === 500) {
          // Tag might already exist, try to fetch it
          try {
            const existingTags = await apiClient.get('/api/tags');
            const existingTag = existingTags.data.find(tag => tag.Name === name);
            if (existingTag) {
              results.push(existingTag);
              created++;
            }
          } catch (fetchError) {
            console.warn(`Could not verify tag "${name}":`, fetchError.message);
          }
        }
      }
    }

    return {
      success: true,
      created,
      requested,
      results
    };
  },

  // Bookmarks
  getBookmarks: async (params = {}) => {
    const response = await apiClient.get('/api/bookmarks', { params });
    return response.data;
  },

  createBookmark: async (bookmark) => {
    const response = await apiClient.post('/api/bookmarks', bookmark);
    return response.data;
  },
};

export { API_BASE };

