// app/auth/callback/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function AuthCallbackPage() {
    const router = useRouter();
    const supabase = createClient();


    useEffect(() => {
        const handleAuth = async () => {
            // 透過檢查 session 來確定登入狀態是否已建立
            const { data: { session } } = await supabase.auth.getSession();

            if (session) {
                console.log("Session established successfully.");
                
                // 成功 => 即導航
                router.replace('/account'); // 使用 replace 避免使用者按返回鍵回到 callback 頁
            } else {
                console.error("Session not found after callback.");

                // 失敗 => 導回登入頁
                router.replace('/login');
            }
        };

        handleAuth();
    }, [ router, supabase]);

    // 在處理期間，顯示載入狀態
    return (
        <div style={{ padding: '50px', textAlign: 'center' }}>
            <h1>正在驗證登入資訊...</h1>
            <p>請稍候，您將被自動導向會員頁面。</p>
        </div>
    );
}