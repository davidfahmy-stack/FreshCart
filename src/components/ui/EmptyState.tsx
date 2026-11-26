import React from 'react';
import Link from 'next/link';
import { PackageOpen, LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon | React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  actionLink?: string;
  actionHref?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = PackageOpen,
  title,
  description,
  actionLabel,
  actionLink,
  actionHref,
  onAction,
}) => {
  const targetLink = actionHref || actionLink;

  const renderIcon = () => {
    if (React.isValidElement(icon)) {
      return icon;
    }
    const IconComponent = (icon as LucideIcon) || PackageOpen;
    return <IconComponent className="w-8 h-8" />;
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white rounded-2xl border border-gray-100 shadow-xs">
      <div className="w-16 h-16 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center mb-4">
        {renderIcon()}
      </div>
      <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500 max-w-sm">{description}</p>
      {actionLabel && targetLink && (
        <Link
          href={targetLink}
          className="mt-6 inline-flex items-center justify-center px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold transition-colors shadow-sm"
        >
          {actionLabel}
        </Link>
      )}
      {actionLabel && !targetLink && onAction && (
        <button
          onClick={onAction}
          className="mt-6 inline-flex items-center justify-center px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold transition-colors shadow-sm cursor-pointer"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
