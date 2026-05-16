import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET!;
export const COOKIE_NAME = 'bs_token';

export function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

export function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export interface TokenPayload {
  userId: string;
  username: string;
  email: string;
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export function getAuthUser(request: NextRequest): TokenPayload | null {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export const RESERVED_USERNAMES = new Set([
  'rooms', 'login', 'signup', 'dashboard', 'api', 'u',
]);

export function isValidUsername(username: string): boolean {
  return (
    username.length >= 3 &&
    username.length <= 20 &&
    /^[a-z0-9-]+$/.test(username) &&
    !RESERVED_USERNAMES.has(username)
  );
}
