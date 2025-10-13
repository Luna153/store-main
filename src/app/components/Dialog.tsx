'use client';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useAuth } from "../auth/hooks/useAuth";
import { useEffect, useState } from "react";
import { BiPencil } from 'react-icons/bi';


// 定義類型和元件 Props
type DialogMode = 'editName' | 'editPassword';

interface DialogComponentProps {
    mode: DialogMode; // 決定視窗是改名字還是密碼
    // triggerButtonText: string; // 觸發按鈕的文字 (如: Edit Name or Edit Password)
}

// 通用基礎 Schema
const BaseSchema = z.object({
    newName: z.string().optional(),
    newPassword: z.string().optional(),
});

// 針對 'editName' 模式的 Schema
const NameSchema = BaseSchema.extend({
    newName: z.string().min(2, {
        message: "名稱必須至少 2 個字元。",
    }),
});

// 針對 'editPassword' 模式的 Schema
const PasswordSchema = BaseSchema.extend({
    newPassword: z.string().min(6, { // 密碼通常要求長度較長，此處改為 6
        message: "密碼必須至少 6 個字元。",
    }),
});

// 聯合類型, 便於在 TypeScript 中處理兩種表單數據
type FormSchemaType = z.infer<typeof NameSchema | typeof PasswordSchema>;

export default function DialogComponent({ mode }: DialogComponentProps) {
    const { updateName, updatePassword, queryData } = useAuth();
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 根據 mode 選擇 Schema 和 defaultValues
    const currentSchema = mode == 'editName' ? NameSchema : PasswordSchema;

    const defaultValues = {
        newName: mode == 'editName' ? '' : undefined,  // 只有在改名字下才設置
        newPassword: mode == 'editPassword' ? '' : undefined // 只有在改密碼下才設置
    };

    const form = useForm<FormSchemaType>({
        resolver: zodResolver(currentSchema),
        defaultValues: defaultValues as any, // 類型斷言以適應聯合類型
    });

    async function onSubmit(data: FormSchemaType) {
        setIsSubmitting(true);

        // 根據 mode 決定要傳遞的參數
        const nameToUpdate = mode == 'editName' ? data.newName : undefined;
        const passwordToUpdate = mode == 'editPassword' ? data.newPassword : undefined;

        // 執行更新, 只需要傳遞需更新的欄位
        const result = mode == 'editName' ? await updateName(nameToUpdate) : await updatePassword(passwordToUpdate);
        

        if (result.success) {
            queryData(); // 重取會員資料

            const successMessage = mode == 'editName'
                ? `新名稱: ${nameToUpdate}`
                : `密碼已成功更新`;


            toast.success("資料已成功儲存", { description: successMessage });

            
        } else {
            toast.error("更新失敗", { description: result.errorMessage });
        }

        form.reset(defaultValues as any);
        setOpen(false);
        setIsSubmitting(false);
    }

    // 根據 mode 調整 Dialog 的 Title 和 description
    const dialogTitle = mode == 'editName' ? '修改名稱' : '修改密碼';
    const dialogDescription = mode == 'editName'
        ? '請輸入你想顯示的新名稱'
        : '請輸入你想設定的新密碼';


    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <BiPencil className="ml-2" />
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]" aria-describedby={undefined}>
                    <Form {...form}>
                        {/* <form onSubmit={form.handleSubmit(onSubmit)}> */}
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <DialogHeader className="mb-5">
                                <DialogTitle>{dialogTitle}</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4">
                                {/* 根據 mode 條件渲染欄位 */}
                                {mode == 'editName' && (
                                    <FormField
                                        control={form.control}
                                        name="newName"
                                        render={({ field }) => (
                                            <FormItem>
                                                {/* <FormLabel>Name</FormLabel> */}
                                                <FormControl>
                                                    <Input
                                                        id="name"
                                                        type="name" {...field}
                                                        placeholder={dialogDescription}
                                                        autoComplete="name" />
                                                </FormControl>
                                                {/* 關鍵修正：顯示錯誤訊息 */}
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )}
                                {mode == 'editPassword' && (
                                    <FormField
                                        control={form.control}
                                        name="newPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                {/* <FormLabel>Password</FormLabel> */}
                                                <FormControl>
                                                    <Input
                                                        id="newPassword"
                                                        type="password" {...field}
                                                        autoComplete="newPassword"
                                                        placeholder={dialogDescription} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                )}
                            </div>
                            <DialogFooter className="mt-5">
                                {/* <DialogClose asChild> */}
                                <Button
                                    variant="outline"
                                    type="button"
                                    disabled={isSubmitting}
                                    onClick={() => {
                                        setOpen(false);
                                        form.reset();
                                    }}
                                >Cancel
                                </Button>
                                {/* </DialogClose> */}
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Saving...' : 'Save changes'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </>
    );
}


