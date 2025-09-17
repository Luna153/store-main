"use client";
import { Button } from '@/components/ui/button';
import React from 'react';
import { useAuth } from '../hooks/useAuth'; // 註冊



export default function MemberPage() {
    const { signOut } = useAuth(); // 使用 useAuth Hook

    return (
        <>
            <div>Welcome!!</div>
            <Button className='ml-2' onClick={signOut}>SignOut</Button>
        </>
    );
}
