import { useQuery } from '@tanstack/react-query';
import { fetchProduct } from '../services/api';
import { Product } from '../types/product';

export const useGetProduct = (id: number) => {
  return useQuery<Product, Error>({
    queryKey: ['product', id],
    queryFn: () => fetchProduct(id),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    enabled: !!id, // Only run query if id exists
  });
};
