import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 space-y-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-gray-100" />
        <div className="absolute inset-0 rounded-full border-4 border-primary-600 border-t-transparent animate-spin" />
      </div>
      <p className="text-sm font-semibold text-gray-500 tracking-wide animate-pulse">
        Loading FreshCart...
      </p>
    </div>
  );
}
