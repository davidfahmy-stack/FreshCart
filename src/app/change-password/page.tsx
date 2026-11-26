'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Lock, Eye, EyeOff, ShieldCheck, ArrowLeft, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { authApi } from '@/services/api';
import { useAuth } from '@/context/AuthContext';

export default function ChangePasswordPage() {
  const router = useRouter();
  const { refetchUser } = useAuth();

  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setErrorMessage('New password must be at least 6 characters.');
      return;
    }
    if (password !== rePassword) {
      setErrorMessage('New passwords do not match.');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(null);
      await authApi.changeMyPassword({
        currentPassword,
        password,
        rePassword,
      });
      await refetchUser();
      toast.success('Password changed successfully!');
      router.push('/profile');
    } catch (err: unknown) {
      const msg =
        (axios.isAxiosError(err) && err.response?.data?.message) ||
        'Failed to change password. Please verify your current password.';
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50/50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Change Password
          </h1>
          <p className="text-xs text-gray-500">
            Keep your account secure with a strong and unique password.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="form-control w-full pl-10 text-sm"
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control w-full pl-10 pr-10 text-sm"
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={rePassword}
                onChange={(e) => setRePassword(e.target.value)}
                className="form-control w-full pl-10 text-sm"
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 flex items-center justify-center gap-2 shadow-sm disabled:opacity-60"
          >
            {isLoading ? (
              <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              <span>Update Password</span>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-gray-100">
          <Link
            href="/profile"
            className="text-xs text-gray-500 hover:text-gray-700 font-medium inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
