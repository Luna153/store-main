'use server';
import { createClient } from '@/utils/supabase/server';

// 查找登入會員資料
export async function findMemberAction() {
    const supabase = await createClient();

    const { data: { user }, error } = await supabase.auth.getUser();

    if (!user) {
        return null;
    }
    if (error) {
        console.error(`Error to find member data`, error.message);
    }
    return user.id;
}

// 所有產品資訊
export async function findProdcutAction() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('ProductTable')
        .select('*');

    if (error) {
        // 如果在這裡拋出錯誤，Next.js 會捕捉並顯示生產環境的安全訊息
        console.error('SUPABASE_QUERY_ERROR:', error);
    } else {
        // console.log(data);
        return data || [];
    }

}