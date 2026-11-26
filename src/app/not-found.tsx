import React from 'react';
import Link from 'next/link';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 text-center">
      <div className="text-8xl font-black text-primary-600/20 mb-2 select-none tracking-tight">
        404
      </div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
        Page Not Found
      </h1>
      <p className="text-gray-600 max-w-md mb-8 text-sm md:text-base">
        Sorry, the page you are looking for doesn't exist or has been moved to another section.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="btn bg-primary-600 hover:bg-primary-700 text-white flex items-center gap-2 shadow-sm"
        >
          <Home className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
        <Link
          href="/products"
          className="btn border border-gray-300 hover:bg-gray-50 text-gray-700 flex items-center gap-2 shadow-sm"
        >
          <Search className="w-4 h-4" />
          <span>Browse Products</span>
        </Link>
      </div>
    </div>
  );
}
