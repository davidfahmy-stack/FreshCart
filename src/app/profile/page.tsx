'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {
  User as UserIcon,
  Mail,
  Shield,
  Package,
  MapPin,
  Heart,
  ShoppingCart,
  KeyRound,
  LogOut,
  Edit2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { authApi } from '@/services/api';

const egyptPhoneRegex = /^01[0125][0-9]{8}$/;

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout, refetchUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.trim() && !egyptPhoneRegex.test(phone.trim())) {
      toast.error('Please enter a valid Egyptian phone number (e.g. 01012345678)');
      return;
    }

    try {
      setIsUpdating(true);
      await authApi.updateMe({ name: name.trim(), email: email.trim(), phone: phone.trim() });
      await refetchUser();
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (err: unknown) {
      const msg =
        (axios.isAxiosError(err) && err.response?.data?.message) ||
        'Failed to update profile.';
      toast.error(msg);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    toast.success('Signed out successfully.');
    router.push('/login');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            My Account
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage your personal profile, addresses, and order history.
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="btn border border-gray-200 hover:bg-red-50 hover:border-red-200 text-gray-600 hover:text-red-600 flex items-center gap-2 text-xs font-semibold"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xl font-bold">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{user?.name || 'FreshCart User'}</h2>
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 mt-1">
                  <Shield className="w-3 h-3" />
                  Verified Member
                </span>
              </div>
            </div>

            {!isEditing && (
              <button
                onClick={() => {
                  setName(user?.name || '');
                  setEmail(user?.email || '');
                  setIsEditing(true);
                }}
                className="btn border border-gray-200 hover:bg-gray-50 text-gray-700 flex items-center gap-1.5 text-xs font-semibold"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleUpdate} className="space-y-4 pt-4 border-t border-gray-100">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-control w-full text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control w-full text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  placeholder="01012345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="form-control w-full text-sm"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="btn bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold py-2.5 px-4"
                >
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="btn border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs py-2.5 px-4"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-3 pt-4 border-t border-gray-100 text-sm">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <Mail className="w-4 h-4 text-gray-400" />
                <div>
                  <span className="block text-xs text-gray-400">Email Address</span>
                  <span className="font-semibold text-gray-800">{user?.email || 'Not available'}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <UserIcon className="w-4 h-4 text-gray-400" />
                <div>
                  <span className="block text-xs text-gray-400">Account Role</span>
                  <span className="font-semibold text-gray-800 capitalize">{user?.role || 'User'}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-5 space-y-3">
          <Link
            href="/allorders"
            className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 shadow-xs hover:shadow-md hover:border-primary-200 transition group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">My Orders</h4>
                <p className="text-xs text-gray-400">Track and review previous purchases</p>
              </div>
            </div>
          </Link>

          <Link
            href="/addresses"
            className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 shadow-xs hover:shadow-md hover:border-primary-200 transition group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">Saved Addresses</h4>
                <p className="text-xs text-gray-400">Manage your shipping destinations</p>
              </div>
            </div>
          </Link>

          <Link
            href="/wishlist"
            className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 shadow-xs hover:shadow-md hover:border-primary-200 transition group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">My Wishlist</h4>
                <p className="text-xs text-gray-400">View saved products for later</p>
              </div>
            </div>
          </Link>

          <Link
            href="/cart"
            className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 shadow-xs hover:shadow-md hover:border-primary-200 transition group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">Shopping Cart</h4>
                <p className="text-xs text-gray-400">Review items in your active bag</p>
              </div>
            </div>
          </Link>

          <Link
            href="/change-password"
            className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 shadow-xs hover:shadow-md hover:border-primary-200 transition group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">Security & Password</h4>
                <p className="text-xs text-gray-400">Update your account credentials</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
