export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export interface UserInteraction {
  productId: number;
  timestamp: number;
  type: 'click' | 'view' | 'time_spent';
  value?: number; // for time_spent in seconds
}

export interface RecommendationScore {
  productId: number;
  score: number;
}

export interface Comment {
  id: string;
  text: string;
  author: string;
  timestamp: Date;
  isFlagged?: boolean;
}