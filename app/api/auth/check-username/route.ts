import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { isValidUsername } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { username?: string };
    const username = body.username?.trim().toLowerCase();

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    if (!isValidUsername(username)) {
      return NextResponse.json({ error: 'Username must be 3–20 chars, letters, numbers, hyphens only' }, { status: 400 });
    }

    const existing = await redis.get<string>(`user:username:${username}`);
    if (existing) {
      return NextResponse.json({ error: 'This username is already taken' }, { status: 409 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('POST /api/auth/check-username error:', err);
    return NextResponse.json({ error: 'Failed to check username' }, { status: 500 });
  }
}
