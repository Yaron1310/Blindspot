import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { getAuthUser } from '@/lib/auth';
import type { Gamezone } from '@/lib/types';

async function getUserGamezones(userId: string): Promise<Gamezone[]> {
  return await redis.get<Gamezone[]>(`user:${userId}:gamezones`) ?? [];
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = getAuthUser(request);
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const gamezones = await getUserGamezones(user.userId);
  const gz = gamezones.find((g) => g.id === params.id);
  if (!gz) return NextResponse.json({ error: 'Gamezone not found' }, { status: 404 });

  return NextResponse.json(gz);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = getAuthUser(request);
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const body = await request.json() as { name?: string; categories?: Gamezone['categories'] };

  const gamezones = await getUserGamezones(user.userId);
  const idx = gamezones.findIndex((g) => g.id === params.id);
  if (idx === -1) return NextResponse.json({ error: 'Gamezone not found' }, { status: 404 });

  if (body.name !== undefined) gamezones[idx].name = body.name.trim();
  if (body.categories !== undefined) {
    for (const cat of body.categories) {
      if (!cat.words || cat.words.length < 2) {
        return NextResponse.json({ error: `Category "${cat.name}" must have at least 2 words` }, { status: 400 });
      }
    }
    gamezones[idx].categories = body.categories;
  }

  await redis.set(`user:${user.userId}:gamezones`, gamezones);
  return NextResponse.json(gamezones[idx]);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = getAuthUser(request);
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const gamezones = await getUserGamezones(user.userId);
  const filtered = gamezones.filter((g) => g.id !== params.id);
  if (filtered.length === gamezones.length) {
    return NextResponse.json({ error: 'Gamezone not found' }, { status: 404 });
  }

  await redis.set(`user:${user.userId}:gamezones`, filtered);
  return NextResponse.json({ ok: true });
}
