'use client';
import React from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// import { useAuth } from 'auth/hooks/useAuth';

import Image from 'next/image';
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { FaUserAlt, FaGlobeAmericas, FaShoppingCart } from 'react-icons/fa';
import { FiMail, FiLogIn, FiLogOut } from 'react-icons/fi';
import { useAuth } from '@/app/auth/hooks/useAuth';
export default function Header() {
    const { profile, signOut } = useAuth();
    const router = useRouter();

    useEffect(() => {
        console.log(profile);

    }, [profile]);

    const handleRouter = (routerTo: string) => {
        router.push(`/${routerTo}`);

    };
    return (
        <>
            <div className="bg-slate-100 w-full h-16 flex justify-between items-center px-10 fixed">
                {/* <Image
                    src="vercel.svg"
                    alt="Picture of the author"
                    width={40}
                    height={40}
                /> */}
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    {/* <AvatarFallback>CN</AvatarFallback> */}
                </Avatar>
                <div className="flex items-center gap-5">
                    <FaUserAlt onClick={() => handleRouter('account')} />
                    <FaGlobeAmericas />
                    <FiMail />
                    <FaShoppingCart onClick={() => handleRouter('cart')} />

                    <div className='flex items-center gap-5'>
                        <span>{profile ? `Hello! ${profile.name}` : '請登入'}</span>
                        {profile ? (<FiLogOut onClick={signOut} />) : (<FiLogIn onClick={() => handleRouter('login')} />)}
                    </div>
                </div>
            </div>

        </>
    );
}



