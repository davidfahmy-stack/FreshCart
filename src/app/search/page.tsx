'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { Search, PackageOpen } from 'lucide-react';
import { catalogApi } from '@/services/api';
import { ProductCard } from '@/components/products/ProductCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { useDebounce } from '@/hooks/useDebounce';

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('q') || searchParams.get('keyword') || '';

  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const debouncedSearch = useDebounce(searchTerm, 300);

  const activeQuery = debouncedSearch.trim();

  const productsQuery = useQuery({
    queryKey: ['search-products', activeQuery],
    queryFn: () => catalogApi.getProducts({ keyword: activeQuery || undefined, limit: 30 }),
    placeholderData: keepPreviousData,
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
  };

  const products = productsQuery.data?.data || [];

  return (
    <div className="w-full pb-16">
      <div className="bg-linear-to-r from-gray-900 via-gray-800 to-emerald-950 text-white py-10 px-4 sm:px-6 lg:px-8 mb-8">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Search FreshCart
          </h1>
          <p className="text-sm md:text-base text-gray-300">
            Find fresh vegetables, daily essentials, electronics, fashion, and more.
          </p>

          <form onSubmit={handleSearchSubmit} className="relative max-w-xl mx-auto pt-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for products, brands and more..."
              className="w-full rounded-full py-3.5 pl-12 pr-28 text-sm bg-white text-gray-900 shadow-lg focus:outline-hidden focus:ring-2 focus:ring-primary-500"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <button
              type="submit"
              className="btn absolute right-1.5 top-1/2 -translate-y-1/2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold px-5 py-2.5 rounded-full"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {activeQuery ? `Search Results for "${activeQuery}"` : 'Popular Products'}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Found {products.length} items
            </p>
          </div>
        </div>

        {productsQuery.isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 15 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
                <Skeleton className="w-full h-48 rounded-lg" />
                <Skeleton className="w-16 h-3 rounded" />
                <Skeleton className="w-full h-4 rounded" />
                <Skeleton className="w-24 h-4 rounded" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <EmptyState
            icon={<PackageOpen className="w-12 h-12 text-gray-400" />}
            title="No Products Found"
            description={
              activeQuery
                ? `No products matched your search "${activeQuery}". Try checking for spelling errors or using broader keywords.`
                : 'No products available.'
            }
            actionLabel="Browse All Products"
            actionHref="/products"
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-4 border-primary-600 border-t-transparent animate-spin" />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
