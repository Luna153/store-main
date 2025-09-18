// // app/profile/edit-form.tsx (這是客戶端元件)
// 'use client';
// import { useState, useEffect } from 'react';
// import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
// import SignOutButton from '../components/SignOutButton';
// import { UserAttributes } from '@supabase/supabase-js'; // 導入 User 類型
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { toast } from "sonner";
// import { z } from "zod";

// import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";






// export default function MemberPage() {
//     const FormSchema = z.object({
//         username: z.string().min(2, {
//             message: "Username must be at least 2 characters.",
//         }),
//     });
//     const [user, setUser] = useState<UserAttributes | null>(null);
//     const supabase = createClientComponentClient();

//     useEffect(() => {
//         async function fetchUser() {
//             const { data: { user } } = await supabase.auth.getUser();
//             setUser(user);
//         }
//         fetchUser();
//     }, [supabase]);




//     const form = useForm<z.infer<typeof FormSchema>>({
//         resolver: zodResolver(FormSchema),
//         defaultValues: {
//             username: "",
//         },
//     });

//     function onSubmit(data: z.infer<typeof FormSchema>) {
//         toast("You submitted the following values", {
//             description: (
//                 <pre className="mt-2 w-[320px] rounded-md bg-neutral-950 p-4">
//                     <code className="text-white">{JSON.stringify(data, null, 2)}</code>
//                 </pre>
//             ),
//         });
//     }
//     if (!user) {
//         return <div>載入中...</div>;
//     }
//     return (
//         <>
//             <div>
//                 <div className="w-full px-20 mt-20">
//                     <h1>歡迎，{user.password} {user.email} ！</h1>
//                     <Form {...form}>
//                         {/* <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6"> */}
//                         <FormField
//                             control={form.control}
//                             name="username"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>Username</FormLabel>
//                                     <FormControl>
//                                         <Input placeholder="shadcn" {...field} />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />
//                         <div className='mt-5'></div>
//                         <Button type="submit" className='mr-5'>Update</Button>
//                         {/* </form> */}
//                         <SignOutButton />
//                     </Form>
//                 </div>

//             </div>
//         </>
//     );
// }

// app/auth/member/page.tsx (伺服器元件範例)
// 'use client'
// import { useState } from "react";
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import SignOutButton from '../components/SignOutButton';
import { updateUserProfile } from '../components/UpdateProfileForm';
import { Button } from "@/components/ui/button";
import InputForm2 from "@/app/components/InputForm2";
// import { Input } from "@/components/ui/input";

export default async function MemberPage() {
    const supabase = createServerComponentClient({ cookies });
    // const [newUserName,setUserName]=useState('')
    // const [newPassword,setPassword]=useState('')
    // const [newEmail,setEmail]=useState('')

    // 1. 取得登入的使用者資訊
    const { data: { user } } = await supabase.auth.getUser();
    // console.log(user)

    if (!user) {
        redirect('/auth/signin');
    }

    // 2. 使用 user.id 查詢 profiles 表格
    const { data: profile, error } = await supabase
        .from('MemberTable') // 你的表格名稱
        .select('user_name') // 查詢你需要的欄位
        .eq('id', user.id) // 透過 user.id 來找到對應的資料
        .single(); // 確保只回傳一筆資料
    // console.log(data);
    //     console.log('查詢結果:', profile);
    // console.log('查詢錯誤:', error);


    if (error) {
        // 處理錯誤，例如資料不存在或查詢失敗
        console.error('查詢個人資料失敗:', error);
        return <div>無法取得使用者資料。</div>;
    }

    // 3. 現在你可以取得使用者的 name
    const userName = profile.user_name;
    // updateUserProfile();
    return (
        <>
            <div>
                <h1>歡迎，{userName}！</h1>
                <p>您的電子郵件是：{user.email}</p>
                <SignOutButton />
                <InputForm2 userId={user.id} userName={userName}/>
            {/* <Input 
                type="text" 
                placeholder="Enter new user name" 
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
            /> */}
            {/* <Button onClick={()=>updateUserProfile(user.id,newUserName)}>Save</Button> */}
            </div>

        </>
    );
}