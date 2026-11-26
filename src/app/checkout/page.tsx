'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
  ShieldCheck,
  CreditCard,
  Banknote,
  MapPin,
  ChevronRight,
  ArrowRight,
  Truck,
  CheckCircle2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useCart } from '@/hooks/useCart';
import { addressApi, orderApi, ShippingAddressInput } from '@/services/api';

const egyptPhoneRegex = /^01[0125][0-9]{8}$/;

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartId, numOfCartItems, clearCart } = useCart();

  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'online'>('cash');
  const [details, setDetails] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Cairo');
  const [selectedSavedAddressId, setSelectedSavedAddressId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addressesQuery = useQuery({
    queryKey: ['addresses'],
    queryFn: () => addressApi.getAddresses(),
  });

  const savedAddresses = addressesQuery.data?.data || [];

  const handleSelectAddress = (id: string) => {
    setSelectedSavedAddressId(id);
    const found = savedAddresses.find((a) => a._id === id);
    if (found) {
      setDetails(found.details);
      setPhone(found.phone);
      setCity(found.city);
    }
  };

  const subtotal = cart?.totalCartPrice || 0;
  const isFreeShipping = subtotal >= 500;
  const shippingFee = isFreeShipping ? 0 : 50;
  const total = subtotal + shippingFee;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cartId) {
      toast.error('Cart session not found. Please refresh.');
      return;
    }

    if (!details.trim() || !phone.trim() || !city.trim()) {
      toast.error('Please fill in complete shipping address information.');
      return;
    }

    if (!egyptPhoneRegex.test(phone.trim())) {
      toast.error('Please enter a valid Egyptian phone number (e.g. 01012345678)');
      return;
    }

    const shippingAddress: ShippingAddressInput = {
      details: details.trim(),
      phone: phone.trim(),
      city: city.trim(),
    };

    try {
      setIsSubmitting(true);

      if (paymentMethod === 'cash') {
        await orderApi.createCashOrder(cartId, shippingAddress);
        toast.success('Order placed successfully! Thank you for shopping with FreshCart.');
        await clearCart();
        router.push('/allorders');
      } else {
        const returnUrl = typeof window !== 'undefined' ? window.location.origin : '';
        const sessionRes = await orderApi.createCheckoutSession(
          cartId,
          returnUrl,
          shippingAddress
        );

        if (sessionRes.session?.url) {
          toast.success('Redirecting to secure Stripe payment gateway...');
          window.location.href = sessionRes.session.url;
        } else {
          toast.error('Failed to initiate online payment session.');
        }
      }
    } catch (err: unknown) {
      const msg =
        (axios.isAxiosError(err) && err.response?.data?.message) ||
        'Failed to process order. Please try again.';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!cart || numOfCartItems === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Cart is Empty</h2>
        <p className="text-sm text-gray-500 mb-6">
          Add items to your cart before proceeding to checkout.
        </p>
        <Link href="/products" className="btn bg-primary-600 text-white">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
        <Link href="/" className="hover:text-primary-600 transition">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <Link href="/cart" className="hover:text-primary-600 transition">Cart</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-gray-900 font-medium">Checkout</span>
      </div>

      <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-8">
        Checkout & Payment
      </h1>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-8">
          {savedAddresses.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-6 space-y-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-600" />
                <span>Saved Addresses</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {savedAddresses.map((addr) => (
                  <button
                    key={addr._id}
                    type="button"
                    onClick={() => handleSelectAddress(addr._id)}
                    className={`p-4 rounded-xl border text-left transition ${
                      selectedSavedAddressId === addr._id
                        ? 'border-primary-600 bg-primary-50/40 ring-2 ring-primary-500/20'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-gray-900">{addr.name}</span>
                      {selectedSavedAddressId === addr._id && (
                        <CheckCircle2 className="w-4 h-4 text-primary-600" />
                      )}
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2">{addr.details}</p>
                    <span className="text-[11px] text-gray-400 mt-1 block">
                      {addr.city} • {addr.phone}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Truck className="w-5 h-5 text-emerald-600" />
              <span>Shipping Information</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  City
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="form-control w-full text-sm bg-white"
                >
                  <option value="Cairo">Cairo</option>
                  <option value="Giza">Giza</option>
                  <option value="Alexandria">Alexandria</option>
                  <option value="Mansoura">Mansoura</option>
                  <option value="Tanta">Tanta</option>
                  <option value="Assiut">Assiut</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Contact Phone (Egypt)
                </label>
                <input
                  type="tel"
                  required
                  placeholder="01012345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="form-control w-full text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Detailed Address (Street, Building, Apartment)
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. 15 Tahrir Square, Apt 4"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="form-control w-full text-sm"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Payment Method</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label
                className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition ${
                  paymentMethod === 'cash'
                    ? 'border-primary-600 bg-primary-50/40 ring-2 ring-primary-500/20'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'cash'}
                  onChange={() => setPaymentMethod('cash')}
                  className="text-primary-600"
                />
                <Banknote className="w-5 h-5 text-emerald-700 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Cash on Delivery</h4>
                  <p className="text-xs text-gray-500">Pay when your order arrives</p>
                </div>
              </label>

              <label
                className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition ${
                  paymentMethod === 'online'
                    ? 'border-primary-600 bg-primary-50/40 ring-2 ring-primary-500/20'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'online'}
                  onChange={() => setPaymentMethod('online')}
                  className="text-primary-600"
                />
                <CreditCard className="w-5 h-5 text-blue-700 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Credit / Debit Card</h4>
                  <p className="text-xs text-gray-500">Fast & secure payment via Stripe</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6 sticky top-24">
          <h2 className="text-lg font-bold text-gray-900 pb-3 border-b border-gray-100">
            Order Review
          </h2>

          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Items Total ({numOfCartItems})</span>
              <span className="font-semibold text-gray-900">{subtotal.toLocaleString()} EGP</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping Fee</span>
              <span className="font-semibold text-gray-900">
                {shippingFee === 0 ? (
                  <span className="text-emerald-600 font-bold">FREE</span>
                ) : (
                  `${shippingFee} EGP`
                )}
              </span>
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-between items-baseline">
              <span className="text-base font-bold text-gray-900">Grand Total</span>
              <span className="text-2xl font-extrabold text-primary-600">
                {total.toLocaleString()} EGP
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 flex items-center justify-center gap-2 shadow-sm text-sm"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : paymentMethod === 'cash' ? (
              <>
                <span>Place Cash Order</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>Pay with Stripe</span>
                <CreditCard className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="pt-3 border-t border-gray-100 text-xs text-gray-400 space-y-1.5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Encrypted with 256-bit SSL security</span>
            </div>
            <p>
              By placing your order, you agree to FreshCart&apos;s terms of service and privacy policies.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
