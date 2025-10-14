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
import { AlertCircleIcon, CheckCircle2Icon, PopcornIcon } from "lucide-react";

import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert";

import { useAuth } from '../auth/hooks/useAuth';
import { AlertComponent } from '../../components/Alert';


export default function ForgottenPasswordPage() {

    const formSchema = z.object({
        email: z.string().min(2),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        // console.log(values);
        forgottenPassword(values.email);
        setIsSent(true)
        form.reset();
    }

    const { forgottenPassword } = useAuth();
    // const router = useRouter();
    const [isSent, setIsSent] = useState(false); // 是否送出驗證信


    return (
        <>
            {/* <AlertComponent /> */}
            <div className={`forgottenPassword_alert max-w-100 mx-auto ${isSent ? 'active' : ''}`}>
                <Alert>
                    <CheckCircle2Icon />
                    <AlertTitle>Success! Your changes have been saved</AlertTitle>
                    <AlertDescription>
                        This is an alert with icon, title and description.
                    </AlertDescription>
                </Alert>
            </div>
            <div className={`forgottenPassword_form `} >
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
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Email</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            id="email"
                                                            type="email"
                                                            placeholder="m@example.com"
                                                            {...field}
                                                            autoComplete='email'
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
            </div>
        </>
    );
}
