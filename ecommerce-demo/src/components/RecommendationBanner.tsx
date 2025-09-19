import { useStore } from '../store/useStore';
import { Brain, TrendingUp } from 'lucide-react';

export const RecommendationBanner = () => {
  const { interactions } = useStore();
  
  const hasInteractions = interactions.length > 0;

  if (!hasInteractions) {
    return (
      <div className="gradient-hero rounded-2xl p-6 mb-8">
        <div className="flex items-center gap-3 mb-3">
          <Brain className="w-6 h-6 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">
            Welcome to SmartShop
          </h2>
        </div>
        <p className="text-muted-foreground">
          Click on products to help our AI learn your preferences and provide personalized recommendations.
        </p>
      </div>
    );
  }

  return (
    <div className="gradient-hero rounded-2xl p-6 mb-8">
      <div className="flex items-center gap-3 mb-3">
        <TrendingUp className="w-6 h-6 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">
          Personalized for You
        </h2>
      </div>
      <p className="text-muted-foreground">
        Based on your {interactions.length} interaction{interactions.length !== 1 ? 's' : ''}, 
        we've reordered products to match your preferences.
      </p>
    </div>
  );
};