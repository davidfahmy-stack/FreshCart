'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Trash2,
  Minus,
  Plus,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  ShoppingBag,
} from 'lucide-react';
import toast from 'react-hot-toast';

import { useCart } from '@/hooks/useCart';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';

export default function CartPage() {
  const router = useRouter();
  const {
    cart,
    numOfCartItems,
    isLoading,
    updateQuantityAsync,
    removeItem,
    isRemovingItem,
    clearCart,
    isClearingCart,
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [updatingProductId, setUpdatingProductId] = useState<string | null>(null);
  const [removingProductId, setRemovingProductId] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  const cartProducts = cart?.products || [];
  const subtotal = cart?.totalCartPrice || 0;
  const freeShippingThreshold = 500;
  const isFreeShipping = subtotal >= freeShippingThreshold || subtotal === 0;
  const shippingFee = isFreeShipping ? 0 : 50;
  const discountAmount = Math.round((subtotal * appliedDiscount) / 100);
  const total = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (code === 'FRESH20') {
      setAppliedDiscount(20);
      toast.success('Coupon FRESH20 applied! 20% discount added.');
    } else if (code === 'ORGANIC40') {
      setAppliedDiscount(40);
      toast.success('Coupon ORGANIC40 applied! 40% discount added.');
    } else {
      toast.error('Invalid coupon code. Try FRESH20 or ORGANIC40.');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Shopping Cart</h1>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-4">
            <Skeleton className="w-full h-28 rounded-xl" />
            <Skeleton className="w-full h-28 rounded-xl" />
            <Skeleton className="w-full h-28 rounded-xl" />
          </div>
          <div className="lg:col-span-4">
            <Skeleton className="w-full h-80 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (cartProducts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <EmptyState
          icon={<ShoppingBag className="w-14 h-14 text-gray-400" />}
          title="Your Shopping Cart is Empty"
          description="Looks like you haven't added anything to your cart yet. Explore our fresh deals and fill it up!"
          actionLabel="Start Shopping"
          actionHref="/products"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-gray-200 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Shopping Cart
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            You have <span className="font-bold text-primary-600">{numOfCartItems} items</span> in your cart.
          </p>
        </div>

        {confirmClear ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                clearCart();
                setConfirmClear(false);
              }}
              disabled={isClearingCart}
              className="btn bg-red-600 hover:bg-red-700 text-white flex items-center gap-1.5 text-xs font-semibold"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{isClearingCart ? 'Clearing...' : 'Confirm Clear'}</span>
            </button>
            <button
              type="button"
              onClick={() => setConfirmClear(false)}
              disabled={isClearingCart}
              className="btn border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs font-semibold"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmClear(true)}
            disabled={isClearingCart}
            className="btn border border-gray-200 hover:bg-red-50 hover:border-red-200 text-gray-600 hover:text-red-600 flex items-center gap-1.5 text-xs font-semibold w-fit"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All Items</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-4">
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Truck className="w-5 h-5 text-emerald-600 shrink-0" />
              <div className="text-xs text-emerald-900">
                {isFreeShipping ? (
                  <span className="font-bold text-emerald-700">
                    Congratulations! You qualify for FREE Delivery!
                  </span>
                ) : (
                  <span>
                    Add{' '}
                    <strong className="text-emerald-700">
                      {(freeShippingThreshold - subtotal).toLocaleString()} EGP
                    </strong>{' '}
                    more to qualify for <strong>FREE Delivery</strong>!
                  </span>
                )}
              </div>
            </div>
            {!isFreeShipping && (
              <Link
                href="/products"
                className="text-xs font-bold text-emerald-700 hover:underline shrink-0"
              >
                Add Items
              </Link>
            )}
          </div>

          <div className="divide-y divide-gray-100 bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
            {cartProducts.map((item) => {
              const product = item.product;
              if (!product) return null;
              const productId = product._id || product.id || '';

              return (
                <div
                  key={item._id}
                  className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/50 transition"
                >
                  <div className="flex items-center gap-4">
                    <Link
                      href={`/products/${productId}`}
                      className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-white border border-gray-100 shrink-0 overflow-hidden p-2"
                    >
                      <Image
                        src={product.imageCover || '/freshcart-logo.svg'}
                        alt={product.title}
                        fill
                        sizes="96px"
                        className="object-contain"
                      />
                    </Link>

                    <div className="space-y-1">
                      {product.category && (
                        <span className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider">
                          {product.category.name}
                        </span>
                      )}
                      <Link
                        href={`/products/${productId}`}
                        className="block text-sm sm:text-base font-bold text-gray-900 hover:text-primary-600 transition line-clamp-2"
                      >
                        {product.title}
                      </Link>
                      <div className="text-xs text-gray-500">
                        Unit Price: <span className="font-semibold text-gray-800">{item.price} EGP</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-0 border-gray-100">
                    <div className="flex items-center border border-gray-200 rounded-lg bg-white overflow-hidden shadow-xs">
                      <button
                        type="button"
                        disabled={updatingProductId === productId || item.count <= 1}
                        onClick={async () => {
                          setUpdatingProductId(productId);
                          try {
                            await updateQuantityAsync({ productId, count: item.count - 1 });
                          } finally {
                            setUpdatingProductId(null);
                          }
                        }}
                        className="p-1.5 hover:bg-gray-100 text-gray-600 disabled:opacity-30 transition"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-10 text-center text-xs font-bold text-gray-800">
                        {updatingProductId === productId ? '...' : item.count}
                      </span>
                      <button
                        type="button"
                        disabled={updatingProductId === productId}
                        onClick={async () => {
                          setUpdatingProductId(productId);
                          try {
                            await updateQuantityAsync({ productId, count: item.count + 1 });
                          } finally {
                            setUpdatingProductId(null);
                          }
                        }}
                        className="p-1.5 hover:bg-gray-100 text-gray-600 disabled:opacity-30 transition"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right min-w-[90px]">
                      <span className="text-base font-extrabold text-primary-600">
                        {(item.price * item.count).toLocaleString()} EGP
                      </span>
                    </div>

                    <button
                      type="button"
                      disabled={isRemovingItem && removingProductId === productId}
                      onClick={() => {
                        setRemovingProductId(productId);
                        removeItem(productId);
                      }}
                      className="p-2 text-gray-400 hover:text-red-600 disabled:opacity-40 transition"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6 sticky top-24">
          <h2 className="text-lg font-bold text-gray-900 pb-3 border-b border-gray-100">
            Order Summary
          </h2>

          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal ({numOfCartItems} items)</span>
              <span className="font-semibold text-gray-900">{subtotal.toLocaleString()} EGP</span>
            </div>

            <div className="flex justify-between">
              <span>Estimated Shipping</span>
              <span className="font-semibold text-gray-900">
                {shippingFee === 0 ? (
                  <span className="text-emerald-600 font-bold">FREE</span>
                ) : (
                  `${shippingFee} EGP`
                )}
              </span>
            </div>

            {appliedDiscount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount ({appliedDiscount}%)</span>
                <span className="font-bold">-{discountAmount.toLocaleString()} EGP</span>
              </div>
            )}

            <div className="pt-3 border-t border-gray-100 flex justify-between items-baseline">
              <span className="text-base font-bold text-gray-900">Total</span>
              <span className="text-2xl font-extrabold text-primary-600">
                {total.toLocaleString()} EGP
              </span>
            </div>
          </div>

          <form onSubmit={handleApplyCoupon} className="space-y-2 pt-2">
            <label className="block text-xs font-semibold text-gray-700">
              Promo Coupon
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="FRESH20"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="form-control flex-1 text-xs uppercase"
              />
              <button
                type="submit"
                className="btn bg-gray-900 hover:bg-black text-white text-xs font-bold px-4"
              >
                Apply
              </button>
            </div>
          </form>

          <button
            onClick={() => router.push('/checkout')}
            className="btn w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 flex items-center justify-center gap-2 shadow-sm text-sm"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="space-y-2 pt-4 border-t border-gray-100 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Safe & Secure 256-Bit SSL Checkout</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-emerald-600" />
              <span>14-Day Free Returns Guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
