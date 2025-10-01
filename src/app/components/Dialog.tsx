'use client';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useAuth } from "../auth/hooks/useAuth";
import { useRouter } from "next/router";
import { useState } from "react";


export default function DialogComponent() {
    const { updateProfile, queryData } = useAuth();
    // const router = useRouter();
    const [open, setOpen] = useState(false);
    const [isSubmited, setIsSubmited] = useState(false);

    const FormSchema = z.object({
        newName: z.string().min(2, {
            message: "Username must be at least 2 characters.",
        }),
        newPassword: z.string().min(2, {
            message: "Username must be at least 2 characters.",
        }),
    });

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            newName: "",
            newPassword: "",
        },
    });

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        setIsSubmited(true);

        const result = await updateProfile(data.newName, data.newPassword);

        if (result.success) {
            queryData(); // 重取會員資料

            toast("資料已成功儲存", { description: `名稱: ${data.newName}，密碼已更新。` });

            form.reset();
            setOpen(false);
            setIsSubmited(false)

        } else {
            toast.error("更新失敗", { description: "請檢查網路連線或稍後再試。" });
        }
        // console.log(data);

        form.reset();
        setOpen(false);
        // toast("You submitted the following values", {
        //     description: (
        //         <pre className="mt-2 w-[320px] rounded-md bg-neutral-950 p-4">
        //             <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        //         </pre>
        //     ),
        // });
    }



    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline" className='w-full mt-2'>Edit</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <DialogHeader>
                                <DialogTitle>Edit profile</DialogTitle>
                                <DialogDescription>
                                    Make changes to your profile here. Click save when you&apos;re
                                    done.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="grid gap-4">
                                <FormField
                                    control={form.control}
                                    name="newName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    id="name"
                                                    type="name"
                                                    placeholder="user name" {...field}
                                                    autoComplete="name" />
                                            </FormControl>
                                            {/* 關鍵修正：顯示錯誤訊息 */}
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="newPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input
                                                    id="newPassword"
                                                    type="password" {...field}
                                                    autoComplete="newPassword" />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <DialogFooter className="mt-5">
                                {/* <DialogClose asChild> */}
                                <Button
                                    variant="outline"
                                    type="button"
                                    disabled={isSubmited}
                                    onClick={() => {
                                        setOpen(false);
                                        form.reset();
                                    }}
                                >Cancel
                                </Button>
                                {/* </DialogClose> */}
                                <Button
                                    type="submit"
                                    disabled={isSubmited}
                                >
                                    {isSubmited ? 'Saving...' : 'Save changes'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </>
    );
}


