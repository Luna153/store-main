// useAuth.ts - 負責處理邏輯的 Hook
'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { createClient } from '@/lib/supabase/client';

export function useAuth() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const supabase = createClient();
    const router = useRouter();


    // 註冊
    const signUp = async (email: string, password: string, user_name: string) => {

        setLoading(true);

        // 1. 呼叫 Supabase Auth 註冊，這會自動在 auth.users 建立新使用者
        const { data: userData, error: authError } = await supabase.auth.signUp({
            email,
            password
        });

        if (authError) {
            setLoading(false);
            return { success: false, error: authError.message };
        }

        // 2. 如果 Auth 註冊成功，取得新使用者的 ID
        const userId = userData?.user?.id;
        if (!userId) {
            setLoading(false);
            return { success: false, error: "無法獲取使用者 ID。" };
        }

        // 3. 使用 insert() 函式將 user_name 和 userId 寫入你的 MemberTable
        //    這裡的表格名稱請確保和你的資料庫中完全一致
        const { data: memberData, error: memberError } = await supabase
            .from('MemberTable')
            .insert({ id: userId, user_name: user_name });

        setLoading(false);

        if (memberError) {
            return { success: false, error: memberError.message };
        }

        // 4. 所有步驟都成功，回傳成功訊息
        return { success: true };
    };
    // 登入
    const signIn = async (email: string, password: string) => {
        setLoading(true);
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            // 登入失敗，回傳錯誤訊息
            return { success: false, error: error.message };
        }
        if (data?.user && data?.session) {
            // 登入成功，回傳成功狀態
            return { success: true };
        }

        // 處理其他未預期的情況
        return { success: false, error: '登入失敗，請稍後再試。' };
    };
    // 登出
    const signOut = async () => {
        await supabase.auth.signOut();
        console.log('登出成功');
        router.push('/auth/signin');
    };

    return { signUp, signIn, signOut, loading, error };
}