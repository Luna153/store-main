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
    // const {data}=await supabase.auth.getUser();
    // console.log(data)
    const { data: { user } } = await supabase.auth.getUser();
    console.log(user);

    // 取得當前請求路徑
    const path = request.nextUrl.pathname;
    console.log('當前路徑:' + path);

    const protectedPaths = ['/'];

    // 檢查沒有使用者時 自動導入/login
    if (!user && protectedPaths.includes(path)) {
        const url = new URL('/login', request.url);
        return NextResponse.redirect(url);
    }

    return supabaseResponse;
}

// 設定 middleware 作用的範圍
export const config = {
    // matcher: ['/', '/account'],
    matcher: ['/'],
};