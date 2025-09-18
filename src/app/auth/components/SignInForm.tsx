"use client";

import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth'; // 註冊
import Link from 'next/link';
import { useSessionContext } from '@supabase/auth-helpers-react';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const FormSchema = z.object({
    email: z.string().email({
        message: "請輸入有效的電子郵件地址。",
    }),
    password: z.string().min(8, {
        message: "密碼必須至少 8 個字元。",
    }),
});


export default function SignInForm() {
    const { signIn } = useAuth(); // 使用 useAuth Hook
    const router = useRouter();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: '',
            password: "",
        },
    });

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        toast("登入成功！", { description: "歡迎回來！" });
        // console.log(data);

        const result = await signIn(data.email, data.password);
        // console.log(result);

        if (result.success) {
            // console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
            toast("登入成功！", { description: "歡迎回來！" });
            form.reset();
            router.push('/auth/member')
            // router.refresh();
        } else {
            toast("登入失敗。", { description: result.error || '發生未知錯誤' });
        }

    }

    return (
        <>
            <div className="w-full px-20 mt-20">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="This is your public display name." {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input placeholder="This is your public display name." {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <Button type="submit">SignIn</Button>
                        <Link className='ml-5' href='/auth/signup'>SignUp</Link>

                    </form>
                </Form>
            </div>
        </>
    );
}
