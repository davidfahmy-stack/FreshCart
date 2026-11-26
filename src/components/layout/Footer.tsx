'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Truck,
  RotateCcw,
  ShieldCheck,
  Headphones,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <>
      <div className="bg-primary-50 border-y border-primary-100">
        <div className="container mx-auto px-4 py-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">Free Shipping</h4>
                <p className="text-gray-500 text-xs">On orders over 500 EGP</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center shrink-0">
                <RotateCcw className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">Easy Returns</h4>
                <p className="text-gray-500 text-xs">14-day return policy</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">Secure Payment</h4>
                <p className="text-gray-500 text-xs">100% secure checkout</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center shrink-0">
                <Headphones className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">24/7 Support</h4>
                <p className="text-gray-500 text-xs">Contact us anytime</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer id="footer" className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
            <div className="lg:col-span-4 space-y-5">
              <Link href="/" className="bg-white rounded-lg px-4 py-2 inline-block">
                <Image
                  src="/freshcart-logo.svg"
                  alt="FreshCart Logo"
                  width={160}
                  height={31}
                  className="h-8 w-auto"
                />
              </Link>
              <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                FreshCart is your one-stop destination for quality products. From fashion to
                electronics, we bring you the best brands at competitive prices with a seamless
                shopping experience.
              </p>

              <div className="space-y-2.5 text-sm text-gray-400">
                <a
                  href="tel:+18001234567"
                  className="flex items-center gap-2.5 hover:text-primary-400 transition-colors"
                >
                  <Phone className="w-4 h-4 text-primary-500 shrink-0" />
                  <span>+1 (800) 123-4567</span>
                </a>
                <a
                  href="mailto:support@freshcart.com"
                  className="flex items-center gap-2.5 hover:text-primary-400 transition-colors"
                >
                  <Mail className="w-4 h-4 text-primary-500 shrink-0" />
                  <span>support@freshcart.com</span>
                </a>
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-primary-500 shrink-0" />
                  <span>123 Commerce Street, New York, NY 10001</span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <a
                  href="#facebook"
                  onClick={(e) => e.preventDefault()}
                  aria-label="Facebook"
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary-600 hover:text-white transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="#twitter"
                  onClick={(e) => e.preventDefault()}
                  aria-label="Twitter"
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary-600 hover:text-white transition-colors"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a
                  href="#instagram"
                  onClick={(e) => e.preventDefault()}
                  aria-label="Instagram"
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary-600 hover:text-white transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="#youtube"
                  onClick={(e) => e.preventDefault()}
                  aria-label="YouTube"
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary-600 hover:text-white transition-colors"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="lg:col-span-2">
              <h3 className="font-semibold text-lg mb-5">Shop</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/products"
                    className="text-gray-400 hover:text-primary-400 transition-colors text-sm"
                  >
                    All Products
                  </Link>
                </li>
                <li>
                  <Link
                    href="/categories"
                    className="text-gray-400 hover:text-primary-400 transition-colors text-sm"
                  >
                    Categories
                  </Link>
                </li>
                <li>
                  <Link
                    href="/brands"
                    className="text-gray-400 hover:text-primary-400 transition-colors text-sm"
                  >
                    Brands
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products?category=6439d58a0049ad0b52b9003f"
                    className="text-gray-400 hover:text-primary-400 transition-colors text-sm"
                  >
                    Electronics
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products?category=6439d2d167d9aa4ca970649f"
                    className="text-gray-400 hover:text-primary-400 transition-colors text-sm"
                  >
                    Men&apos;s Fashion
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products?category=6439d5b90049ad0b52b90048"
                    className="text-gray-400 hover:text-primary-400 transition-colors text-sm"
                  >
                    Women&apos;s Fashion
                  </Link>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-2">
              <h3 className="font-semibold text-lg mb-5">Account</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/profile"
                    className="text-gray-400 hover:text-primary-400 transition-colors text-sm"
                  >
                    My Account
                  </Link>
                </li>
                <li>
                  <Link
                    href="/allorders"
                    className="text-gray-400 hover:text-primary-400 transition-colors text-sm"
                  >
                    Order History
                  </Link>
                </li>
                <li>
                  <Link
                    href="/wishlist"
                    className="text-gray-400 hover:text-primary-400 transition-colors text-sm"
                  >
                    Wishlist
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cart"
                    className="text-gray-400 hover:text-primary-400 transition-colors text-sm"
                  >
                    Shopping Cart
                  </Link>
                </li>
                <li>
                  <Link
                    href="/login"
                    className="text-gray-400 hover:text-primary-400 transition-colors text-sm"
                  >
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link
                    href="/register"
                    className="text-gray-400 hover:text-primary-400 transition-colors text-sm"
                  >
                    Create Account
                  </Link>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-2">
              <h3 className="font-semibold text-lg mb-5">Support</h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="mailto:support@freshcart.com"
                    className="text-gray-400 hover:text-primary-400 transition-colors text-sm"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="#footer"
                    className="text-gray-400 hover:text-primary-400 transition-colors text-sm"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <Link
                    href="/checkout"
                    className="text-gray-400 hover:text-primary-400 transition-colors text-sm"
                  >
                    Shipping Info
                  </Link>
                </li>
                <li>
                  <Link
                    href="/allorders"
                    className="text-gray-400 hover:text-primary-400 transition-colors text-sm"
                  >
                    Returns &amp; Refunds
                  </Link>
                </li>
                <li>
                  <Link
                    href="/allorders"
                    className="text-gray-400 hover:text-primary-400 transition-colors text-sm"
                  >
                    Track Order
                  </Link>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-2">
              <h3 className="font-semibold text-lg mb-5">Legal</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/products"
                    className="text-gray-400 hover:text-primary-400 transition-colors text-sm"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products"
                    className="text-gray-400 hover:text-primary-400 transition-colors text-sm"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products"
                    className="text-gray-400 hover:text-primary-400 transition-colors text-sm"
                  >
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-500 text-sm text-center md:text-left">
                &copy; 2026 FreshCart. All rights reserved.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <CreditCard className="w-4 h-4" />
                  <span>Visa</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <CreditCard className="w-4 h-4" />
                  <span>Mastercard</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <CreditCard className="w-4 h-4" />
                  <span>PayPal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
