import axios from 'axios';

const API_BASE = 'http://localhost:8000/';
const DEFAULT_TIMEOUT = 15000;

const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: DEFAULT_TIMEOUT,
});

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

  createTagsBatch: async (tags) => {
    const response = await apiClient.post('/api/tags/batch', { tags });
    return response.data;
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

