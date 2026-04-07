export type Role = 'CUSTOMER' | 'PROVIDER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  isActive: boolean;
  avatar?: string;
}

export interface Category {
  id: string;
  name: string;
  image: string;
}

export interface Meal {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  categoryId: string;
  category?: Category;
  providerId: string;
  provider?: Provider;
  rating?: number;
}

export interface Provider {
  id: string;
  userId: string;
  name: string;
  description: string;
  image: string;
  rating: number;
  meals?: Meal[];
}

export interface OrderItem {
  id: string;
  mealId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  userId: string;
  status: 'PENDING' | 'PREPARING' | 'DELIVERING' | 'COMPLETED' | 'CANCELLED';
  total: number;
  items: OrderItem[];
  createdAt: string;
  address: string;
}
