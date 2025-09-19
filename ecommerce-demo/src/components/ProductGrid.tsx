import { Product } from '../types/product';
import { ProductCard } from './ProductCard';
import { useStore } from '../store/useStore';

interface ProductGridProps {
  onProductClick: (product: Product) => void;
}

export const ProductGrid = ({ onProductClick }: ProductGridProps) => {
  const { getOrderedProducts, isLoading } = useStore();
  
  const orderedProducts = getOrderedProducts();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="product-card animate-pulse">
            <div className="aspect-square bg-muted rounded-t-lg"></div>
            <div className="p-4 space-y-3">
              <div className="h-4 bg-muted rounded w-1/3"></div>
              <div className="h-5 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
              <div className="flex justify-between items-center">
                <div className="h-6 bg-muted rounded w-1/4"></div>
                <div className="h-8 bg-muted rounded w-1/3"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (orderedProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
          <span className="text-4xl">📦</span>
        </div>
        <h3 className="text-lg font-semibold text-card-foreground mb-2">
          No products found
        </h3>
        <p className="text-muted-foreground">
          Please try again later or check your connection
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {orderedProducts.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          onClick={onProductClick}
          index={index}
        />
      ))}
    </div>
  );
};