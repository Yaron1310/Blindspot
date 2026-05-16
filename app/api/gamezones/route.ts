import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { getAuthUser } from '@/lib/auth';
import type { Gamezone } from '@/lib/types';

export async function GET(request: NextRequest) {
  const user = getAuthUser(request);
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const gamezones = await redis.get<Gamezone[]>(`user:${user.userId}:gamezones`) ?? [];
  return NextResponse.json(gamezones);
}

export async function POST(request: NextRequest) {
  const user = getAuthUser(request);
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const body = await request.json() as { name?: string };
  const name = body.name?.trim();
  if (!name) return NextResponse.json({ error: 'name is required' }, { status: 400 });

  const gamezones = await redis.get<Gamezone[]>(`user:${user.userId}:gamezones`) ?? [];

  const newGamezone: Gamezone = {
    id: crypto.randomUUID(),
    userId: user.userId,
    name,
    categories: [],
    createdAt: Date.now(),
  };

  gamezones.push(newGamezone);
  await redis.set(`user:${user.userId}:gamezones`, gamezones);

  return NextResponse.json(newGamezone, { status: 201 });
}
