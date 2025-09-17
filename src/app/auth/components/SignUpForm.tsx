"use client";
import { useAuth } from '../hooks/useAuth'; // 註冊
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const FormSchema = z.object({
    email: z.string().email({
        message: "請輸入有效的電子郵件地址。",
    }),
    user_name: z.string().min(2, {
        message: "使用者名稱必須至少 2 個字元。",
    }),
    password: z.string().min(8, {
        message: "密碼必須至少 8 個字元。",
    }),
});


export default function SignUpForm() {

    const { signUp, loading, error } = useAuth(); // 使用 useAuth Hook

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: '',
            password: "",
            user_name: "",
        },
    });

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        console.log(data)

        const result = await signUp(data.email, data.password, data.user_name );

        if (result && result.success) {
            toast("註冊成功！", { description: "請檢查你的電子郵件以驗證帳號。" });
            form.reset();
        } else {
            toast("註冊失敗。", { description: result ? result.error : '發生未知錯誤' });
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
                            name="user_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
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
                        <Button type="submit">Submit</Button>
                    </form>
                </Form>
            </div>
        </>
    );
}
