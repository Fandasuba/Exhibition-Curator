import { NextRequest, NextResponse } from 'next/server';
import { updateSession } from './app/lib/session';

export async function middleware(request: NextRequest) {
return await updateSession(request);
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
  // The regex is looking for api directory so it can ping the me folder and keep those cookies up to date. It alos pings optimised images for easy loading, which is handy for the thumbnails that keep appearing from the front end.
};