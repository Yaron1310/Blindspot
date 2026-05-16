import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import type { UserRecord, Gamezone } from '@/lib/types';

export async function GET(
  _request: NextRequest,
  { params }: { params: { username: string } }
) {
  const username = params.username.toLowerCase();

  const userId = await redis.get<string>(`user:username:${username}`);
  if (!userId) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const [user, gamezones] = await Promise.all([
    redis.get<UserRecord>(`user:id:${userId}`),
    redis.get<Gamezone[]>(`user:${userId}:gamezones`),
  ]);

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  return NextResponse.json({
    username: user.username,
    gamezones: gamezones ?? [],
  });
}
