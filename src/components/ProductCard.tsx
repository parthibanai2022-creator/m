import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    image_url: string | null;
    price_per_litre: number;
    offer_price_per_litre: number | null;
    stock_quantity: number;
  };
  onUpdate?: () => void;
  compact?: boolean;
}

export default function ProductCard({ product, onUpdate, compact = false }: ProductCardProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isAddingToCart] = useState(false);
  const [isAddingToWishlist] = useState(false);

  if (compact) {
    // Extract volume from product name (e.g., "Sesame Oil 3L" -> "3L", "Oil 2L" -> "2L")
    const volumeMatch = product.name.match(/(\d+\.?\d*[Ll])/);
    const volumeText = volumeMatch ? volumeMatch[1].toUpperCase() : product.name.slice(-2).toUpperCase();
    
    return (
      <div
        className="w-[1.5cm] h-[1.5cm] flex items-center justify-center bg-yellow-400 rounded-lg cursor-pointer transition-all duration-300"
        onClick={() => navigate(`/product/${product.id}`)}
      >
        <span className="text-sm font-bold text-gray-800">{volumeText}</span>
      </div>
    );
  }

  return (
    <Card
      className="group overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-[var(--shadow-hover)]"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={product.image_url || '/placeholder.svg'}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg line-clamp-2">{product.name}</h3>
      </CardContent>
    </Card>
  );
}