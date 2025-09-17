import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server'; // 使用伺服器端的 Supabase 客戶端


export async function GET() {
    const supabase = await createClient();
    const { data, error } = await supabase.from('MemberTable').select('*');

    if (error) {
        console.error('API 查詢錯誤:', error);
        // 如果發生錯誤，回傳一個帶有錯誤訊息的 JSON 響應
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 成功時，回傳資料
    return NextResponse.json({ data });
}

export async function POST(request: Request) {
    const { name, email, password } = await request.json(); // 從請求主體中解析 JSON 資料

    const supabase = await createClient();
    const { data, error } = await supabase
        .from('MemberTable')
        .insert({ Name: name, Email: email, Password: password }); // 新增資料

    if (error) {
        console.error('API 新增錯誤:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
}