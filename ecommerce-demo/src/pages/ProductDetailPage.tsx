import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { ProductDetail } from '../components/ProductDetail';
import { CommentSection } from '../components/CommentSection';
import { useGetProduct } from '../hooks/useGetProduct';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { setSelectedProduct } = useStore();
  
  const productId = id ? parseInt(id) : 0;
  const { data: product, isLoading, error } = useGetProduct(productId);

  const handleBackToGrid = () => {
    setSelectedProduct(null);
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Product not found</p>
        <button 
          onClick={handleBackToGrid}
          className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg"
        >
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <>
      <ProductDetail 
        product={product} 
        onBack={handleBackToGrid} 
      />
      <CommentSection productId={productId} />
    </>
  );
};

export default ProductDetailPage;
