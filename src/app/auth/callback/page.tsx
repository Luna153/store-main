// app/auth/callback/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useAuth } from '../hooks/useAuth'; // 假設您想在登入成功後刷新會員資料

export default function AuthCallbackPage() {
    const router = useRouter();
    const supabase = createClient();
    const { queryData } = useAuth(); // 取得查詢會員資料的函式

    useEffect(() => {
        // 1. 確保 Supabase 客戶端程式碼已運行
        // 雖然 Supabase 會自動處理 URL 中的 Token，但我們仍需主動檢查
        const handleAuth = async () => {
            // 透過檢查 session 來確定登入狀態是否已建立
            const { data: { session } } = await supabase.auth.getSession();
            
            if (session) {
                console.log("Session established successfully.");
                
                // 2. 登入成功後，查詢並更新 Context 中的會員資料 (MemberTable)
                // 這是確保您的 profile 狀態立即更新的關鍵！
                await queryData(); 
                
                // 3. 導向到應用程式的主頁或會員中心
                router.replace('/account'); // 使用 replace 避免使用者按返回鍵回到 callback 頁
            } else {
                // 如果沒有 session，通常表示 Token 處理失敗或流程不完整
                console.error("Session not found after callback.");
                router.replace('/login');
            }
        };

        handleAuth();
    }, [router, queryData, supabase]);

    // 在處理期間，顯示載入狀態
    return (
        <div style={{ padding: '50px', textAlign: 'center' }}>
            <h1>正在驗證登入資訊...</h1>
            <p>請稍候，您將被自動導向會員頁面。</p>
        </div>
    );
}