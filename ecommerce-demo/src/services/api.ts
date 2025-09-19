import { Product } from '../types/product';

const API_BASE = 'https://fakestoreapi.com';

export const fetchProducts = async (): Promise<Product[]> => {
  const response = await fetch(`${API_BASE}/products?limit=12`);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
};

export const fetchProduct = async (id: number): Promise<Product> => {
  const response = await fetch(`${API_BASE}/products/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch product');
  }
  return response.json();
};