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
  console.log('Middleware is running!');
  // 建立一個 Next.js Response 物件
  const res = NextResponse.next();
  // console.log(res);

  // 建立 Supabase 中介層客戶端，並將請求和回應傳入
  const supabase = createMiddlewareClient({ req, res });


  // 如果使用者未登入，且正在訪問的不是登入頁面
  const {
    data: { user },
  } = await supabase.auth.getUser();
  // console.log(user)


  const path = req.nextUrl.pathname;
  // 判斷是否為公共路由，這裡需要精準判斷
  const isPublicRoute = path === '/auth/signin' || path === '/auth/signup';

  console.log(`path:${path}   ---------------- `);
  // 如果使用者已登入，且正在訪問登入或註冊頁面，將他們導向到會員中心
  if (user && isPublicRoute) {
    return NextResponse.redirect(new URL('/auth/member', req.url));
  }


  // 如果使用者未登入，且正在訪問非公共路由，將他們導向登入頁面
  if (!user && !isPublicRoute) {
    return NextResponse.redirect(new URL('/auth/signin', req.url));
  }

  // 繼續執行請求，傳回 Next.js 的 Response 物件
  return res;
}

// 設定中介層要匹配哪些路徑
export const config = {
  // 使用正則表達式來匹配所有路徑，除了 _next/static, _next/image, 和 favicon.ico
  // 這樣你的靜態資源和 API 路由就不會受到影響
  // matcher: ['/((?!api|_next/static|_next/image|favicon.ico|auth).*)'],
  // matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
  matcher: ['/auth/member'],
};