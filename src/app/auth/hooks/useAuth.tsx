// useAuth.ts - 負責處理邏輯的 Hook
'use client';
import { createContext, useContext, ReactNode, useState, useEffect, } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { tr } from 'zod/v4/locales';
// import { Menbere } from 'next/font/google';

// 1. 定義資料結構
interface UserProfile {
    id: string,
    email: string,
    name: string,
    created_at: string;
}
// 2. 定義 Context 提供的型別
interface AuthContextType {
    profile: UserProfile | null;
    queryData: () => Promise<void>;
    signOut: () => Promise<void>;
    signUp: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string; insertFail?: string; signupError?: string; }>;
    signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string; }>;
    forgottenPassword: (email: string) => Promise<{ success: boolean; error?: string; }>;
}

interface AuthProviderProps {
    children: ReactNode;
}


// 3. 建立 Context 物件，初始值為 null (因為 Context 必須在 Provider 內使用)
// 我們將所有核心函式和狀態都納入此處
const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: AuthProviderProps) {
    // Context 核心狀態：會員資料
    const [profile, setProfile] = useState<UserProfile | null>(null);

    const supabase = createClient();
    const router = useRouter();


    // Context 核心函式：查詢會員資料
    const queryData = async () => {
        // 取得 Supabase 認證的使用者物件 (包含uuid 、 email)
        const { data: userData, error: userError } = await supabase.auth.getUser();
        // console.log(userData);
        if (userError || !userData.user) {
            // 如果發生錯誤或沒有登入, 則清空 profile
            setProfile(null);
            console.log('未找到登入使用者或獲取使用者資訊失敗');
            // console.error('未找到登入使用者或獲取使用者資訊失敗', userError);
            return;
        }

        const user = userData.user; // Supabase 的使用者物件

        // 查詢MemberTable (獲取name, created_at...)
        // RLS通常只會返回一行, 可以透過.select().limit(1)優化
        let { data: MemberTable, error: memberError } = await supabase
            .from('MemberTable')
            .select('*');
        // .limit(1);

        if (memberError || !MemberTable || MemberTable.length == 0) {
            console.error('查詢 MemberTable 失敗或無資料', memberError);
            // 這裡可以選擇將 profile 設為 null 或只顯示 email
            setProfile(null);
            return;
        }

        const memberData = MemberTable[0];

        const fullProfile: UserProfile = {
            id: memberData.id,
            email: user.email,
            name: memberData.name,
            created_at: memberData.created_at
        };

        setProfile(fullProfile);
    };

    // Context 核心函式：登出
    const signOut = async () => {
        await supabase.auth.signOut();
        setProfile(null); // 登出時清空 profile 狀態
        router.push('/');
        console.log('登出成功');
    };


    // Context 核心函式：註冊 (將 signUp 邏輯移動到此處或保持在 useAuth)
    // 為了結構清晰，這裡先保留在 useAuth 內部，只在 Context 中提供狀態和輔助函式。
    // 註冊和登入邏輯保持在 useAuth 內，但需確保它們在成功後能呼叫 queryData。

    // 這裡我們暫時只提供狀態和 queryData/signOut，讓 useAuth 實現其餘的功能
    const value = { profile, queryData, signOut, } as AuthContextType;

    // AuthContext
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    // 1. 使用 useContext 取得 AuthProvider 提供的 value
    const context = useContext(AuthContext);

    // 錯誤檢查：確保 Hook 被使用在 Provider 內部
    if (context == null) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    // 從 Context 取得狀態和函式
    const { profile, queryData, signOut } = context;


    // 從 Hook 內部取得額外依賴
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
            console.log('登入失敗');
            // 登入失敗，回傳錯誤訊息
            return { success: false, error: error.message };
        }

        if (data) {
            console.log('登入成功');
            // queryData();
            await queryData();
            router.push('/account');
            // console.log(data);
        }
        if (data?.user && data?.session) {
            return { success: true };
        }

        // 處理其他未預期的情況
        // return { success: false, error: '登入失敗，請稍後再試。' };
    };

    // 忘記密碼(寄驗證信)
    const forgottenPassword = async (email: string) => {

        let { data, error } = await supabase.auth.resetPasswordForEmail(email, {
            // 關鍵：設定重設密碼後要導向的頁面 URL
            redirectTo: `${window.location.origin}/updatePassword`,
        });

        if (error) {
            // 寄送email失敗，回傳錯誤訊息
            return { success: false, error: error.message };
        }
        else if (data) {
            console.log(data);
        }
    };

    // 更新密碼
    const updateProfile = async (name:string, password: string) => {

        const { data: updatePassword, error: updatePasswordError } = await supabase.auth.updateUser({
            password: password,
            data: { hello: 'world' }
        });

        let { data: updateName, error: updateNameError } = await supabase
            .from('MemberTable')
            .update({ name: name })
            .eq('id',profile.id)
            .select();


        if (updatePasswordError || updateNameError) {
            console.log('更新密碼錯誤');
            console.log(updatePasswordError)
            console.log(updateNameError)
        } else if (updatePassword && updateName) {
            console.log('更新密碼');
            console.log(`newPassword:${updatePassword} newName:${updateName}`);
            // router.push('/');
        }

        await new Promise(resolve => setTimeout(resolve, 1000)); // 模擬網路延遲
        return { success: true };

    };

    // 第三方註冊 (google)
    const signInWithGoogle = async () => {
        let { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,

                // 用來請求 Google 授權範圍:獲取 Email 和基本 Profile 資訊
                scopes: 'email profile'
            }
        });

        if (error) {
            console.error('Google 註冊失敗', error.message);
            return { success: false, error: error.message };
        }

        // data包含一個 url, 瀏覽器會自動跳轉到 Google 登入頁
        if (data.url) {

            console.log(data);
            window.location.href = data.url;
            return { success: true };
        }
    };

    // 最終返回所有狀態和函式
    return {
        profile,    // 👈 這是來自 Context 的會員資料
        queryData,  // 👈 這是來自 Context 的查詢函式
        signOut,    // 👈 這是來自 Context 的登出函式
        signUp,     // 👈 這是 Hook 內部的註冊函式
        signIn,     // 👈 這是 Hook 內部的登入函式
        forgottenPassword,
        updateProfile,
        signInWithGoogle,
        error,
    };
}