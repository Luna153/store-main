'use client';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// 設定你的 Supabase 專案 URL 和 anon key
const supabaseUrl: string = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey: string = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// 初始化 Supabase 客戶端
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

/**
 * 處理使用 Google 登入的函數。
 * 這會將使用者重新導向到 Google 的登入頁面。
 */
export default async function signInWithGoogle(): Promise<void> {

    const { data, error } = await supabase.auth.signInWithOAuth({
        //   const supabase = createClient();
        provider: 'google',
        options: {
            // 登入成功後，你可以選擇將使用者重新導向到特定的 URL。
            // 這個 URL 必須在 Supabase 儀表板中設定為允許的重新導向 URL。
            // redirectTo: `${location.origin}`,
            redirectTo: `${location.origin}/auth/callback`,
        }
    });

    if (error) {
        console.error('Google 登入時發生錯誤:', error);
        alert(`登入錯誤：${error.message}`);
    } else {
        console.log('正在重新導向到 Google 登入頁面...');
        
    }
    
}



// 假設你在 HTML 中有一個按鈕，你可以這樣綁定事件：
// <button id="google-signin-btn">使用 Google 登入</button>
//
// 在你的 TypeScript/JavaScript 檔案中：
// document.getElementById('google-signin-btn')?.addEventListener('click', signInWithGoogle);