import { useEffect } from 'react';
import { Product } from '../types/product';
import { useStore } from '../store/useStore';
import { Button } from './ui/button';
import { ArrowLeft, Star, ShoppingCart } from 'lucide-react';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
}

export const ProductDetail = ({ product, onBack }: ProductDetailProps) => {
  const { addInteraction } = useStore();

  const handleViewStart = () => {
    addInteraction({
      productId: product.id,
      timestamp: Date.now(),
      type: 'view'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  // Track view when component mounts
  useEffect(() => {
    handleViewStart();
    
    const startTime = Date.now();
    
    return () => {
      // Track time spent when component unmounts
      const timeSpent = (Date.now() - startTime) / 1000;
      addInteraction({
        productId: product.id,
        timestamp: Date.now(),
        type: 'time_spent',
        value: timeSpent
      });
    };
  }, [product.id]);

  return (
    <div className="animate-fade-in">
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-6 hover:bg-accent"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Products
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="aspect-square bg-card rounded-2xl p-8 flex items-center justify-center border border-card-border">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div className="space-y-4">
            <span className="inline-block px-3 py-1 text-sm font-medium bg-primary/10 text-primary rounded-full">
              {product.category}
            </span>
            
            <h1 className="text-3xl font-bold text-card-foreground leading-tight">
              {product.title}
            </h1>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating.rate)
                          ? 'text-yellow-500 fill-current'
                          : 'text-muted-foreground'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-medium">{product.rating.rate}</span>
              </div>
              <span className="text-muted-foreground">
                ({product.rating.count} reviews)
              </span>
            </div>
          </div>

          <div className="text-4xl font-bold text-primary">
            {formatPrice(product.price)}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Description</h3>
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="space-y-4">
            <Button 
              className="w-full h-12 text-lg font-medium gradient-primary hover:shadow-glow transition-all duration-300"
              size="lg"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Add to Cart
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full h-12 text-lg"
              size="lg"
            >
              Add to Wishlist
            </Button>
          </div>

          <div className="pt-6 border-t border-border">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Category:</span>
                <p className="font-medium capitalize">{product.category}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Rating:</span>
                <p className="font-medium">{product.rating.rate}/5</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
