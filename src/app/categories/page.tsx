'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { ChevronRight, ArrowRight, Layers } from 'lucide-react';
import { catalogApi } from '@/services/api';
import { Skeleton } from '@/components/ui/Skeleton';

export default function CategoriesPage() {
  const categoriesQuery = useQuery({
    queryKey: ['categories-catalog'],
    queryFn: () => catalogApi.getCategories(1, 50),
  });

  const categories = categoriesQuery.data?.data || [];

  return (
    <div className="w-full pb-16">
      <div className="bg-linear-to-r from-emerald-600 to-emerald-700 text-white py-10 mb-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-xs md:text-sm text-emerald-100 mb-2">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white font-medium">Categories</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            All Categories
          </h1>
          <p className="text-sm md:text-base text-emerald-100 mt-1 max-w-xl">
            Browse our wide range of product categories, from fresh produce to daily household essentials.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {categoriesQuery.isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 flex flex-col items-center space-y-4">
                <Skeleton className="w-32 h-32 rounded-xl" />
                <Skeleton className="w-24 h-5 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                href={`/categories/${cat._id}`}
                className="group bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 flex flex-col items-center text-center shadow-sm hover:shadow-lg hover:border-emerald-200 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-xl overflow-hidden bg-primary-50 mb-4 group-hover:ring-4 group-hover:ring-primary-500/20 transition-all duration-300">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 640px) 120px, 150px"
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-base font-bold text-gray-900 group-hover:text-primary-600 transition mb-1">
                  {cat.name}
                </h3>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Explore</span>
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
