// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 你的中介層邏輯
  console.log('Middleware is running!');

  // 必須回傳一個 Response 物件
  return NextResponse.next();
}