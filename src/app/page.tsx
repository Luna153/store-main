
// 'use client';
import { useEffect } from 'react';
import { useAuth } from './auth/hooks/useAuth';
import Header from '@/components/Header';
import Link from 'next/link';


export default function IndexPage() {


  return (
    <>
    <Header/>
    <Link href='/store'>store</Link>
    <div className="mt-20">
      <span>This is home page</span>
    </div>
    </>
  );
}

