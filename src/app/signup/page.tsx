'use client';
import React, { useEffect, useState } from 'react';
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


export default function LoginPage() {
    const formSchema = z.object({
        name: z.string().min(2),
        email: z.string().min(2),
        password: z.string().min(2),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name:"",
            email: "",
            password: "",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        // console.log(values);
        signUp(values.name,values.email,values.password)
        form.reset();
    }

    const { signUp } = useAuth();




    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <Card className="w-full max-w-sm mt-5 mx-auto">
                        <CardHeader>
                            <CardTitle>Sign up your account</CardTitle>
                            <CardDescription>
                                Enter your email and password below to login to your account
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-6">
                                <div className="grid gap-2">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Name</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        id="name"
                                                        type="name"
                                                        placeholder="Your Name"
                                                        {...field}
                                                        autoComplete='name'
                                                        required
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
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
                                SignUp
                            </Button>

                        </CardFooter>
                    </Card>

                    {/* <Button type="submit">Submit</Button> */}
                </form>
            </Form>

        </>
    );
}
