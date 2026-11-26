import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.set('freshcart_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    });
    cookieStore.delete('freshcart_token');

    return NextResponse.json({ status: 'success', message: 'Logged out successfully' });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { message: err.message || 'Failed to logout' },
      { status: 500 }
    );
  }
}
