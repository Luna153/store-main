// useAuth.ts - 負責處理邏輯的 Hook
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export function useAuth() {
    const [error, setError] = useState<string | null>(null);
    const supabase = createClient();
    const router = useRouter();


    // 註冊
    const signUp = async (name: string, email: string, password: string) => {
        // 1. 呼叫 Supabase Auth 註冊，這會自動在 auth.users 建立新使用者
        let { data: signupData, error: signupError } = await supabase.auth.signUp({
            email,
            password
        });

        if (signupError) {
            return { signupError: signupError.message };
        }

        // 2. 如果 Auth 註冊成功，取得新使用者的 ID
        const userId = signupData?.user.id;
        let { data: insertData, error: insertError } = await supabase
            .from('MemberTable')
            .insert({ id: userId, name: name },);

        if (insertError) {
            return { insertFail: insertError.message };
        } else {
            // 3. 所有步驟都成功，回傳成功訊息
            router.push('/account');
            return { success: true };
        }
    };
    // 登入
    const signIn = async (email: string, password: string) => {
        let { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            // 登入失敗，回傳錯誤訊息
            return { success: false, error: error.message };
        }

        if (data) {
            console.log('登入成功');
            console.log(data);
            router.push('/account');
        }
        if (data?.user && data?.session) {

            // 在導向前先刷新路由
            // router.refresh();
            // 導向到會員頁面
            // router.push('/auth/member');
            // 登入成功，回傳成功狀態
            return { success: true };
        }

        // 處理其他未預期的情況
        // return { success: false, error: '登入失敗，請稍後再試。' };
    };
    // 登出
    const signOut = async () => {
        await supabase.auth.signOut();
        router.push('/');
        console.log('登出成功');
        // router.refresh();
    };
    // 查詢
    const queryData = async () => {
        let { data: MemberTable, error } = await supabase
            .from('MemberTable')
            .select('*');
        console.log(MemberTable);
        // return MemberTable[0].name
    };

    return { signUp, signIn, signOut, queryData, error };
}