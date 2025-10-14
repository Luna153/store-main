// Route Handler
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/client';


export async function GET(request){
    const supabase = createClient()

    const {data:ProductTable,error}=await supabase
        .from('ProductTable')
        .select('*')

        if(error){
            return NextResponse.json({error:'Failed to fetch data'},{status:500})
        }

        // 返回 JSON 格式的資料
        return NextResponse.json(ProductTable)
}

// 客戶元件可以這樣調用這個 API
// const res = await fetch('api/products');
// const products = await res.json();