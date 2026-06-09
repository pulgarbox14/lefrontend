// Types partagés — reflètent le contrat de l'API backend (NestJS sur localhost:3000).

export type Role = "admin" | "user";

export interface User {
  id?: number | string;
  email: string;
  name?: string;
  role?: Role;
}

export interface AuthResponse {
  // On accepte plusieurs conventions de nommage côté backend.
  access_token?: string;
  accessToken?: string;
  token?: string;
  jwt?: string;
  user?: User;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  // Champs e-commerce (optionnels tant que le backend ne les renvoie pas).
  category?: string;
  description?: string;
  imageUrl?: string;
}

export interface Order {
  id: number;
  customerName: string;
  quantity: number;
  totalPrice: number;
  status?: string;
}

export interface InventoryItem {
  id: number;
  productName: string;
  quantity: number;
  price: number;
}

export interface Payment {
  id: number;
  amount: number;
  paymentMethod: string;
  status?: string;
}
