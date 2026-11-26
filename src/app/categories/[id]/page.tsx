'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ChevronRight, ArrowLeft, FolderOpen, ArrowRight, Package } from 'lucide-react';
import { catalogApi } from '@/services/api';
import { ProductCard } from '@/components/products/ProductCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CategoryDetailsPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const categoryId = resolvedParams.id;

  const categoryQuery = useQuery({
    queryKey: ['category', categoryId],
    queryFn: () => catalogApi.getCategoryById(categoryId),
    enabled: !!categoryId,
  });

  const subcategoriesQuery = useQuery({
    queryKey: ['category-subcategories', categoryId],
    queryFn: () => catalogApi.getCategorySubcategories(categoryId),
    enabled: !!categoryId,
  });

  const productsQuery = useQuery({
    queryKey: ['category-products', categoryId],
    queryFn: () =>
      catalogApi.getProducts({
        category: categoryId,
        limit: 20,
      }),
    enabled: !!categoryId,
  });

  const category = categoryQuery.data?.data;
  const subcategories = subcategoriesQuery.data?.data || [];
  const products = productsQuery.data?.data || [];

  return (
    <div className="w-full pb-16">
      <div className="bg-linear-to-r from-emerald-700 via-emerald-600 to-teal-700 text-white py-10 px-4 sm:px-6 lg:px-8 mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-xs md:text-sm text-emerald-100 mb-2">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/categories" className="hover:text-white transition">Categories</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white font-medium">{category?.name || 'Category'}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-2">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                {category?.name || 'Category Details'}
              </h1>
              <p className="text-sm md:text-base text-emerald-100 mt-1">
                Choose a subcategory or browse all products in this category.
              </p>
            </div>
            <Link
              href="/categories"
              className="btn bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-xs w-fit flex items-center gap-2 text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Categories</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {subcategories.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-emerald-600" />
                <span>
                  {subcategories.length} Subcategories in {category?.name}
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {subcategories.map((sub) => (
                <Link
                  key={sub._id}
                  href={`/products?category=${categoryId}&subcategory=${sub._id}`}
                  className="group bg-white rounded-xl border border-gray-100 p-4 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all duration-200 flex flex-col justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition">
                      <FolderOpen className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-semibold text-gray-800 group-hover:text-emerald-700 transition line-clamp-1">
                      {sub.name}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-emerald-600 flex items-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Browse Products</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                Products in {category?.name || 'this Category'}
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Showing {products.length} products
              </p>
            </div>
          </div>

          {productsQuery.isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {Array.from({ length: 10 }).map((_, i) => (
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
              icon={<Package className="w-12 h-12 text-gray-400" />}
              title="No Products in This Category"
              description="We currently don't have items listed under this category. Check back soon!"
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
        </section>
      </div>
    </div>
  );
}
