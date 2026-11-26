import type { Metadata } from 'next';
import { Exo } from 'next/font/google';
import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import './globals.css';
import AppProviders from '@/components/providers/AppProviders';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { DecodedToken, User } from '@/types/api.types';

const exo = Exo({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-exo',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'FreshCart - Your Online Supermarket',
  description: 'Shop fresh groceries, electronics, and daily essentials with fast delivery at competitive prices.',
  icons: {
    icon: '/freshcart-logo.svg',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let initialUser: User | null = null;

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('freshcart_token')?.value;

    if (token) {
      const decoded = jwtDecode<DecodedToken>(token);
      if (!decoded.exp || decoded.exp * 1000 > Date.now()) {
        initialUser = {
          _id: decoded.id || decoded.userId || decoded.user?.id || '',
          name: decoded.name || decoded.user?.name || 'FreshCart User',
          email: decoded.user?.email || '',
          role: decoded.role || decoded.user?.role || 'user',
        };
      }
    }
  } catch {
    initialUser = null;
  }

  return (
    <html lang="en" className={exo.variable}>
      <body className={`${exo.className} font-medium antialiased text-gray-700 bg-white selection:bg-primary-500 selection:text-white`}>
        <AppProviders initialUser={initialUser}>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
