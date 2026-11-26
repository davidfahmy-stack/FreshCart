'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Mail, KeyRound, Lock, Eye, EyeOff, ArrowLeft, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { authApi } from '@/services/api';

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) return;

    try {
      setIsLoading(true);
      setErrorMessage(null);
      const res = await authApi.forgotPassword(cleanEmail);
      toast.success(res.message || 'Reset code sent to your email!');
      setStep(2);
    } catch (err: unknown) {
      const msg =
        (axios.isAxiosError(err) && err.response?.data?.message) ||
        'Failed to send reset code. Please check your email.';
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = resetCode.trim();
    if (!code) return;

    try {
      setIsLoading(true);
      setErrorMessage(null);
      await authApi.verifyResetCode(code);
      toast.success('Reset code verified successfully!');
      setStep(3);
    } catch (err: unknown) {
      const msg =
        (axios.isAxiosError(err) && err.response?.data?.message) ||
        'Invalid or expired reset code.';
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(null);
      await authApi.resetPassword({ email: email.trim().toLowerCase(), newPassword });
      toast.success('Password reset successfully! Please sign in with your new password.');
      router.push('/login');
    } catch (err: unknown) {
      const msg =
        (axios.isAxiosError(err) && err.response?.data?.message) ||
        'Failed to reset password. Please try again.';
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
            Reset Password
          </h1>
          <p className="text-xs text-gray-500">
            {step === 1 && 'Enter your registered email address to receive a verification code.'}
            {step === 2 && 'Enter the 6-digit reset code sent to your email inbox.'}
            {step === 3 && 'Choose a strong new password for your account.'}
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 py-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
              step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-400'
            }`}
          >
            1
          </div>
          <div className={`w-8 h-0.5 ${step >= 2 ? 'bg-primary-600' : 'bg-gray-200'}`} />
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
              step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-400'
            }`}
          >
            2
          </div>
          <div className={`w-8 h-0.5 ${step >= 3 ? 'bg-primary-600' : 'bg-gray-200'}`} />
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
              step >= 3 ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-400'
            }`}
          >
            3
          </div>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleSendCode} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control w-full pl-10 text-sm"
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
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
                <span>Send Reset Code</span>
              )}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Verification Code
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="123456"
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value.replace(/\s+/g, ''))}
                  className="form-control w-full pl-10 text-sm tracking-widest font-mono"
                />
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
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
                <span>Verify Code</span>
              )}
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
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
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                <span>Save New Password</span>
              )}
            </button>
          </form>
        )}

        <div className="text-center pt-2 border-t border-gray-100">
          <Link
            href="/login"
            className="text-xs text-gray-500 hover:text-gray-700 font-medium inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
