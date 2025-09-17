// // middleware.ts
// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';

// export function middleware(request: NextRequest) {
//   // 你的中介層邏輯
//   console.log('Middleware is running!');

//   // 必須回傳一個 Response 物件
//   return NextResponse.next();
// }

// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  // 建立一個 Next.js Response 物件
  const res = NextResponse.next();

  // 建立 Supabase 中介層客戶端，並將請求和回應傳入
  const supabase = createMiddlewareClient({ req, res });

  // 刷新 Session，確保 token 是最新的
  // 這個步驟非常重要，它會檢查瀏覽器中的 cookie
  // 並在需要時更新 session
  await supabase.auth.getSession();

  // 如果使用者未登入，且正在訪問的不是登入頁面
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const protectedRoutes = ['/protected', '/dashboard', '/profile']; // 這裡填入所有需要保護的路由
  const isProtectedRoute = protectedRoutes.includes(req.nextUrl.pathname);

  if (!session && isProtectedRoute) {
    console.log(session)
    // 重新導向到登入頁面
    return NextResponse.redirect(new URL('/auth/signIn', req.url));
  }

  // 繼續執行請求，傳回 Next.js 的 Response 物件
  return res;
}

// 設定中介層要匹配哪些路徑
export const config = {
  // 使用正則表達式來匹配所有路徑，除了 _next/static, _next/image, 和 favicon.ico
  // 這樣你的靜態資源和 API 路由就不會受到影響
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|auth).*)'],
};