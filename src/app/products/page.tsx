'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { ArrowUpDown, X, ChevronRight, PackageOpen } from 'lucide-react';
import { catalogApi } from '@/services/api';
import { ProductCard } from '@/components/products/ProductCard';
import { Pagination } from '@/components/ui/Pagination';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const categoryParam = searchParams.get('category') || '';
  const brandParam = searchParams.get('brand') || '';
  const searchKeyword = searchParams.get('keyword') || searchParams.get('q') || '';
  const sortParam = searchParams.get('sort') || '';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);

  const [sort, setSort] = useState(sortParam);
  const [currentPage, setCurrentPage] = useState(pageParam);

  const productsQuery = useQuery({
    queryKey: ['products-list', { categoryParam, brandParam, searchKeyword, sort, currentPage }],
    queryFn: () =>
      catalogApi.getProducts({
        category: categoryParam || undefined,
        brand: brandParam || undefined,
        keyword: searchKeyword || undefined,
        sort: sort || undefined,
        page: currentPage,
        limit: 40,
      }),
    placeholderData: keepPreviousData,
  });

  const categoriesQuery = useQuery({
    queryKey: ['categories-all'],
    queryFn: () => catalogApi.getCategories(1, 50),
    placeholderData: keepPreviousData,
  });

  const brandsQuery = useQuery({
    queryKey: ['brands-all'],
    queryFn: () => catalogApi.getBrands(1, 50),
    placeholderData: keepPreviousData,
  });

  const products = productsQuery.data?.data || [];
  const paginationResult = productsQuery.data?.metadata;
  const totalPages = paginationResult?.numberOfPages || 1;

  const currentCategory = categoriesQuery.data?.data?.find((c) => c._id === categoryParam);
  const currentBrand = brandsQuery.data?.data?.find((b) => b._id === brandParam);

  const handleSortChange = (newSort: string) => {
    setSort(newSort);
    const params = new URLSearchParams(searchParams.toString());
    if (newSort) params.set('sort', newSort);
    else params.delete('sort');
    params.set('page', '1');
    setCurrentPage(1);
    router.push(`/products?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`/products?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilter = (key: 'category' | 'brand' | 'keyword') => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    if (key === 'keyword') params.delete('q');
    params.set('page', '1');
    setCurrentPage(1);
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="w-full pb-16">
      <div className="bg-linear-to-r from-emerald-600 to-emerald-700 text-white py-10 mb-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-xs md:text-sm text-emerald-100 mb-2">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white font-medium">Products</span>
            {currentCategory && (
              <>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-emerald-200">{currentCategory.name}</span>
              </>
            )}
            {currentBrand && (
              <>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-emerald-200">{currentBrand.name}</span>
              </>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            {currentCategory
              ? currentCategory.name
              : currentBrand
              ? `${currentBrand.name} Collection`
              : searchKeyword
              ? `Search: "${searchKeyword}"`
              : 'All Products'}
          </h1>
          <p className="text-sm md:text-base text-emerald-100 mt-1 max-w-xl">
            {currentCategory
              ? `Browse top-rated products in ${currentCategory.name}`
              : currentBrand
              ? `Authentic products crafted by ${currentBrand.name}`
              : 'Explore our complete product collection, updated daily with unbeatable prices.'}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-gray-200 mb-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mr-1">
              Active Filters:
            </span>
            {currentCategory && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                Category: {currentCategory.name}
                <button
                  onClick={() => clearFilter('category')}
                  className="hover:text-emerald-900 transition"
                  aria-label="Remove category filter"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
            {currentBrand && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                Brand: {currentBrand.name}
                <button
                  onClick={() => clearFilter('brand')}
                  className="hover:text-blue-900 transition"
                  aria-label="Remove brand filter"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
            {searchKeyword && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                Keyword: &quot;{searchKeyword}&quot;
                <button
                  onClick={() => clearFilter('keyword')}
                  className="hover:text-amber-900 transition"
                  aria-label="Remove keyword filter"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
            {!currentCategory && !currentBrand && !searchKeyword && (
              <span className="text-xs text-gray-400 italic">None</span>
            )}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <label htmlFor="sort-select" className="text-xs font-medium text-gray-600 flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Sort:</span>
            </label>
            <select
              id="sort-select"
              value={sort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="form-control text-xs py-1.5 px-2.5 bg-white border-gray-300 rounded-lg cursor-pointer"
            >
              <option value="">Featured</option>
              <option value="-createdAt">Newest Arrivals</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
              <option value="-ratingsAverage">Top Rated</option>
            </select>
          </div>
        </div>

        {productsQuery.isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
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
          <div className="py-12">
            <EmptyState
              icon={<PackageOpen className="w-12 h-12 text-gray-400" />}
              title="No Products Found"
              description="No products match your current filters. Try resetting your search or exploring other categories."
              actionLabel="View All Products"
              actionHref="/products"
            />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="pt-10 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-4 border-primary-600 border-t-transparent animate-spin" />
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
