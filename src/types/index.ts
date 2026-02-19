export interface Meal {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: MealCategory;
  calories: number;
  preparationTime: number; // minutes
  ingredients: string[];
  allergens: string[];
  rating: number;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
}

export type MealCategory =
  | 'pasta'
  | 'pizza'
  | 'salad'
  | 'soup'
  | 'meat'
  | 'fish'
  | 'dessert'
  | 'breakfast'
  | 'smoothie';

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  mealsPerWeek: number;
  pricePerWeek: number;
  pricePerMonth: number;
  features: string[];
  isPopular: boolean;
  color: string;
}

export interface CartItem {
  meal: Meal;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  deliveryDate: string;
  deliveryAddress: string;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'delivering'
  | 'delivered'
  | 'cancelled';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  address: string;
  subscription?: UserSubscription;
}

export interface UserSubscription {
  planId: string;
  startDate: string;
  nextDelivery: string;
  isActive: boolean;
}

export interface DeliverySlot {
  id: string;
  date: string;
  timeRange: string;
  available: boolean;
}
