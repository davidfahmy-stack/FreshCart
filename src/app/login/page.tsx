'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle, ShieldCheck, Users, Star, Truck } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';

  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsSubmitting(true);
      setServerError(null);
      await login(data);
      toast.success('Welcome back to FreshCart!');
      router.push(redirectUrl);
    } catch (err: unknown) {
      const msg =
        (axios.isAxiosError(err) && err.response?.data?.message) ||
        (err instanceof Error && err.message) ||
        'Failed to sign in. Please verify your credentials.';
      setServerError(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 bg-gray-50/50">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center max-w-6xl mx-auto">
          <div className="hidden lg:flex flex-col space-y-8 pr-6">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-50 text-primary-700 text-xs font-semibold border border-primary-100 w-fit">
                <Truck className="w-4 h-4 text-primary-600" />
                Fresh Groceries Delivered Fast
              </span>
              <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
                FreshCart - Your One-Stop Shop for Fresh Products
              </h2>
              <p className="text-base text-gray-600 leading-relaxed">
                Join thousands of happy customers enjoying farm-fresh produce, top electronics, and daily essentials delivered straight to your doorstep.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-1.5">
                <ShieldCheck className="w-6 h-6 text-primary-600" />
                <p className="text-sm font-bold text-gray-900">SSL Secured</p>
                <p className="text-xs text-gray-500">100% encrypted</p>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-1.5">
                <Users className="w-6 h-6 text-primary-600" />
                <p className="text-sm font-bold text-gray-900">50K+ Users</p>
                <p className="text-xs text-gray-500">Trusted daily</p>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-1.5">
                <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
                <p className="text-sm font-bold text-gray-900">4.9 Rating</p>
                <p className="text-xs text-gray-500">Verified reviews</p>
              </div>
            </div>
          </div>

          <div className="w-full max-w-[600px] mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 p-8 lg:p-12 space-y-6">
            <div className="text-center space-y-2">
              <Link href="/" className="inline-block">
                <Image
                  src="/freshcart-logo.svg"
                  alt="FreshCart"
                  width={160}
                  height={36}
                  className="mx-auto h-9 w-auto"
                />
              </Link>
              <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight pt-2">
                Welcome Back!
              </h1>
              <p className="text-sm text-gray-500">
                Sign in to continue your FreshCart shopping experience.
              </p>
            </div>

            {serverError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{serverError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    autoComplete="email"
                    placeholder="name@example.com"
                    {...register('email')}
                    className={`form-control w-full pl-10 py-3 text-sm ${
                      errors.email ? 'border-red-500 focus:border-red-500' : ''
                    }`}
                  />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-gray-700">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    {...register('password')}
                    className={`form-control w-full pl-10 pr-10 py-3 text-sm ${
                      errors.password ? 'border-red-500 focus:border-red-500' : ''
                    }`}
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>
                )}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  id="keep-signed-in"
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                />
                <label htmlFor="keep-signed-in" className="text-xs text-gray-600 cursor-pointer">
                  Keep me signed in
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn w-full h-[52px] bg-primary-600 hover:bg-primary-700 text-white font-bold flex items-center justify-center gap-2 shadow-sm disabled:opacity-60 transition"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </form>

            <div className="text-center pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                Don&apos;t have an account?{' '}
                <Link
                  href="/register"
                  className="text-primary-600 hover:text-primary-700 font-bold"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-4 border-primary-600 border-t-transparent animate-spin" />
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
