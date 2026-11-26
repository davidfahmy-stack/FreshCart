'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  Star,
  Heart,
  ShoppingCart,
  Zap,
  Truck,
  RotateCcw,
  ShieldCheck,
  ChevronRight,
  Minus,
  Plus,
  Share2,
} from 'lucide-react';
import toast from 'react-hot-toast';

import { catalogApi } from '@/services/api';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { ProductCard } from '@/components/products/ProductCard';
import { Skeleton } from '@/components/ui/Skeleton';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailsPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;
  const router = useRouter();

  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'details' | 'reviews' | 'shipping'>('details');

  const { addToCart, isAddingToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const productQuery = useQuery({
    queryKey: ['product', productId],
    queryFn: () => catalogApi.getProductById(productId),
    enabled: !!productId,
  });

  const product = productQuery.data?.data;

  const similarProductsQuery = useQuery({
    queryKey: ['similar-products', product?.category?._id],
    queryFn: () =>
      catalogApi.getProducts({
        category: product?.category?._id,
        limit: 5,
      }),
    enabled: !!product?.category?._id,
  });

  if (productQuery.isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-4">
            <Skeleton className="w-full h-96 rounded-2xl" />
            <div className="flex gap-3">
              <Skeleton className="w-20 h-20 rounded-xl" />
              <Skeleton className="w-20 h-20 rounded-xl" />
              <Skeleton className="w-20 h-20 rounded-xl" />
            </div>
          </div>
          <div className="lg:col-span-7 space-y-4">
            <Skeleton className="w-32 h-6 rounded-full" />
            <Skeleton className="w-3/4 h-8 rounded-lg" />
            <Skeleton className="w-48 h-5 rounded" />
            <Skeleton className="w-40 h-10 rounded-lg" />
            <Skeleton className="w-full h-24 rounded-lg" />
            <Skeleton className="w-48 h-12 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (productQuery.isError || !product) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
        <p className="text-gray-500 mb-6 text-sm">
          The product you are looking for does not exist or may have been removed.
        </p>
        <Link href="/products" className="btn bg-primary-600 text-white">
          Back to Catalog
        </Link>
      </div>
    );
  }

  const galleryImages = [
    product.imageCover,
    ...(product.images || []).filter((img) => img !== product.imageCover),
  ];
  const activeImage = selectedImage || product.imageCover;
  const inWishlist = isInWishlist(product._id);

  const regularPrice = product.price;
  const discountedPrice = product.priceAfterDiscount;
  const hasDiscount = discountedPrice && discountedPrice < regularPrice;
  const discountPercent = hasDiscount
    ? Math.round(((regularPrice - discountedPrice) / regularPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart(product._id);
  };

  const handleBuyNow = () => {
    addToCart(product._id);
    router.push('/cart');
  };

  const handleShare = () => {
    if (typeof window !== 'undefined' && navigator.share) {
      navigator.share({
        title: product.title,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Product link copied to clipboard!');
    }
  };

  const similarProducts = (similarProductsQuery.data?.data || []).filter(
    (p) => p._id !== product._id
  );

  return (
    <div className="w-full pb-16">
      <div className="bg-gray-50 border-b border-gray-100 py-3.5 px-4 sm:px-6 lg:px-8 text-xs text-gray-500">
        <div className="max-w-7xl mx-auto flex items-center flex-wrap gap-1.5">
          <Link href="/" className="hover:text-primary-600 transition">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <Link href="/products" className="hover:text-primary-600 transition">
            Products
          </Link>
          {product.category && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              <Link
                href={`/categories/${product.category._id}`}
                className="hover:text-primary-600 transition"
              >
                {product.category.name}
              </Link>
            </>
          )}
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-gray-900 font-medium truncate max-w-xs">{product.title}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5 flex flex-col space-y-4">
            <div className="relative w-full h-[360px] sm:h-[420px] rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden flex items-center justify-center p-6">
              <Image
                src={activeImage}
                alt={product.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-contain p-4 transition-all duration-300"
              />
              {hasDiscount && (
                <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-xs">
                  -{discountPercent}%
                </div>
              )}
            </div>

            {galleryImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden bg-white border-2 shrink-0 transition-all ${
                      activeImage === img
                        ? 'border-primary-600 ring-2 ring-primary-500/30'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.title} thumb ${idx}`}
                      fill
                      sizes="80px"
                      className="object-contain p-1.5"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {product.category && (
                  <Link
                    href={`/categories/${product.category._id}`}
                    className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition"
                  >
                    {product.category.name}
                  </Link>
                )}
                {product.brand && (
                  <Link
                    href={`/brands/${product.brand._id}`}
                    className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 transition"
                  >
                    {product.brand.name}
                  </Link>
                )}
                <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-semibold ml-auto">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  In Stock
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight leading-snug mb-3">
                {product.title}
              </h1>

              <div className="flex items-center gap-3 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-gray-900">
                    {product.ratingsAverage ? product.ratingsAverage.toFixed(1) : '4.5'}
                  </span>
                </div>
                <span className="text-gray-300">•</span>
                <span>{product.ratingsQuantity || 128} verified reviews</span>
                <span className="text-gray-300">•</span>
                <span className="text-emerald-700 font-medium">98% satisfaction</span>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-baseline gap-3 mb-6">
                <span className="text-3xl font-extrabold text-primary-600">
                  {(hasDiscount ? discountedPrice : regularPrice).toLocaleString()} EGP
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-base text-gray-400 line-through">
                      {regularPrice.toLocaleString()} EGP
                    </span>
                    <span className="px-2 py-0.5 text-xs font-bold rounded-md bg-red-100 text-red-700">
                      Save {(regularPrice - discountedPrice).toLocaleString()} EGP ({discountPercent}%)
                    </span>
                  </>
                )}
              </div>

              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                {product.description}
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-gray-700">Quantity:</span>
                  <div className="flex items-center border border-gray-300 rounded-lg bg-white overflow-hidden shadow-xs">
                    <button
                      type="button"
                      disabled={quantity <= 1}
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="p-2 hover:bg-gray-100 text-gray-600 disabled:opacity-40 transition"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center text-sm font-bold text-gray-800">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="p-2 hover:bg-gray-100 text-gray-600 transition"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                    className="btn flex-1 bg-primary-600 hover:bg-primary-700 text-white flex items-center justify-center gap-2 shadow-sm font-bold py-3.5"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>{isAddingToCart ? 'Adding to Cart...' : 'Add to Cart'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleBuyNow}
                    className="btn flex-1 bg-gray-900 hover:bg-black text-white flex items-center justify-center gap-2 shadow-sm font-bold py-3.5"
                  >
                    <Zap className="w-5 h-5 text-amber-400 fill-amber-400" />
                    <span>Buy Now</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleWishlist(product._id)}
                    className={`btn border px-4 py-3.5 flex items-center justify-center transition ${
                      inWishlist
                        ? 'border-red-300 bg-red-50 text-red-600'
                        : 'border-gray-300 hover:bg-gray-50 text-gray-700'
                    }`}
                    aria-label="Toggle Wishlist"
                  >
                    <Heart className={`w-5 h-5 ${inWishlist ? 'fill-red-600' : ''}`} />
                  </button>

                  <button
                    type="button"
                    onClick={handleShare}
                    className="btn border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-3.5 flex items-center justify-center transition"
                    aria-label="Share product"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-gray-200 text-xs">
              <div className="flex items-center gap-2.5 text-gray-600">
                <Truck className="w-5 h-5 text-primary-600 shrink-0" />
                <span>Free Delivery over 500 EGP</span>
              </div>
              <div className="flex items-center gap-2.5 text-gray-600">
                <RotateCcw className="w-5 h-5 text-primary-600 shrink-0" />
                <span>14 Days Easy Return</span>
              </div>
              <div className="flex items-center gap-2.5 text-gray-600">
                <ShieldCheck className="w-5 h-5 text-primary-600 shrink-0" />
                <span>100% Authentic Product</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-gray-200 pt-8">
          <div className="flex items-center gap-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('details')}
              className={`pb-3 text-sm font-bold transition border-b-2 ${
                activeTab === 'details'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              Product Details
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 text-sm font-bold transition border-b-2 ${
                activeTab === 'reviews'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              Reviews ({product.ratingsQuantity || 128})
            </button>
            <button
              onClick={() => setActiveTab('shipping')}
              className={`pb-3 text-sm font-bold transition border-b-2 ${
                activeTab === 'shipping'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              Shipping & Returns
            </button>
          </div>

          <div className="py-6">
            {activeTab === 'details' && (
              <div className="space-y-4 max-w-3xl text-sm text-gray-700 leading-relaxed">
                <p>{product.description}</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <span className="block text-xs text-gray-400">Category</span>
                    <span className="font-semibold text-gray-800">{product.category?.name || 'N/A'}</span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <span className="block text-xs text-gray-400">Brand</span>
                    <span className="font-semibold text-gray-800">{product.brand?.name || 'FreshCart'}</span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <span className="block text-xs text-gray-400">Availability</span>
                    <span className="font-semibold text-emerald-600">In Stock</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="max-w-2xl space-y-6">
                <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="text-center">
                    <div className="text-4xl font-black text-gray-900">
                      {product.ratingsAverage ? product.ratingsAverage.toFixed(1) : '4.8'}
                    </div>
                    <div className="flex justify-center text-amber-400 mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-xs text-gray-400 mt-1 block">128 verified ratings</span>
                  </div>
                  <div className="flex-1 space-y-1.5 text-xs text-gray-600">
                    <div className="flex items-center gap-2">
                      <span className="w-8">5 star</span>
                      <div className="flex-1 h-2 rounded-full bg-gray-200 overflow-hidden">
                        <div className="h-full bg-amber-400 w-[78%]" />
                      </div>
                      <span className="w-8 text-right font-medium">78%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-8">4 star</span>
                      <div className="flex-1 h-2 rounded-full bg-gray-200 overflow-hidden">
                        <div className="h-full bg-amber-400 w-[14%]" />
                      </div>
                      <span className="w-8 text-right font-medium">14%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-8">3 star</span>
                      <div className="flex-1 h-2 rounded-full bg-gray-200 overflow-hidden">
                        <div className="h-full bg-amber-400 w-[5%]" />
                      </div>
                      <span className="w-8 text-right font-medium">5%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="max-w-3xl space-y-4 text-sm text-gray-700">
                <div className="p-4 rounded-xl border border-gray-100 bg-gray-50 space-y-2">
                  <h4 className="font-bold text-gray-900">Express Delivery</h4>
                  <p className="text-xs text-gray-600">
                    Orders placed before 2:00 PM are delivered same-day. Free standard shipping applies to all orders over 500 EGP.
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-gray-100 bg-gray-50 space-y-2">
                  <h4 className="font-bold text-gray-900">14-Day Free Returns</h4>
                  <p className="text-xs text-gray-600">
                    Items can be returned within 14 days of receipt if unopened and in original packaging. Our courier will pick up the package directly from your address.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {similarProducts.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">You May Also Like</h3>
                <p className="text-xs text-gray-500 mt-0.5">Similar items in this category</p>
              </div>
              <Link
                href={`/products?category=${product.category?._id}`}
                className="text-xs font-semibold text-primary-600 hover:text-primary-700"
              >
                View More
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {similarProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
