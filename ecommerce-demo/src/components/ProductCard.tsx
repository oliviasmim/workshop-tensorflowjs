import { Product } from '../types/product';
import { useStore } from '../store/useStore';
import { recommendationEngine } from '../services/recommendations';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
  index: number;
}

export const ProductCard = ({ product, onClick, index }: ProductCardProps) => {
  const { addInteraction, interactions, products, setRecommendationScores } = useStore();

  const handleClick = async () => {
    // Track interaction
    addInteraction({
      productId: product.id,
      timestamp: Date.now(),
      type: 'click'
    });

    // Generate new recommendations
    const scores = recommendationEngine.generateRecommendations(products, [
      ...interactions,
      { productId: product.id, timestamp: Date.now(), type: 'click' }
    ]);
    setRecommendationScores(scores);

    onClick(product);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const truncateTitle = (title: string, maxLength: number = 50) => {
    return title.length > maxLength ? title.substring(0, maxLength) + '...' : title;
  };

  return (
    <div 
      className="product-card animate-fade-in"
      style={{ animationDelay: `${index * 0.1}s` }}
      onClick={handleClick}
    >
      <div className="aspect-square overflow-hidden bg-muted rounded-t-lg">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-contain p-4 transition-transform duration-300 hover:scale-110"
          loading="lazy"
        />
      </div>
      
      <div className="p-4 space-y-3">
        <div className="space-y-2">
          <span className="inline-block px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
            {product.category}
          </span>
          
          <h3 className="font-semibold text-card-foreground leading-tight">
            {truncateTitle(product.title)}
          </h3>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <span className="text-yellow-500">★</span>
            <span>{product.rating.rate}</span>
          </div>
          <span>•</span>
          <span>{product.rating.count} reviews</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">
            {formatPrice(product.price)}
          </span>
          
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium transition-smooth hover:bg-primary/90 hover:shadow-md">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};