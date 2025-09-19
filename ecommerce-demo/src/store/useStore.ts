import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, UserInteraction, RecommendationScore } from '../types/product';

interface StoreState {
  products: Product[];
  interactions: UserInteraction[];
  recommendationScores: RecommendationScore[];
  selectedProduct: Product | null;
  isLoading: boolean;
  
  // Actions
  setProducts: (products: Product[]) => void;
  addInteraction: (interaction: UserInteraction) => void;
  setRecommendationScores: (scores: RecommendationScore[]) => void;
  setSelectedProduct: (product: Product | null) => void;
  setLoading: (loading: boolean) => void;
  getOrderedProducts: () => Product[];
}

// Criação do store com persistência, implementação para Demo
export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      products: [],
      interactions: [],
      recommendationScores: [],
      selectedProduct: null,
      isLoading: false,

      setProducts: (products) => set({ products }),
      
      addInteraction: (interaction) => 
        set((state) => ({ 
          interactions: [...state.interactions, interaction] 
        })),
      
      setRecommendationScores: (scores) => 
        set({ recommendationScores: scores }),
      
      setSelectedProduct: (product) => 
        set({ selectedProduct: product }),
      
      setLoading: (loading) => 
        set({ isLoading: loading }),
      
      getOrderedProducts: () => {
        const { products, recommendationScores } = get();
        
        if (recommendationScores.length === 0) {
          return products;
        }
        
        // Sort products by recommendation scores
        return [...products].sort((a, b) => {
          const scoreA = recommendationScores.find(s => s.productId === a.id)?.score || 0;
          const scoreB = recommendationScores.find(s => s.productId === b.id)?.score || 0;
          return scoreB - scoreA;
        });
      },
    }),
    {
      name: 'ecommerce-store',
      partialize: (state) => ({ 
        interactions: state.interactions,
        recommendationScores: state.recommendationScores 
      }),
    }
  )
);