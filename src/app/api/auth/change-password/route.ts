import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const ROUTE_API_BASE = 'https://ecommerce.routemisr.com/api/v1';

export async function PUT(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const currentToken = cookieStore.get('freshcart_token')?.value;

    if (!currentToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const res = await fetch(`${ROUTE_API_BASE}/users/changeMyPassword`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        token: currentToken,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    if (data.token) {
      cookieStore.set('freshcart_token', data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
      });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { message: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
