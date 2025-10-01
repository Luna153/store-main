// /middleware.ts
import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
    console.log('middleware running');
    let supabaseResponse = NextResponse.next({
        request,
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
                    supabaseResponse = NextResponse.next({
                        request,
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    // refreshing the auth token
    const { data: { user } } = await supabase.auth.getUser();
    // console.log(user)

    // 取得當前請求路徑
    const path = request.nextUrl.pathname;


    // 定義所有「不需登入」即可存取的路徑 (包含登入、註冊、忘記密碼)
    const publicPaths = ['/login', '/signup', '/forgottenPassword', '/updatePassword'];

    // 判斷當前路徑是否為公用路徑
    const isPublicPath = publicPaths.includes(path);

  // 判斷當前路徑是否為需要保護的路徑 (例如：會員中心、首頁)
    const protectedPaths = ['/'];

    // 檢查沒有使用者時 自動導入/login
    if (!user && protectedPaths.includes(path)) {
        // console.log('沒有使用者')
        const url = new URL('/login', request.url);
        return NextResponse.redirect(url);
    }

    // 如果使用者已登入，且正在存取公用認證頁 (可選：導回首頁)
    if (user && isPublicPath) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return supabaseResponse;
}

// 設定 middleware 作用的範圍
export const config = {
    // 匹配除了 _next/static, _next/image, favicon.ico, /login, /signup 等之外的所有路徑
    matcher: [
        // 匹配所有路徑，除了明確列出的：
        // 排除 _next, api, static 等內建資料夾
        '/((?!_next/static|_next/image|favicon.ico|api).*)',
        // 排除公開的根路徑：
        '/((?!login|signup|forgottenPassword|updatePassword).*)'
    ],
};