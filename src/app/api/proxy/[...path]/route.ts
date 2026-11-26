import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const ROUTE_API_BASE = 'https://ecommerce.routemisr.com/api/v1';

async function handleProxy(req: NextRequest, params: { path: string[] }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('freshcart_token')?.value;

    const pathname = params.path.join('/');
    const search = req.nextUrl.search;
    const targetUrl = `${ROUTE_API_BASE}/${pathname}${search}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['token'] = token;
    }

    const fetchOptions: RequestInit = {
      method: req.method,
      headers,
    };

    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
      try {
        const bodyText = await req.text();
        if (bodyText) {
          fetchOptions.body = bodyText;
        }
      } catch {
        // Empty body is ignored
      }
    }

    const upstreamRes = await fetch(targetUrl, fetchOptions);
    const data = await upstreamRes.text();

    let json;
    try {
      json = JSON.parse(data);
    } catch {
      json = data;
    }

    return NextResponse.json(json, { status: upstreamRes.status });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { status: 'error', message: err.message || 'BFF proxy error' },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const params = await context.params;
  return handleProxy(req, params);
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const params = await context.params;
  return handleProxy(req, params);
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const params = await context.params;
  return handleProxy(req, params);
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const params = await context.params;
  return handleProxy(req, params);
}
