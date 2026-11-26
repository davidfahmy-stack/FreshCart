'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import {
  CreditCard,
  Banknote,
  ShoppingBag,
} from 'lucide-react';

import { useAuth } from '@/context/AuthContext';
import { orderApi } from '@/services/api';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';

export default function AllOrdersPage() {
  const { user } = useAuth();
  const userId = user?._id || '';

  const ordersQuery = useQuery({
    queryKey: ['user-orders', userId],
    queryFn: () => orderApi.getUserOrders(userId),
    enabled: !!userId,
  });

  const orders = ordersQuery.data || [];

  if (ordersQuery.isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Order History</h1>
        <Skeleton className="w-full h-44 rounded-2xl" />
        <Skeleton className="w-full h-44 rounded-2xl" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <EmptyState
          icon={<ShoppingBag className="w-14 h-14 text-gray-400" />}
          title="No Orders Yet"
          description="You haven't placed any orders yet. Discover our fresh catalog and start shopping today!"
          actionLabel="Start Shopping"
          actionHref="/products"
        />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="pb-6 border-b border-gray-200 mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Order History
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Review all previous purchases and check real-time delivery status.
        </p>
      </div>

      <div className="space-y-6">
        {orders.map((order) => {
          const dateStr = new Date(order.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          });

          return (
            <div
              key={order._id}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-md transition"
            >
              <div className="p-4 sm:p-6 bg-gray-50/70 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex flex-wrap items-center gap-4">
                  <div>
                    <span className="text-gray-400 block text-[11px]">Order Placed</span>
                    <span className="font-semibold text-gray-900">{dateStr}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[11px]">Order #</span>
                    <span className="font-mono font-bold text-gray-900">
                      #{order.id || order._id.slice(-6).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[11px]">Payment</span>
                    <span className="font-semibold text-gray-800 capitalize flex items-center gap-1">
                      {order.paymentMethodType === 'card' ? (
                        <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                      ) : (
                        <Banknote className="w-3.5 h-3.5 text-emerald-600" />
                      )}
                      {order.paymentMethodType}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      order.isPaid
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {order.isPaid ? 'Paid' : 'Unpaid'}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      order.isDelivered
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {order.isDelivered ? 'Delivered' : 'Processing'}
                  </span>
                </div>
              </div>

              <div className="p-4 sm:p-6 divide-y divide-gray-100">
                {order.cartItems.map((item) => {
                  const product = item.product;
                  if (!product) return null;

                  return (
                    <div
                      key={item._id}
                      className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative w-14 h-14 rounded-lg bg-gray-50 border border-gray-100 shrink-0 overflow-hidden p-1">
                          <Image
                            src={product.imageCover || '/freshcart-logo.svg'}
                            alt={product.title}
                            fill
                            sizes="56px"
                            className="object-contain"
                          />
                        </div>
                        <div>
                          <Link
                            href={`/products/${product._id || product.id}`}
                            className="text-xs sm:text-sm font-bold text-gray-900 hover:text-primary-600 transition line-clamp-1"
                          >
                            {product.title}
                          </Link>
                          <span className="text-xs text-gray-500">
                            Qty: <strong className="text-gray-700">{item.count}</strong> × {item.price} EGP
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs sm:text-sm font-bold text-gray-900">
                          {(item.price * item.count).toLocaleString()} EGP
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                {order.shippingAddress && (
                  <span className="text-xs text-gray-500">
                    Ship to: <strong className="text-gray-700">{order.shippingAddress.city}</strong>
                    {order.shippingAddress.details && ` (${order.shippingAddress.details})`}
                  </span>
                )}
                <div className="ml-auto flex items-baseline gap-2">
                  <span className="text-xs text-gray-500">Order Total:</span>
                  <span className="text-base font-extrabold text-primary-600">
                    {order.totalOrderPrice.toLocaleString()} EGP
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
