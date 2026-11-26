'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, Star, Plus, Check, Loader2, Eye, RefreshCw } from 'lucide-react';
import { Product } from '@/types/api.types';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCartAsync } = useCart();
  const { isInWishlist, toggleWishlist, isAdding, isRemoving } = useWishlist();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const [isAddingThis, setIsAddingThis] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const productId = product._id || product.id || '';
  const inWishlist = isInWishlist(productId);
  const isWishlistLoading = isAdding || isRemoving;

  const hasDiscount =
    Boolean(product.priceAfterDiscount) && product.priceAfterDiscount! < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.priceAfterDiscount!) / product.price) * 100)
    : 0;

  const rating = product.ratingsAverage ?? 4.5;
  const fullStars = Math.floor(rating);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Please sign in to add items to your cart');
      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    if (isAddingThis) return;

    try {
      setIsAddingThis(true);
      await addToCartAsync(productId);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1500);
    } finally {
      setIsAddingThis(false);
    }
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Please sign in to save items to your wishlist');
      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    toggleWishlist(productId);
  };

  return (
    <div
      id="product-card"
      className="group bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all duration-300"
    >
      <div className="relative">
        <Link href={`/products/${productId}`} className="block overflow-hidden">
          <img
            src={product.imageCover}
            alt={product.title}
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://placehold.co/400x400/f8fafc/16a34a?text=FreshCart';
            }}
            className="w-full h-60 object-contain bg-white group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {hasDiscount && (
          <div className="absolute top-3 left-3">
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
              -{discountPercent}%
            </span>
          </div>
        )}

        <div className="absolute top-3 right-3 flex flex-col space-y-2">
          <button
            type="button"
            onClick={handleToggleWishlist}
            disabled={isWishlistLoading}
            title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            className={`bg-white h-8 w-8 rounded-full flex items-center justify-center transition shadow-sm cursor-pointer ${
              inWishlist ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
            }`}
          >
            <Heart className={`w-4 h-4 ${inWishlist ? 'fill-red-500 text-red-500' : ''}`} />
          </button>

          <Link
            href={`/products?category=${product.category?._id || ''}`}
            title="Similar products"
            aria-label="Similar products"
            className="bg-white h-8 w-8 rounded-full flex items-center justify-center text-gray-600 hover:text-primary-600 shadow-sm transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </Link>

          <Link
            href={`/products/${productId}`}
            title="View product details"
            aria-label="View product details"
            className="bg-white h-8 w-8 rounded-full flex items-center justify-center text-gray-600 hover:text-primary-600 shadow-sm transition"
          >
            <Eye className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <div className="text-xs text-gray-500 mb-1">
            {product.category?.name || 'Grocery'}
          </div>
          <h3 className="font-medium mb-1 cursor-pointer" title={product.title}>
            <Link
              href={`/products/${productId}`}
              className="line-clamp-1 hover:text-primary-600 transition-colors"
            >
              {product.title}
            </Link>
          </h3>

          <div className="flex items-center mb-2">
            <div className="flex text-amber-400 mr-2">
              <div className="flex items-center text-yellow-400 gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < fullStars
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-yellow-400'
                    }`}
                  />
                ))}
              </div>
            </div>
            <span className="text-xs text-gray-500">
              {rating} ({product.ratingsQuantity || 0})
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span
              className={`text-lg font-bold ${
                hasDiscount ? 'text-primary-600' : 'text-gray-800'
              }`}
            >
              {hasDiscount ? product.priceAfterDiscount : product.price} EGP
            </span>
            {hasDiscount && (
              <span className="text-sm text-gray-500 line-through ml-2">
                {product.price} EGP
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isAddingThis}
            aria-label="Add to cart"
            className="h-10 w-10 rounded-full flex items-center justify-center transition bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-70 cursor-pointer shrink-0"
          >
            {isAddingThis ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : justAdded ? (
              <Check className="w-4 h-4 stroke-[2.5]" />
            ) : (
              <Plus className="w-4 h-4 stroke-[2.5]" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
