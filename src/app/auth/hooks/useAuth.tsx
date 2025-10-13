// useAuth.ts - 負責處理邏輯的 Hook
'use client';
import { createContext, useContext, ReactNode, useState, useEffect, } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { success } from 'zod';
// import { tr } from 'zod/v4/locales';
// import { Menbere } from 'next/font/google';

// ====================================================================
// 1. 類型定義 (請在 '@/types/auth' 中實際定義)
// ====================================================================
interface UserProfile {
    id: string,
    email: string,
    name: string,
    created_at: string;
}

// Context 提供的核心資料和函式 (所有操作都放在這裡)
interface AuthContextType {
    profile: UserProfile | null;
    isLoading: boolean;
    queryData: () => Promise<void>;
    signOut: () => Promise<void>;

    // 認證操作
    signUp: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string; }>;
    signInWithGoogle: () => Promise<{ success: boolean; error?: string; }>;
    signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string; }>;
    forgottenPassword: (email: string) => Promise<{ success: boolean; error?: string; }>;

    // 會員資料操作
    updatePassword: (password: string) => Promise<{ success: boolean; error?: string; }>;
    updateName: (name: string) => Promise<{ success: boolean; error?: string; }>;
}

// ====================================================================
// 2. 創建 Context 和 useAuth Hook
// ====================================================================
export const AuthContext = createContext<AuthContextType | null>(null);

//  useAuth Hook：在任何客戶端元件中存取認證狀態和函式
export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);

    if (context == null) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}

// ====================================================================
// 3. Auth Provider 元件 (核心邏輯)
// ====================================================================
interface AuthProviderProps {
    children: ReactNode;
}


export function AuthProvider({ children }: AuthProviderProps) {
    // Context 核心狀態
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // 依賴
    const supabase = createClient();
    const router = useRouter();

    // ----------------------------------------------------
    // Context 核心函式：查詢會員資料 (Context 內部狀態更新器)
    // ----------------------------------------------------

    const queryData = async () => {
        // 取得 Supabase 認證的使用者物件 (包含uuid 、 email)
        const { data: userData } = await supabase.auth.getUser();
        // console.log(userData);
        if (!userData.user) {
            setProfile(null);
            setIsLoading(false);
            router.refresh();
            console.log('未找到登入使用者或獲取使用者資訊失敗');
            // console.error('未找到登入使用者或獲取使用者資訊失敗', userError);
            return;
        }

        const user = userData.user; // Supabase 的使用者物件

        // 查詢MemberTable (獲取name, created_at...)
        // RLS通常只會返回一行, 可以透過.select().limit(1)優化
        let { data: MemberTable, error: memberError } = await supabase
            .from('MemberTable')
            .select('*')
            .limit(1);

        if (memberError || !MemberTable || MemberTable.length == 0) {
            console.error('查詢 MemberTable 失敗或無資料', memberError);
            // 雖然登入，但無 profile，可以選擇 setProfile(null) 
            // 或只顯示 email，這裡選擇清空 profile
            setProfile(null);
            setIsLoading(false);
            return;
        }

        const memberData = MemberTable[0];

        // 更新核心狀態
        const fullProfile: UserProfile = {
            id: memberData.id,
            email: user.email,
            name: memberData.name,
            created_at: memberData.created_at
        };
        // console.log(fullProfile)

        setProfile(fullProfile);
        setIsLoading(false);
    };
    // ----------------------------------------------------
    // Context 核心函式：登出
    // ----------------------------------------------------
    const signOut = async () => {
        await supabase.auth.signOut();
        setProfile(null); // 登出時清空 profile 狀態
        router.push('/');
        console.log('登出成功');
    };

    // ----------------------------------------------------
    // Context 核心函式：登入/註冊/更新邏輯
    // ----------------------------------------------------
    // 註冊
    const signUp = async (name: string, email: string, password: string) => {
        let { data, error } = await supabase.auth.signUp({
            email,
            password
        });

        if (error) {
            return { success: false, error: error.message };
        } else {
            const userId = data?.user.id;

            let { data: memberData, error: memberError } = await supabase
                .from('MemberTable')
                .insert({ id: userId, name: name });


            if (memberError) {
                return { success: false, error: memberError.message };
            } else {
                router.push('/account');
                return { success: true };
            }
        }
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
        } else {
            console.log('登入成功');
            await queryData();
            // console.log(profile)
            router.refresh();
            return { success: true };
        }

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
    const updatePassword = async (password: string) => {

        const { data, error } = await supabase.auth.updateUser({
            password: password,
        });

        if (error) {
            console.log('更新密碼錯誤');
            // setError(error.message)
            return { success: false, errorMessage: error.message };
        } else {
            console.log('更新密碼');
            // await new Promise(resolve => setTimeout(resolve, 1000)); // 模擬網路延遲
            return { success: true };
        }
    };
    // 編輯會員名稱
    const updateName = async (name: string) => {
        const { data, error } = await supabase
            .from('MemberTable')
            .update({ name: name })
            .eq('id', profile.id)
            .select();

        if (error) {
            console.log('更改名稱錯誤');
            return { success: false, errorMessage: error.message };
        } else {
            console.log('更改名稱成功');
            return { success: true };
        }
    };

    // ----------------------------------------------------
    // Context 核心 Effect：自動同步狀態
    // ----------------------------------------------------
    useEffect(() => {
        // 第一次載入時, 嘗試獲取當前登入的使用資料
        queryData();

        // 監聽 Supabase 的認證狀態變化
        const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
            // 只要認證狀態發生變化, 就重新查詢資料
            if (event == 'SIGNED_IN' || event == 'SIGNED_OUT' || event == 'USER_UPDATED') {
                queryData();
            }
        });

        // 清理函數: 在元件卸載時即移除監聽器
        return () => {
            authListener.subscription.unsubscribe();
        };

        // 依賴 [queryData] 確保當 queryData 改變時( 理論上不會 ), effect 會重新執行
        // 依賴 router 僅用於 Next.js環境, 確保 useEffect 在必要時重新啟動
    }, [router]);

    // ----------------------------------------------------
    // Context Value
    // ----------------------------------------------------
    const value: AuthContextType = {
        profile,
        isLoading,
        queryData,
        signOut,
        // 所有操作函式

        signUp,
        signInWithGoogle,
        signIn,
        forgottenPassword,
        updatePassword,
        updateName,
    };

    // AuthContext
    return (
        <AuthContext.Provider value={value}>
            {/* {children} */}
            {isLoading && !profile ? <div>驗證中, 請稍後...</div> : children}
        </AuthContext.Provider>
    );
}

