'use client';
import { Button } from '@/components/ui/button';
import React, { useEffect } from 'react';
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaCrown } from 'react-icons/fa';
export default function accountPage() {

  const { signOut, queryData } = useAuth();
  useEffect(() => {
    queryData();
  }, []);
  return (
    <>


      <Card className='mx-20 mt-10'>
        <CardHeader>
          <div className='flex items-center'>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
            </Avatar>
            <CardTitle className='ml-2'>User name</CardTitle>
          </div>
          <CardDescription>This is member data</CardDescription>
          <CardAction><FaCrown /></CardAction>
        </CardHeader>
        <CardContent>
          <div className="grid grid-rows-2 grid-cols-[auto_auto] gap-2">
            <div>Gmail</div>
            <div className='col-start-1'>Password</div>
            <div className='col-start-2 row-start-1'>z66500646@gmail.com</div>
            <div>*******************</div>
          </div>
          {/* <p>Card Content</p> */}
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={signOut}>
            Logout
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
