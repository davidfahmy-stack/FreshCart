'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

import {
  Truck,
  ShieldCheck,
  RotateCcw,
  Headphones,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Flame,
  CheckCircle2,
  Smartphone,
  Star,
  Download,
  Mail,
} from 'lucide-react';

import { catalogApi } from '@/services/api';
import { ProductCard } from '@/components/products/ProductCard';
import { Skeleton } from '@/components/ui/Skeleton';

export const HomeContent: React.FC = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const categoriesQuery = useQuery({
    queryKey: ['categories-home'],
    queryFn: () => catalogApi.getCategories(1, 20),
  });

  const productsQuery = useQuery({
    queryKey: ['products-featured'],
    queryFn: () => catalogApi.getProducts({ page: 1, limit: 40 }),
  });

  const categories = categoriesQuery.data?.data || [];
  const products = productsQuery.data?.data || [];

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSubscribed(true);
  };

  return (
    <div className="w-full pb-12">
      <section className="relative w-full">
        <div className="relative h-[400px] bg-gray-900 overflow-hidden">
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            autoplay={{ delay: 4500, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            navigation={{
              prevEl: '.home-hero-prev',
              nextEl: '.home-hero-next',
            }}
            loop={true}
            className="hero-swiper w-full h-[400px]"
          >
            <SwiperSlide className="relative w-full h-[400px]">
              <Image
                src="/home-slider-1.png"
                alt="Fresh Products"
                fill
                priority
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-linear-to-r from-green-500/90 to-green-400/50 z-10" />
              <div className="relative z-20 h-full container mx-auto flex items-center">
                <div className="text-white max-w-xl">
                  <h2 className="text-white text-3xl font-bold mb-4 max-w-96 leading-tight">
                    Fresh Products Delivered to your Door
                  </h2>
                  <p className="text-white/95 text-base md:text-lg mb-6 font-normal">
                    Get 20% off your first order
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    <Link
                      href="/products"
                      className="btn bg-white border-2 border-white/50 text-green-500 inline-block px-6 py-2 rounded-lg font-semibold hover:scale-105 transition-transform whitespace-nowrap"
                    >
                      Shop Now
                    </Link>
                    <Link
                      href="/products?sort=-price"
                      className="btn bg-transparent border-2 border-white/50 text-white inline-block px-6 py-2 rounded-lg font-semibold hover:scale-105 transition-transform whitespace-nowrap"
                    >
                      View Deals
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>

            <SwiperSlide className="relative w-full h-[400px]">
              <Image
                src="/home-slider-1.png"
                alt="Premium Quality"
                fill
                className="object-cover object-center scale-x-[-1]"
              />
              <div className="absolute inset-0 bg-linear-to-r from-green-500/90 to-green-400/50 z-10" />
              <div className="relative z-20 h-full container mx-auto flex items-center">
                <div className="text-white max-w-xl">
                  <h2 className="text-white text-3xl font-bold mb-4 max-w-96 leading-tight">
                    Premium Quality Guaranteed
                  </h2>
                  <p className="text-white/95 text-base md:text-lg mb-6 font-normal">
                    Fresh from farm to your table
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    <Link
                      href="/products"
                      className="btn bg-white border-2 border-white/50 text-blue-500 inline-block px-6 py-2 rounded-lg font-semibold hover:scale-105 transition-transform whitespace-nowrap"
                    >
                      Shop Now
                    </Link>
                    <Link
                      href="/categories"
                      className="btn bg-transparent border-2 border-white/50 text-white inline-block px-6 py-2 rounded-lg font-semibold hover:scale-105 transition-transform whitespace-nowrap"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>

            <SwiperSlide className="relative w-full h-[400px]">
              <Image
                src="/home-slider-1.png"
                alt="Fast Delivery"
                fill
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-linear-to-r from-green-500/90 to-green-400/50 z-10" />
              <div className="relative z-20 h-full container mx-auto flex items-center">
                <div className="text-white max-w-xl">
                  <h2 className="text-white text-3xl font-bold mb-4 max-w-96 leading-tight">
                    Fast &amp; Free Delivery
                  </h2>
                  <p className="text-white/95 text-base md:text-lg mb-6 font-normal">
                    Same day delivery available
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    <Link
                      href="/products"
                      className="btn bg-white border-2 border-white/50 text-purple-500 inline-block px-6 py-2 rounded-lg font-semibold hover:scale-105 transition-transform whitespace-nowrap"
                    >
                      Order Now
                    </Link>
                    <Link
                      href="/products"
                      className="btn bg-transparent border-2 border-white/50 text-white inline-block px-6 py-2 rounded-lg font-semibold hover:scale-105 transition-transform whitespace-nowrap"
                    >
                      Delivery Info
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>

          <button
            type="button"
            aria-label="Previous Slide"
            className="home-hero-prev hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/90 hover:bg-white text-primary-600 items-center justify-center shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            type="button"
            aria-label="Next Slide"
            className="home-hero-next hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/90 hover:bg-white text-primary-600 items-center justify-center shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </section>

      <section className="bg-gray-50 py-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 text-sm">Free Shipping</h3>
                <p className="text-xs text-gray-500">On orders over 500 EGP</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 text-sm">Secure Payment</h3>
                <p className="text-xs text-gray-500">100% secure transactions</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 text-sm">Easy Returns</h3>
                <p className="text-xs text-gray-500">14-day return policy</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <Headphones className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 text-sm">24/7 Support</h3>
                <p className="text-xs text-gray-500">Dedicated support team</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="categories" className="py-10 my-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-8 bg-linear-to-b from-emerald-500 to-emerald-700 rounded-full" />
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                Shop By <span className="text-emerald-600">Category</span>
              </h2>
            </div>
            <Link
              href="/categories"
              className="group flex items-center gap-1.5 font-medium text-emerald-600 hover:text-emerald-700 transition"
            >
              <span>View All Categories</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {categoriesQuery.isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-4 shadow-sm flex flex-col items-center space-y-3">
                  <Skeleton className="w-20 h-20 rounded-full" />
                  <Skeleton className="w-20 h-4 rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat._id}
                  href={`/categories/${cat._id}`}
                  className="group bg-white rounded-lg p-4 flex flex-col items-center text-center shadow-sm hover:shadow-md transition"
                >
                  <div className="relative w-20 h-20 rounded-full overflow-hidden bg-primary-100 mb-3">
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      sizes="80px"
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-sm font-medium text-gray-800 group-hover:text-emerald-600 transition line-clamp-1">
                    {cat.name}
                  </h3>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-10">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-emerald-500 to-emerald-700 p-8 text-white min-h-[300px] flex flex-col justify-between">
              <div className="relative z-10">
                <span className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-sm mb-4">
                  <Flame className="w-4 h-4" />
                  Deal of the Day
                </span>
                <h3 className="text-2xl md:text-3xl font-bold mb-2">
                  Fresh Organic Fruits
                </h3>
                <p className="text-white/80 mb-4 max-w-sm">
                  Get up to 40% off on selected organic fruits
                </p>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold">40% OFF</span>
                  <span className="text-sm text-white/90">
                    Use code: <span className="font-bold">ORGANIC40</span>
                  </span>
                </div>
              </div>
              <div className="relative z-10 pt-4">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 bg-white text-emerald-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
                >
                  <span>Shop Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-orange-400 to-rose-500 p-8 text-white min-h-[300px] flex flex-col justify-between">
              <div className="relative z-10">
                <span className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-sm mb-4">
                  <Sparkles className="w-4 h-4" />
                  New Arrivals
                </span>
                <h3 className="text-2xl md:text-3xl font-bold mb-2">
                  Exotic Vegetables
                </h3>
                <p className="text-white/80 mb-4 max-w-sm">
                  Discover our latest collection of premium vegetables
                </p>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold">25% OFF</span>
                  <span className="text-sm text-white/90">
                    Use code: <span className="font-bold">FRESH25</span>
                  </span>
                </div>
              </div>
              <div className="relative z-10 pt-4">
                <Link
                  href="/products?sort=-createdAt"
                  className="inline-flex items-center gap-2 bg-white text-orange-500 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
                >
                  <span>Explore Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-8 bg-linear-to-b from-emerald-500 to-emerald-700 rounded-full" />
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                Featured <span className="text-emerald-600">Products</span>
              </h2>
            </div>
          </div>

          {productsQuery.isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
                  <Skeleton className="w-full h-48 rounded-lg" />
                  <Skeleton className="w-16 h-3 rounded" />
                  <Skeleton className="w-full h-4 rounded" />
                  <Skeleton className="w-24 h-4 rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto">
          <div className="rounded-[2.5rem] bg-linear-to-br from-emerald-50 via-white to-teal-50 border border-emerald-100/50 shadow-2xl p-8 lg:p-14">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-3 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 block">
                        NEWSLETTER
                      </span>
                      <span className="text-xs text-gray-500 font-medium">50,000+ subscribers</span>
                    </div>
                  </div>
                  <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
                    Get the Freshest Updates{' '}
                    <span className="text-emerald-600">Delivered Free</span>
                  </h2>
                  <p className="text-base text-gray-600">
                    Weekly recipes, seasonal offers &amp; exclusive member perks right to your inbox.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <span className="inline-flex items-center gap-1.5 text-xs bg-white text-gray-700 px-3.5 py-2 rounded-full border border-emerald-100 font-medium shadow-xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Fresh Picks Weekly
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs bg-white text-gray-700 px-3.5 py-2 rounded-full border border-emerald-100 font-medium shadow-xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Free Delivery Codes
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs bg-white text-gray-700 px-3.5 py-2 rounded-full border border-emerald-100 font-medium shadow-xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Members-Only Deals
                    </span>
                  </div>
                </div>

                <div>
                  {newsletterSubscribed ? (
                    <div className="p-4 rounded-2xl bg-emerald-600 text-white flex items-center gap-3">
                      <CheckCircle2 className="w-6 h-6 shrink-0" />
                      <div>
                        <h4 className="font-bold text-sm">You&apos;re In!</h4>
                        <p className="text-xs text-emerald-100">
                          Thanks for subscribing. Check your inbox soon for your 20% discount code.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={newsletterEmail}
                        onChange={(e) => setNewsletterEmail(e.target.value)}
                        className="flex-1 bg-white text-sm py-4 px-5 rounded-2xl border-2 border-gray-200 focus:border-emerald-500 transition-colors"
                      />
                      <button
                        type="submit"
                        className="bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shrink-0 font-semibold px-7 py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
                      >
                        <span>Subscribe</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </form>
                  )}
                  <p className="text-xs text-gray-400 mt-3">
                    Unsubscribe anytime. No spam, ever.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-2 lg:border-l lg:border-emerald-100 lg:pl-10">
                <div className="rounded-3xl bg-gray-900 text-white p-8 flex flex-col justify-between relative overflow-hidden">
                  <div className="space-y-4 relative z-10">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-emerald-400 border border-white/10">
                      MOBILE APP
                    </span>
                    <h3 className="text-2xl font-bold tracking-tight">Shop Faster on Our App</h3>
                    <p className="text-sm text-gray-300">
                      Get app-exclusive deals &amp; 15% off your first order.
                    </p>
                    <div className="flex items-center gap-1 text-amber-400 text-xs pt-1">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="text-white font-semibold ml-1.5">4.9</span>
                      <span className="text-gray-400 ml-1">• 100K+ downloads</span>
                    </div>
                  </div>

                  <div className="pt-8 flex flex-col gap-3 relative z-10">
                    <button
                      type="button"
                      className="bg-white hover:bg-gray-100 text-gray-900 flex items-center gap-3 py-3 px-4 rounded-xl transition-colors text-left cursor-pointer"
                    >
                      <Download className="w-5 h-5 shrink-0" />
                      <div>
                        <span className="block text-[10px] text-gray-500 leading-none">Download on</span>
                        <span className="block text-sm font-bold leading-tight">App Store</span>
                      </div>
                    </button>
                    <button
                      type="button"
                      className="bg-white/10 hover:bg-white/20 text-white border border-white/20 flex items-center gap-3 py-3 px-4 rounded-xl transition-colors text-left cursor-pointer"
                    >
                      <Smartphone className="w-5 h-5 shrink-0" />
                      <div>
                        <span className="block text-[10px] text-gray-400 leading-none">Get it on</span>
                        <span className="block text-sm font-bold leading-tight">Google Play</span>
                      </div>
                    </button>
                  </div>

                  <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-primary-600/30 rounded-full blur-3xl pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeContent;
