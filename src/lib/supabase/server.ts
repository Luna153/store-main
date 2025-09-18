// lib/supabase/server.ts
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from './database.types';

// 導出一個方便的函式，用於在伺服器元件中建立 Supabase 客戶端
export const createClient = () => {
    return createServerComponentClient<Database>({ cookies });
};