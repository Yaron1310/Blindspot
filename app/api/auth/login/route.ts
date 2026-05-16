import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { verifyPassword, signToken, COOKIE_NAME } from '@/lib/auth';
import type { UserRecord } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { email?: string; password?: string };
    const { email: rawEmail, password } = body;

    if (!rawEmail || !password) {
      return NextResponse.json({ error: 'email and password are required' }, { status: 400 });
    }

    const email = rawEmail.trim().toLowerCase();

    const userId = await redis.get<string>(`user:email:${email}`);
    if (!userId) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const user = await redis.get<UserRecord>(`user:id:${userId}`);
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const token = signToken({ userId: user.id, username: user.username, email: user.email });

    const response = NextResponse.json({ ok: true, username: user.username });
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
    return response;
  } catch (err) {
    console.error('POST /api/auth/login error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
