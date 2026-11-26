import type { Metadata } from 'next';
import HomeContent from '@/components/home/HomeContent';

export const metadata: Metadata = {
  title: 'FreshCart - Your Online Supermarket | Organic Groceries & More',
  description:
    'Shop fresh groceries, electronics, and daily essentials with express 2-hour delivery at competitive prices.',
};

export default function HomePage() {
  return <HomeContent />;
}
