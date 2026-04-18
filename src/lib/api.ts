import axios from 'axios';
import { useAuth } from '@/hooks/use-store';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  // Try Zustand store first, then fall back to localStorage directly
  // This handles the case where Zustand's persist middleware hasn't hydrated yet
  let token = useAuth.getState().token;

  if (!token) {
    try {
      const stored = localStorage.getItem('foodhub-auth');
      if (stored) {
        const parsed = JSON.parse(stored);
        token = parsed?.state?.token || null;
      }
    } catch (e) {
      // localStorage not available (SSR)
    }
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("[API ERROR]", error.response?.status, error.response?.data?.message || error.message);

    // Automatically wipe session on 401 Unauthorized
    if (error.response?.status === 401) {
      console.warn("Session invalid/expired. Forcing logout.");
      useAuth.getState().logout();
      localStorage.removeItem('foodhub-auth');
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export const authApi = {
  login: (data: any) => api.post('/auth/login', data),
  register: (data: any) => api.post('/auth/register', data),
  updateProfile: (data: any) => api.patch('/auth/update-profile', data),
};

export const mealsApi = {
  getAll: (params?: any) => api.get('/meals', { params }),
  getOne: (id: string) => api.get(`/meals/${id}`),
  // Provider Specific
  add: (data: any) => api.post('/provider/meals', data),
  update: (id: string, data: any) => api.put(`/provider/meals/${id}`, data),
  remove: (id: string) => api.delete(`/provider/meals/${id}`),
};

export const categoriesApi = {
  getAll: () => api.get('/categories'),
};

export const ordersApi = {
  create: (data: any) => api.post('/orders', data),
  getUserOrders: () => api.get('/orders'),
  getOne: (id: string) => api.get(`/orders/${id}`),
  cancel: (id: string) => api.patch(`/orders/${id}/cancel`),
};

export const providersApi = {
  getAll: (params?: any) => api.get('/providers', { params }),
  getOne: (id: string) => api.get(`/providers/${id}`),
  // Provider Profiles for Provider Context
  getMyProfiles: () => api.get(`/provider/profiles?_t=${Date.now()}`),
  createProfile: (data: any) => api.post('/provider/profiles', data),
  // Provider Orders
  getOrders: () => api.get(`/provider/orders?_t=${Date.now()}`),
  updateOrderStatus: (id: string, status: string) => api.patch(`/provider/orders/${id}`, { status }),
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

export const reviewsApi = {
  getAll: () => api.get('/reviews'),
  create: (mealId: string, data: { rating: number; comment: string }) => api.post(`/meals/${mealId}/reviews`, data),
};

export const paymentApi = {
  createPaymentIntent: (amount: number) => api.post('/payment/create-payment-intent', { amount }),
};

export default api;
