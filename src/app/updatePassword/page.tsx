'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { z } from "zod";
import { useAuth } from '../auth/hooks/useAuth';



export default function UpdatePasswordPage() {

    const formSchema = z.object({
        password: z.string().min(2),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: "",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        // console.log(values);
        updatePassword(values.password);
        form.reset();
    }

    const { updatePassword } = useAuth();
    const router = useRouter();
    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <Card className="w-full max-w-sm mx-auto">
                        <CardHeader>
                            <CardTitle>Forgotten Password ?</CardTitle>
                            <CardDescription>
                                Enter your email below to update your new PASSWORD
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-6">
                                <div className="grid gap-2">
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        id="password"
                                                        type="password"
                                                        placeholder="輸入新密碼"
                                                        {...field}
                                                        autoComplete='password'
                                                        required
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                            </div>
                        </CardContent>
                        <CardFooter className="flex-col gap-2">
                            <Button type="submit" className="w-full">
                                Send
                            </Button>
                        </CardFooter>
                    </Card>

                    {/* <Button type="submit">Submit</Button> */}
                </form>
            </Form>
        </>
    );
}
