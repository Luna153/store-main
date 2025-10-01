'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import {
    Card,
    CardAction,
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
import ThemeToggle from '../components/ThemeToggle';


export default function LoginPage() {
    const formSchema = z.object({
        email: z.string().min(2),
        password: z.string().min(2),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        // console.log(values);
        signIn(values.email, values.password);
        form.reset();
    }

    const { signIn, signInWithGoogle } = useAuth();
    const router = useRouter();

    const handleForgottenPassword= ()=>{
        router.push('/forgottenPassword')
    }


    return (
        <>
            <div className="pt-10">
                <ThemeToggle />
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <Card className="w-full max-w-sm mx-auto">
                            <CardHeader>
                                <CardTitle>Login to your account</CardTitle>
                                <CardDescription>
                                    Enter your email below to login to your account
                                </CardDescription>
                                <CardAction>
                                    <Button
                                        variant="link"
                                        onClick={() => {
                                            router.push('/signup');
                                        }}>
                                        Sign Up</Button>
                                </CardAction>
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
                                                        {/* <Input placeholder="m@example.com" {...field} /> */}
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <FormField
                                            control={form.control}
                                            name="password"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <div className="flex items-center">
                                                        <FormLabel>Password</FormLabel>
                                                        <Button
                                                            variant="link"
                                                            onClick={handleForgottenPassword}
                                                            className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                                        >
                                                            Forgot your password?
                                                        </Button>
                                                    </div>
                                                    <FormControl>
                                                        <Input
                                                            id="password"
                                                            type="password"
                                                            autoComplete='password'
                                                            {...field}
                                                            required
                                                        />

                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        {/* <Input id="password" type="password" required /> */}
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex-col gap-2">
                                <Button type="submit" className="w-full">
                                    Login
                                </Button>
                                <Button variant="outline" className="w-full"  onClick={signInWithGoogle}>
                                    Login with Google
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
