import { SignJWT, jwtVerify, JWTPayload } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const secretKey = process.env.SESSION_SECRET;

// Only throw error at runtime, not during build
const getKey = () => {
  if (!secretKey) {
    throw new Error('SESSION_SECRET environment variable is not set');
  }
  return new TextEncoder().encode(secretKey);
};

// Use a safe fallback during build time
const key = secretKey ? new TextEncoder().encode(secretKey) : new TextEncoder().encode('build-time-fallback-key');

interface SessionPayload extends JWTPayload {
  userId: string;
  username: string;
  email: string;
  expiresAt: string;
}

export async function encrypt(payload: Omit<SessionPayload, 'iat' | 'exp'>): Promise<string> {
  const safeKey = getKey(); // This will throw at runtime if needed
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(safeKey);
}

export async function decrypt(token: string): Promise<SessionPayload | null> {
  try {
    const safeKey = getKey(); // This will throw at runtime if needed
    const { payload } = await jwtVerify(token, safeKey, {
      algorithms: ['HS256'],
    });
    return payload as SessionPayload;
  } catch (error) {
    console.error("Error Decrypting. Reason:", error)
    return null;
  }
}

export async function createSession(userId: string, username: string, email: string): Promise<void> {
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours
  const session = await encrypt({ userId, username, email, expiresAt });
  (await cookies()).set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(expiresAt),
    sameSite: 'lax',
    path: '/',
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const sessionCookies = cookieStore.get('session')?.value;
  if (!sessionCookies) return null;
  const session = await decrypt(sessionCookies);
  if (!session) return null;
  // Check if session is expired
  if (new Date() > new Date(session.expiresAt)) {
    return null;
  }
  return session;
}

export async function deleteSession(): Promise<void> {
  (await cookies()).delete('session');
}

export async function updateSession(request: NextRequest): Promise<NextResponse | void> {
  const sessionCookie = request.cookies.get('session')?.value;
  if (!sessionCookie) return;
  const parsed = await decrypt(sessionCookie);
  if (!parsed) return;
  // Refreshes the cookie session.
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  parsed.expiresAt = expiresAt;
  const response = NextResponse.next();
  response.cookies.set('session', await encrypt(parsed), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(expiresAt),
    sameSite: 'lax',
    path: '/',
  });
  return response;
}