'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { ChevronRight, ArrowRight, Award } from 'lucide-react';
import { catalogApi } from '@/services/api';
import { Skeleton } from '@/components/ui/Skeleton';

export default function BrandsPage() {
  const brandsQuery = useQuery({
    queryKey: ['brands-catalog'],
    queryFn: () => catalogApi.getBrands(1, 50),
  });

  const brands = brandsQuery.data?.data || [];

  return (
    <div className="w-full pb-16">
      <div className="bg-linear-to-r from-violet-600 via-purple-600 to-indigo-700 text-white py-10 mb-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-xs md:text-sm text-blue-100 mb-2">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white font-medium">Brands</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Top Brands
          </h1>
          <p className="text-sm md:text-base text-blue-100 mt-1 max-w-xl">
            Shop from your favorite world-renowned brands, guaranteed 100% genuine and fresh.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {brandsQuery.isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col items-center space-y-4">
                <Skeleton className="w-24 h-24 rounded-full" />
                <Skeleton className="w-20 h-5 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
            {brands.map((brand) => (
              <Link
                key={brand._id}
                href={`/brands/${brand._id}`}
                className="group bg-white rounded-2xl border border-gray-100 p-6 flex flex-col items-center text-center shadow-sm hover:shadow-lg hover:border-violet-200 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-50 mb-3 group-hover:ring-4 group-hover:ring-indigo-500/20 transition-all duration-300 flex items-center justify-center p-2">
                  <Image
                    src={brand.image}
                    alt={brand.name}
                    fill
                    sizes="96px"
                    className="object-contain p-2 group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition mb-1">
                  {brand.name}
                </h3>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>View Products</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
