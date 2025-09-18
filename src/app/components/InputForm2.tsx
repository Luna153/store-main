"use client";

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
import { updateUserProfile } from "../auth/components/UpdateProfileForm";

const FormSchema = z.object({
    username: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
});

interface Props {
    userId: string,
    userName: string,
}

export default function InputForm({ userId, userName }: Props) {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            username: "",
        },
    });

    function onSubmit(data: z.infer<typeof FormSchema>) {
        console.log(data)
        // toast("You submitted the following values", {
        //     description: (
        //         <pre className="mt-2 w-[320px] rounded-md bg-neutral-950 p-4">
        //             <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        //         </pre>
        //     ),
        // });
        updateUserProfile(userId, data.username);
    }

    return (
        <>
            <div className="w-full px-20">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Your Origin Username: {userName}</FormLabel>
                                    <FormControl>
                                        <div className="flex">
                                            <Input placeholder="" {...field} />
                                            <Button type="submit" className="ml-2">Edit</Button>
                                        </div>
                                    </FormControl>
                                    <FormDescription>
                                        Enter Your New User Name
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                    </form>
                </Form>
            </div>
        </>
    );
}
