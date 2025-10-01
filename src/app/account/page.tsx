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
import DialogComponent from '../components/Dialog';

export default function AccountPage() {

  const { profile, signOut, queryData } = useAuth();
  const [isLogout, setIsLogout] = useState(false);

  useEffect(() => {
    // 只有在 profile 狀態為空時 (第一次載入) 時才執行查詢，避免不必要的資料庫呼叫
    if (!profile && !isLogout) {
      queryData();
    }
    // console.log(profile);

  }, [profile]);

  const handleLogout = () => {
    setIsLogout(true);
    signOut();
  };


  return (
    <>


      <div className='w-2xl mx-auto'>
        <Card className='mx-20 mt-10'>
          <CardHeader>
            <div className='flex items-center'>
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
              </Avatar>
              <CardTitle className='ml-2'>{profile?.name}</CardTitle>
            </div>
            <CardDescription>This is member data</CardDescription>
            <CardAction><FaCrown /></CardAction>
          </CardHeader>
          <CardContent>
            <div className="grid grid-rows-2 grid-cols-[auto_auto] gap-2">
              <div>Gmail</div>
              <div className='col-start-1'>Created_at</div>
              {/* <div className='col-start-2 row-start-1'>123</div>
            <div>456</div> */}
              <div className='col-start-2 row-start-1'>{profile?.email}</div>
              <div>{profile?.created_at}</div>
            </div>
            {/* <p>Card Content</p> */}
          </CardContent>
          <CardFooter className='flex flex-col'>
            <Button className="w-full" onClick={handleLogout}>
              Logout
            </Button>
            <DialogComponent />

            {/* <Button variant='outline' className="w-full mt-5" >
              Edit
            </Button> */}
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
