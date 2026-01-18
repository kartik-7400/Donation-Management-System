import axios from 'axios';

// Use the same hostname as the frontend, but port 3000 for the API
const API_HOST = window.location.hostname;
const API_PORT = 3000;
const API_BASE_URL = `http://${API_HOST}:${API_PORT}/api`;

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Auth API
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    logout: () => api.post('/auth/logout'),
    getMe: () => api.get('/auth/me')
};

// Donation API
export const donationAPI = {
    getKey: () => api.get('/donate/key'),
    initiate: (data) => api.post('/donate/initiate', data),
    verify: (data) => api.post('/donate/verify', data),
    failed: (data) => api.post('/donate/failed', data),
    getHistory: () => api.get('/user/history')
};

// Campaign API (public)
export const campaignAPI = {
    getAll: () => api.get('/campaigns'),
    getById: (id) => api.get(`/campaigns/${id}`),
    // Admin routes
    getAllAdmin: () => api.get('/campaigns/admin/all'),
    create: (data) => api.post('/campaigns', data),
    update: (id, data) => api.put(`/campaigns/${id}`, data),
    delete: (id) => api.delete(`/campaigns/${id}`)
};

// Stats API (public)
export const statsAPI = {
    getPublic: () => api.get('/stats/public')
};

// Admin API
export const adminAPI = {
    getDashboard: () => api.get('/admin/dashboard'),
    getUsers: () => api.get('/admin/users'),
    getDonations: () => api.get('/admin/donations')
};

export default api;
