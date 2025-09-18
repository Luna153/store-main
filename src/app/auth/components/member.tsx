// app/auth/member/page.tsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import SignOutButton from '../components/SignOutButton';

export default async function Member() {
    // const supabase = await createServerComponentClient({ cookies });
    // const { data: { user } } = await supabase.auth.getUser();


    // 如果沒有 user，直接將使用者導向登入頁
    // if (!user) {
    //     redirect('/auth/signin');
    // }

    // 程式碼到這裡代表使用者已登入，可以安全地渲染會員頁面
    // const userEmail = user.email;
    return (
        <>
            <div>
                {/* <h1>歡迎，{userEmail}</h1> */}
                <p>這是您的會員專屬頁面。</p>
                {/* 這裡可以放你的客戶端元件，例如登出按鈕 */}
            </div>
        </>
    );
}