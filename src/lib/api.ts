import axios from 'axios';
import { useAuth } from '@/hooks/use-store';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const token = useAuth.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  login: (data: any) => api.post('/auth/login', data),
  register: (data: any) => api.post('/auth/register', data),
};

export const mealsApi = {
  getAll: (params?: any) => api.get('/meals', { params }),
  getOne: (id: string) => api.get(`/meals/${id}`),
  // Provider Specific
  add: (data: any) => api.post('/provider/meals', data),
  update: (id: string, data: any) => api.put(`/provider/meals/${id}`, data),
  remove: (id: string) => api.delete(`/provider/meals/${id}`),
};

export const ordersApi = {
  create: (data: any) => api.post('/orders', data),
  getUserOrders: () => api.get('/orders'),
  getOne: (id: string) => api.get(`/orders/${id}`),
};

export const providersApi = {
  getAll: (params?: any) => api.get('/providers', { params }),
  getOne: (id: string) => api.get(`/providers/${id}`),
  // Admin Management
  getAdminAll: () => api.get('/admin/providers'),
};

export const adminApi = {
  getStats: () => api.get('/admin/stats'),
  getUsers: () => api.get('/admin/users'),
  updateUserStatus: (id: string, isActive: boolean) => api.patch(`/admin/users/${id}`, { isActive }),
  
  // Categories
  getCategories: () => api.get('/admin/categories'),
  createCategory: (data: any) => api.post('/admin/categories', data),
  updateCategory: (id: string, data: any) => api.patch(`/admin/categories/${id}`, data),
  deleteCategory: (id: string) => api.delete(`/admin/categories/${id}`),
  
  // Service Management
  getMeals: () => api.get('/admin/meals'),
  getProviders: () => api.get('/admin/providers'),
};

export default api;
