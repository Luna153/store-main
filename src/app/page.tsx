
// app/page.tsx
'use client';
import { createClient } from '@/lib/supabase/server';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import InputForm from './components/InputForm';
import { DataTable } from './components/DataTable';
import React, { useEffect, useState } from 'react';

export default function IndexPage() {

  // 在你的 Client Component 內部
  const fetchMembers = async () => {
    const response = await fetch('/api/members');
    const result = await response.json();
    console.log(result); // 這裡會印出 { data: [...] }
  };

  const addMember = async (name: string, email: string, password: string) => {
    const response = await fetch('/api/members', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: name, email: email, password: password }),
    });
    const result = await response.json();
    console.log(result); // 這裡會印出新增的資料
  };
  // useEffect(() => {
  //   fetchMembers();
  //   addMember('Test', 'test@mail.com', 'test567');
  // }, []);

  return (
    <>
      {/* <AddList />
      <MemberList /> */}
    </>
  );
}

