'use client';

import React, { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { ChevronRight, ArrowLeft, Award, Package } from 'lucide-react';
import { catalogApi } from '@/services/api';
import { ProductCard } from '@/components/products/ProductCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function BrandDetailsPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const brandId = resolvedParams.id;

  const brandQuery = useQuery({
    queryKey: ['brand', brandId],
    queryFn: () => catalogApi.getBrandById(brandId),
    enabled: !!brandId,
  });

  const productsQuery = useQuery({
    queryKey: ['brand-products', brandId],
    queryFn: () =>
      catalogApi.getProducts({
        brand: brandId,
        limit: 20,
      }),
    enabled: !!brandId,
  });

  const brand = brandQuery.data?.data;
  const products = productsQuery.data?.data || [];

  return (
    <div className="w-full pb-16">
      <div className="bg-linear-to-r from-blue-700 via-indigo-600 to-purple-700 text-white py-10 px-4 sm:px-6 lg:px-8 mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-xs md:text-sm text-blue-100 mb-2">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/brands" className="hover:text-white transition">Brands</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white font-medium">{brand?.name || 'Brand'}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-2">
            <div className="flex items-center gap-4">
              {brand?.image && (
                <div className="relative w-16 h-16 rounded-xl bg-white p-2 shadow-xs shrink-0 overflow-hidden">
                  <Image
                    src={brand.image}
                    alt={brand.name}
                    fill
                    sizes="64px"
                    className="object-contain p-1"
                  />
                </div>
              )}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                  {brand?.name ? `${brand.name} Products` : 'Brand Collection'}
                </h1>
                <p className="text-sm md:text-base text-blue-100 mt-0.5">
                  Explore original items from {brand?.name || 'this brand'}.
                </p>
              </div>
            </div>

            <Link
              href="/brands"
              className="btn bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-xs w-fit flex items-center gap-2 text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Brands</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">
              Products by {brand?.name}
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
            title="No Products by This Brand"
            description="We currently don't have items listed under this brand. Check back soon!"
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
