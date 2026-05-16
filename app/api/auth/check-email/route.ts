import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { email?: string };
    const email = body.email?.trim().toLowerCase();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    const existing = await redis.get<string>(`user:email:${email}`);
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('POST /api/auth/check-email error:', err);
    return NextResponse.json({ error: 'Failed to check email' }, { status: 500 });
  }
}
