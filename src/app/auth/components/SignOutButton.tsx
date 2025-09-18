// 登出按鈕的客戶端元件
'use client';

import { Button } from '@/components/ui/button';
import { useAuth } from '../hooks/useAuth';

export default function SignOutButton() {

    const { signOut } = useAuth();

    return (
        <Button onClick={signOut}>
            登出
        </Button>
    );
}