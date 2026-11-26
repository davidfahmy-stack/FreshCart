import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return <div className={`animate-pulse bg-gray-200 rounded-md ${className}`} />;
};

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 flex flex-col justify-between shadow-xs">
      <div>
        <div className="w-full aspect-square bg-gray-100 rounded-md animate-pulse mb-4" />
        <Skeleton className="h-3 w-16 mb-2" />
        <Skeleton className="h-4 w-3/4 mb-1" />
        <Skeleton className="h-4 w-1/2 mb-3" />
        <div className="flex items-center justify-between mb-3">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-4 w-12" />
        </div>
      </div>
      <Skeleton className="h-10 w-full rounded-full" />
    </div>
  );
};

export const CategoryCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col items-center p-3 bg-white rounded-lg border border-gray-100 shadow-xs">
      <div className="w-20 h-20 rounded-full bg-gray-100 animate-pulse mb-3" />
      <Skeleton className="h-4 w-16" />
    </div>
  );
};

export default Skeleton;
