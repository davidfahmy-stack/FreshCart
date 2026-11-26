'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  ShoppingCart,
  Heart,
  User,
  UserPlus,
  Search,
  Menu,
  X,
  LogOut,
  Package,
  MapPin,
  KeyRound,
  UserCheck,
  ChevronDown,
  Truck,
  Gift,
  Phone,
  Mail,
  Headphones,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { catalogApi } from '@/services/api';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { numOfCartItems } = useCart();
  const { count: wishlistCount } = useWishlist();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const categoriesMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const { data: categoriesData } = useQuery({
    queryKey: ['navbar-categories'],
    queryFn: () => catalogApi.getCategories(1, 15),
    staleTime: 1000 * 60 * 15,
  });

  const categories = categoriesData?.data || [];

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
    setIsCategoriesOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (categoriesMenuRef.current && !categoriesMenuRef.current.contains(e.target as Node)) {
        setIsCategoriesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/products');
    }
  };

  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    router.push('/login');
  };

  return (
    <>
      <div className="hidden lg:block text-sm border-b border-gray-100 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-10">
            <div className="flex items-center gap-6 text-gray-500">
              <span className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-primary-600" />
                <span>Free Shipping on Orders 500 EGP</span>
              </span>
              <span className="flex items-center gap-2">
                <Gift className="w-3.5 h-3.5 text-primary-600" />
                <span>New Arrivals Daily</span>
              </span>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4 text-gray-500">
                <a
                  href="tel:+18001234567"
                  className="flex items-center gap-1.5 hover:text-primary-600 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>+1 (800) 123-4567</span>
                </a>
                <a
                  href="mailto:support@freshcart.com"
                  className="flex items-center gap-1.5 hover:text-primary-600 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>support@freshcart.com</span>
                </a>
              </div>

              <span className="w-px h-4 bg-gray-200" />

              <div className="flex items-center gap-4">
                {isAuthenticated ? (
                  <>
                    <Link
                      href="/profile"
                      className="flex items-center gap-1.5 text-gray-600 hover:text-primary-600 transition-colors font-medium"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>{user?.name || 'My Account'}</span>
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex items-center gap-1.5 text-gray-600 hover:text-red-600 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="flex items-center gap-1.5 text-gray-600 hover:text-primary-600 transition-colors"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>Sign In</span>
                    </Link>
                    <Link
                      href="/register"
                      className="flex items-center gap-1.5 text-gray-600 hover:text-primary-600 transition-colors"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Sign Up</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-40 bg-white shadow-sm">
        <div className="bg-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16 lg:h-[72px] gap-4 lg:gap-8">
              <Link href="/" className="shrink-0 flex items-center">
                <Image
                  src="/freshcart-logo.svg"
                  alt="FreshCart"
                  width={160}
                  height={31}
                  className="h-6 lg:h-8 w-auto"
                  priority
                />
              </Link>

              <form
                onSubmit={handleSearchSubmit}
                className="hidden lg:flex flex-1 max-w-2xl relative"
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearchSubmit(e);
                    }
                  }}
                  placeholder="Search for products, brands and more..."
                  className="w-full px-5 py-3 pr-12 rounded-full border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm text-gray-800 placeholder:text-gray-400"
                />
                <button
                  type="submit"
                  aria-label="Search"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-primary-600 text-white flex items-center justify-center hover:bg-primary-700 transition-colors cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                </button>
              </form>

              <nav className="hidden xl:flex items-center gap-6">
                <Link
                  href="/"
                  className="font-medium text-gray-700 hover:text-primary-600 transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/products"
                  className={`font-medium transition-colors ${
                    pathname === '/products'
                      ? 'text-primary-600'
                      : 'text-gray-700 hover:text-primary-600'
                  }`}
                >
                  Shop
                </Link>

                <div
                  className="relative group"
                  ref={categoriesMenuRef}
                  onMouseEnter={() => setIsCategoriesOpen(true)}
                  onMouseLeave={() => setIsCategoriesOpen(false)}
                >
                  <button
                    type="button"
                    onClick={() => setIsCategoriesOpen((prev) => !prev)}
                    className={`flex items-center gap-1.5 font-medium transition-colors py-2 cursor-pointer ${
                      pathname.startsWith('/categories')
                        ? 'text-primary-600'
                        : 'text-gray-700 hover:text-primary-600'
                    }`}
                  >
                    <span>Categories</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180 ${
                        isCategoriesOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <div
                    className={`absolute top-full left-0 pt-1 transition-all duration-200 z-50 ${
                      isCategoriesOpen
                        ? 'opacity-100 visible'
                        : 'opacity-0 invisible group-hover:opacity-100 group-hover:visible'
                    }`}
                  >
                    <div className="bg-white border border-gray-100 rounded-xl shadow-xl py-2 min-w-[200px] max-h-[340px] overflow-y-auto">
                      <Link
                        href="/categories"
                        className="block px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                      >
                        All Categories
                      </Link>
                      {categories.map((cat) => (
                        <Link
                          key={cat._id}
                          href={`/products?category=${cat._id}`}
                          className="block px-4 py-2.5 text-sm text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                <Link
                  href="/brands"
                  className={`font-medium transition-colors ${
                    pathname.startsWith('/brands')
                      ? 'text-primary-600'
                      : 'text-gray-700 hover:text-primary-600'
                  }`}
                >
                  Brands
                </Link>
              </nav>

              <div className="flex items-center gap-1 lg:gap-2">
                <a
                  href="#footer"
                  className="hidden lg:flex items-center gap-2 pr-3 mr-2 border-r border-gray-200 hover:opacity-80 transition-opacity"
                >
                  <div className="w-10 h-10 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                    <Headphones className="w-5 h-5" />
                  </div>
                  <div className="text-xs">
                    <span className="text-gray-400 block">Support</span>
                    <span className="font-semibold text-gray-700">24/7 Help</span>
                  </div>
                </a>

                <Link
                  href="/wishlist"
                  title="Wishlist"
                  className="relative p-2.5 rounded-full hover:bg-gray-100 transition-colors group"
                >
                  <Heart className="w-5 h-5 text-gray-500 group-hover:text-primary-600 transition-colors" />
                  {wishlistCount > 0 && (
                    <span className="absolute top-0.5 right-0.5 size-[18px] rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                      {wishlistCount > 99 ? '99+' : wishlistCount}
                    </span>
                  )}
                </Link>

                <Link
                  href="/cart"
                  title="Cart"
                  className="relative p-2.5 rounded-full hover:bg-gray-100 transition-colors group"
                >
                  <ShoppingCart className="w-5 h-5 text-gray-500 group-hover:text-primary-600 transition-colors" />
                  {numOfCartItems > 0 && (
                    <span className="absolute top-0.5 right-0.5 size-[18px] rounded-full bg-primary-600 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                      {numOfCartItems > 99 ? '99+' : numOfCartItems}
                    </span>
                  )}
                </Link>

                {isAuthenticated ? (
                  <div className="hidden lg:block relative ml-2" ref={userMenuRef}>
                    <button
                      type="button"
                      onClick={() => setIsUserMenuOpen((prev) => !prev)}
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 hover:bg-primary-100 text-primary-700 font-semibold text-sm transition-colors cursor-pointer"
                    >
                      <User className="w-4 h-4" />
                      <span className="max-w-[90px] truncate">{user?.name || 'Account'}</span>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>

                    {isUserMenuOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50 divide-y divide-gray-100">
                        <div className="px-4 py-2">
                          <p className="text-xs text-gray-400">Signed in as</p>
                          <p className="text-sm font-bold text-gray-900 truncate">
                            {user?.name || 'FreshCart User'}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>

                        <div className="py-1">
                          <Link
                            href="/profile"
                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                          >
                            <UserCheck className="w-4 h-4 text-gray-400" />
                            My Profile
                          </Link>
                          <Link
                            href="/allorders"
                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                          >
                            <Package className="w-4 h-4 text-gray-400" />
                            Order History
                          </Link>
                          <Link
                            href="/addresses"
                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                          >
                            <MapPin className="w-4 h-4 text-gray-400" />
                            Saved Addresses
                          </Link>
                          <Link
                            href="/change-password"
                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                          >
                            <KeyRound className="w-4 h-4 text-gray-400" />
                            Change Password
                          </Link>
                        </div>

                        <div className="py-1">
                          <button
                            type="button"
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer"
                          >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="hidden lg:flex items-center gap-2 ml-2 px-5 py-2.5 rounded-full bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold transition-colors shadow-sm shadow-primary-600/20"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Sign In</span>
                  </Link>
                )}

                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                  className="lg:hidden ml-1 w-10 h-10 rounded-full bg-primary-600 hover:bg-primary-700 text-white flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Toggle Menu"
                >
                  {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div
        onClick={() => setIsMobileMenuOpen(false)}
        className={`fixed inset-0 bg-black/50 z-50 lg:hidden transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden={!isMobileMenuOpen}
      />

      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl transition-transform duration-300 overflow-y-auto z-50 lg:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="p-5 space-y-5">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="shrink-0">
              <Image src="/freshcart-logo.svg" alt="FreshCart" width={140} height={27} className="h-7 w-auto" />
            </Link>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors cursor-pointer"
              aria-label="Close Menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm"
            />
            <button
              type="submit"
              aria-label="Search"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-primary-600 text-white flex items-center justify-center hover:bg-primary-700 transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          <nav className="flex flex-col space-y-1">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/products"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-colors"
            >
              Shop
            </Link>
            <Link
              href="/categories"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-colors"
            >
              Categories
            </Link>
            <Link
              href="/brands"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-colors"
            >
              Brands
            </Link>
          </nav>

          <div className="border-t border-gray-100 pt-4 space-y-2">
            <Link
              href="/wishlist"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center">
                  <Heart className="w-4 h-4 text-red-500" />
                </div>
                <span className="font-medium text-gray-700">Wishlist</span>
              </div>
              {wishlistCount > 0 && (
                <span className="text-xs font-bold bg-red-500 text-white px-2 py-0.5 rounded-full">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              href="/cart"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary-50 flex items-center justify-center">
                  <ShoppingCart className="w-4 h-4 text-primary-600" />
                </div>
                <span className="font-medium text-gray-700">Cart</span>
              </div>
              {numOfCartItems > 0 && (
                <span className="text-xs font-bold bg-primary-600 text-white px-2 py-0.5 rounded-full">
                  {numOfCartItems}
                </span>
              )}
            </Link>
          </div>

          <div className="border-t border-gray-100 pt-4">
            {isAuthenticated ? (
              <div className="space-y-1">
                <div className="px-4 py-1 text-xs text-gray-500">
                  Signed in as <span className="font-semibold text-gray-800">{user?.name}</span>
                </div>
                <Link
                  href="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-50"
                >
                  <UserCheck className="w-4 h-4 text-gray-400" />
                  My Profile
                </Link>
                <Link
                  href="/allorders"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Package className="w-4 h-4 text-gray-400" />
                  Order History
                </Link>
                <Link
                  href="/addresses"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-50"
                >
                  <MapPin className="w-4 h-4 text-gray-400" />
                  Saved Addresses
                </Link>
                <Link
                  href="/change-password"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-50"
                >
                  <KeyRound className="w-4 h-4 text-gray-400" />
                  Change Password
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm text-red-600 hover:bg-red-50 text-left cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-2.5 text-center rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-2.5 text-center rounded-xl border-2 border-primary-600 text-primary-600 hover:bg-primary-50 text-sm font-semibold transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          <a
            href="#footer"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900">Need Help?</div>
              <div className="text-xs text-primary-600 font-medium">Contact Support</div>
            </div>
          </a>
        </div>
      </div>
    </>
  );
};

export default Navbar;
