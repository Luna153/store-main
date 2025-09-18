// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const { data: { user } } = await supabase.auth.getUser();

  const publicRoutes = ['/auth/signin', '/auth/signup'];
  const isPublicRoute = publicRoutes.includes(req.nextUrl.pathname);

  // 如果使用者已登入，且正在訪問公共路由，將他們導向會員中心
  if (user && isPublicRoute) {
    return NextResponse.redirect(new URL('/auth/member', req.url));
  }

  // 如果使用者未登入，且正在訪問非公共路由，將他們導向登入頁面
  if (!user && !isPublicRoute) {
    return NextResponse.redirect(new URL('/auth/signin', req.url));
  }

  return res;
}

// 設定中介層要匹配哪些路徑
export const config = {
  // 使用正則表達式來匹配所有路徑，除了 _next/static, _next/image, 和 favicon.ico
  // 這樣你的靜態資源和 API 路由就不會受到影響
  // matcher: ['/((?!api|_next/static|_next/image|favicon.ico|auth).*)'],
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
  // matcher: ['/auth/member','/'],
    // matcher: ['/auth/member', '/dashboard', '/profile'],
};