
'use client';
import { useEffect } from 'react';
import { useAuth } from './auth/hooks/useAuth';

export default function IndexPage() {

  const { profile,queryData } = useAuth();
  console.log(profile)
  // useEffect(()=>{
  //   queryData()
  // },[])
// queryData()
  return (
    <>
    
    </>
  );
}

