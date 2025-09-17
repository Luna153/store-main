// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from './database.types';

// 1. 在函式宣告前加上 async
export const createClient = async () => {
    // 2. 在 cookies() 前加上 await
    const cookieStore = await cookies();

    return createServerClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    // 這裡的 cookieStore 現在是實際的物件，而不是 Promise
                    return cookieStore.get(name)?.value;
                },
            },
        }
    );
};