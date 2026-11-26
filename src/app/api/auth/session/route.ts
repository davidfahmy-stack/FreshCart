import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';
import { DecodedToken } from '@/types/api.types';

const ROUTE_API_BASE = 'https://ecommerce.routemisr.com/api/v1';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('freshcart_token')?.value;

    if (!token) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    let decoded: DecodedToken;
    try {
      decoded = jwtDecode<DecodedToken>(token);
    } catch {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    if (decoded.exp && decoded.exp * 1000 <= Date.now()) {
      cookieStore.delete('freshcart_token');
      return NextResponse.json({ user: null }, { status: 200 });
    }

    try {
      const verifyRes = await fetch(`${ROUTE_API_BASE}/auth/verifyToken`, {
        headers: {
          token,
        },
        cache: 'no-store',
      });

      if (!verifyRes.ok) {
        cookieStore.delete('freshcart_token');
        return NextResponse.json({ user: null }, { status: 200 });
      }
    } catch {
      // Offline fallback: keep session from valid unexpired JWT
    }

    const userId = decoded.id || decoded.userId || decoded.user?.id || '';
    const name = decoded.name || decoded.user?.name || 'FreshCart User';
    const role = decoded.role || decoded.user?.role || 'user';
    const email = decoded.user?.email || '';

    return NextResponse.json(
      {
        user: {
          _id: userId,
          name,
          email,
          role,
        },
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
