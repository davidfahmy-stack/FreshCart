'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import { User, Mail, Lock, Phone, Eye, EyeOff, UserPlus, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';

const egyptPhoneRegex = /^01[0125][0-9]{8}$/;

const registerSchema = z
  .object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    rePassword: z.string().min(6, 'Confirm password is required'),
    phone: z
      .string()
      .regex(
        egyptPhoneRegex,
        'Please enter a valid Egyptian phone number (e.g. 01012345678)'
      ),
  })
  .refine((data) => data.password === data.rePassword, {
    message: 'Passwords do not match',
    path: ['rePassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerAuth } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      rePassword: '',
      phone: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsSubmitting(true);
      setServerError(null);
      await registerAuth(data);
      toast.success('Account created successfully! Welcome to FreshCart.');
      router.push('/');
    } catch (err: unknown) {
      const msg =
        (axios.isAxiosError(err) && err.response?.data?.message) ||
        (err instanceof Error && err.message) ||
        'Registration failed. Please check your data and try again.';
      setServerError(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50/50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8 space-y-6">
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
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight pt-2">
            Create an Account
          </h1>
          <p className="text-xs text-gray-500">
            Join FreshCart today and get 20% off your first grocery order!
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
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                autoComplete="name"
                placeholder="David Fahmy"
                {...register('name')}
                className={`form-control w-full pl-10 text-sm ${
                  errors.name ? 'border-red-500 focus:border-red-500' : ''
                }`}
              />
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            {errors.name && (
              <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                autoComplete="email"
                placeholder="name@example.com"
                {...register('email')}
                className={`form-control w-full pl-10 text-sm ${
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
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Phone Number (Egypt)
            </label>
            <div className="relative">
              <input
                type="tel"
                autoComplete="tel"
                placeholder="01012345678"
                {...register('phone')}
                className={`form-control w-full pl-10 text-sm ${
                  errors.phone ? 'border-red-500 focus:border-red-500' : ''
                }`}
              />
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            {errors.phone && (
              <p className="text-xs text-red-600 mt-1">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="••••••••"
                {...register('password')}
                className={`form-control w-full pl-10 pr-10 text-sm ${
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

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="••••••••"
                {...register('rePassword')}
                className={`form-control w-full pl-10 pr-10 text-sm ${
                  errors.rePassword ? 'border-red-500 focus:border-red-500' : ''
                }`}
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Toggle confirm password visibility"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.rePassword && (
              <p className="text-xs text-red-600 mt-1">{errors.rePassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 flex items-center justify-center gap-2 shadow-sm disabled:opacity-60 transition"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Create Account</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-primary-600 hover:text-primary-700 font-bold"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