// export function useAuth() {
//     // 1. 使用 useContext 取得 AuthProvider 提供的 value
//     const context = useContext(AuthContext);

//     // 錯誤檢查：確保 Hook 被使用在 Provider 內部
//     if (context == null) {
//         throw new Error('useAuth must be used within an AuthProvider');
//     }

//     // 從 Context 取得狀態和函式
//     const { profile, queryData, signOut } = context;


//     // 從 Hook 內部取得額外依賴
//     // const [error, setError] = useState<string | null>(null);
//     const supabase = createClient();
//     const router = useRouter();

//     // 註冊
//     const signUp = async (name: string, email: string, password: string) => {
//         // 1. 呼叫 Supabase Auth 註冊，這會自動在 auth.users 建立新使用者
//         let { data: signupData, error: signupError } = await supabase.auth.signUp({
//             email,
//             password
//         });

//         if (signupError) {
//             return { signupError: signupError.message };
//         }

//         // 2. 如果 Auth 註冊成功，取得新使用者的 ID
//         const userId = signupData?.user.id;
//         let { data: insertData, error: insertError } = await supabase
//             .from('MemberTable')
//             .insert({ id: userId, name: name },);

//         if (insertError) {
//             return { insertFail: insertError.message };
//         } else {
//             // 3. 所有步驟都成功，回傳成功訊息
//             router.push('/account');
//             return { success: true };
//         }
//     };

//     // 第三方註冊 (google)
//     const signInWithGoogle = async () => {
//         let { data, error } = await supabase.auth.signInWithOAuth({
//             provider: 'google',
//             options: {
//                 redirectTo: `${window.location.origin}/auth/callback`,

//                 // 用來請求 Google 授權範圍:獲取 Email 和基本 Profile 資訊
//                 scopes: 'email profile'
//             }
//         });

//         if (error) {
//             console.error('Google 註冊失敗', error.message);
//             return { success: false, error: error.message };
//         }

//         // data包含一個 url, 瀏覽器會自動跳轉到 Google 登入頁
//         if (data.url) {

//             console.log(data);
//             window.location.href = data.url;
//             return { success: true };
//         }
//     };
//     // 登入
//     const signIn = async (email: string, password: string) => {
//         let { data, error } = await supabase.auth.signInWithPassword({
//             email,
//             password,
//         });

//         if (error) {
//             console.log('登入失敗');
//             // 登入失敗，回傳錯誤訊息
//             return { success: false, error: error.message };
//         } else {
//             console.log('登入成功');
//             await queryData();
//             // console.log(profile)
//             router.refresh();
//             return { success: true };
//         }

//     };


//     // 忘記密碼(寄驗證信)
//     const forgottenPassword = async (email: string) => {

//         let { data, error } = await supabase.auth.resetPasswordForEmail(email, {
//             // 關鍵：設定重設密碼後要導向的頁面 URL
//             redirectTo: `${window.location.origin}/updatePassword`,
//         });

//         if (error) {
//             // 寄送email失敗，回傳錯誤訊息
//             return { success: false, error: error.message };
//         }
//         else if (data) {
//             console.log(data);
//         }
//     };

//     // 更新密碼
//     const updatePassword = async (password: string) => {

//         const { data, error } = await supabase.auth.updateUser({
//             password: password,
//         });

//         if (error) {
//             console.log('更新密碼錯誤');
//             // setError(error.message)
//             return { success: false, errorMessage: error.message };
//         } else {
//             console.log('更新密碼');
//             // await new Promise(resolve => setTimeout(resolve, 1000)); // 模擬網路延遲
//             return { success: true };
//         }
//     };
//     // 編輯會員名稱
//     const updateName = async (name: string) => {
//         const { data, error } = await supabase
//             .from('MemberTable')
//             .update({ name: name })
//             .eq('id', profile.id)
//             .select();

//         if (error) {
//             console.log('更改名稱錯誤');
//             return { success: false, errorMessage: error.message };
//         } else {
//             console.log('更改名稱成功');
//             return { success: true };
//         }
//     };


//     // 最終返回所有狀態和函式
//     return {
//         profile,    // 👈 這是來自 Context 的會員資料
//         queryData,  // 👈 這是來自 Context 的查詢函式
//         signOut,    // 👈 這是來自 Context 的登出函式
//         signUp,     // 👈 這是 Hook 內部的註冊函式
//         signIn,     // 👈 這是 Hook 內部的登入函式
//         forgottenPassword,
//         updatePassword,
//         updateName,
//         signInWithGoogle,
//         // error,
//     };
// }