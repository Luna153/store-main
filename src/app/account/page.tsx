'use client';
import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth/hooks/useAuth';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { FaCrown } from 'react-icons/fa';
import DialogComponent from '../../components/Dialog';
import Link from 'next/link';

export default function AccountPage() {

  const { profile, signOut, queryData } = useAuth();
  const [isLogout, setIsLogout] = useState(false);
  const [isFirstLogin, setIsFirstLogin] = useState(true);

  useEffect(() => {
    // 只有在 profile 狀態為空時 (第一次載入) 時才執行查詢，避免不必要的資料庫呼叫
    if (!profile && !isLogout && isFirstLogin) {
      // queryData();
      setIsFirstLogin(false);
    }

  }, [profile]);

  const handleLogout = () => {
    setIsLogout(true);
    signOut();
  };


  return (
    <>
      <div className='mx-auto pt-20'>
        <div className="ml-20 mb-5">
          <Link href='/'>Home</Link>
        </div>
        <Card className='mx-20'>
          <CardHeader>
            <div className='flex items-center'>
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
              </Avatar>
              <CardTitle className='ml-2 flex justify-between items-center'>
                <span>{profile?.name}</span>
                {/* 更改名稱按鈕 */}
                <DialogComponent mode="editName"
                />
              </CardTitle>
            </div>
            <CardDescription>This is member data</CardDescription>
            <CardAction><FaCrown /></CardAction>
          </CardHeader>
          <CardContent>
            <div className="grid grid-rows-3 grid-cols-[auto_auto_auto] gap-2 items-center">
              <div>Gmail</div>
              <div className='col-start-1'>Password</div>
              <div className='col-start-1'>Created_at</div>
              <div className='col-start-2 row-start-1'>{profile?.email}</div>
              <div className='col-start-2 row-start-2 flex items-center'>
                <span>***********</span>
                <DialogComponent
                  mode="editPassword"
                />
              </div>
              <div className='col-start-2 row-start-3'>{profile?.created_at}</div>
            </div>
          </CardContent>
          <CardFooter className='flex flex-col'>
            <Button className="w-full" onClick={handleLogout}>
              Logout
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
