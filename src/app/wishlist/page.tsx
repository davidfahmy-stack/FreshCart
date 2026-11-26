'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '@/hooks/useWishlist';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';

export default function WishlistPage() {
  const { wishlistItems, count, isLoading, removeFromWishlist, moveToCart, isMovingToCart } =
    useWishlist();

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Wishlist</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
              <Skeleton className="w-full h-48 rounded-lg" />
              <Skeleton className="w-16 h-3 rounded" />
              <Skeleton className="w-full h-4 rounded" />
              <Skeleton className="w-24 h-4 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <EmptyState
          icon={<Heart className="w-14 h-14 text-gray-400" />}
          title="Your Wishlist is Empty"
          description="Explore our store and save your favorite items so you never lose track of what you love."
          actionLabel="Discover Products"
          actionHref="/products"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between pb-6 border-b border-gray-200 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            My Wishlist
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            You have saved <span className="font-bold text-primary-600">{count} products</span> for later.
          </p>
        </div>

        <Link
          href="/products"
          className="btn border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold flex items-center gap-1.5"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {wishlistItems.map((product) => {
          const regularPrice = product.price;
          const discountedPrice = product.priceAfterDiscount;
          const hasDiscount = discountedPrice && discountedPrice < regularPrice;

          return (
            <div
              key={product._id}
              className="group bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-md hover:border-gray-300 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative">
                <Link
                  href={`/products/${product._id}`}
                  className="block relative w-full h-52 bg-white p-4"
                >
                  <Image
                    src={product.imageCover}
                    alt={product.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>

                <button
                  type="button"
                  onClick={() => removeFromWishlist(product._id)}
                  className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 hover:bg-red-50 text-gray-400 hover:text-red-600 flex items-center justify-center shadow-xs transition"
                  aria-label="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
                <div>
                  {product.category && (
                    <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                      {product.category.name}
                    </span>
                  )}
                  <Link
                    href={`/products/${product._id}`}
                    className="text-xs sm:text-sm font-bold text-gray-900 hover:text-primary-600 transition line-clamp-2"
                  >
                    {product.title}
                  </Link>
                </div>

                <div className="pt-2 border-t border-gray-100 space-y-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-base font-extrabold text-primary-600">
                      {(hasDiscount ? discountedPrice : regularPrice).toLocaleString()} EGP
                    </span>
                    {hasDiscount && (
                      <span className="text-xs text-gray-400 line-through">
                        {regularPrice.toLocaleString()} EGP
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    disabled={isMovingToCart}
                    onClick={() => moveToCart(product._id)}
                    className="btn w-full bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold py-2 flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Move to Cart</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
