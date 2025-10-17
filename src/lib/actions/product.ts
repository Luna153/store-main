'use server';
import { ActionResponse } from '@/type/product';
import { createClient } from '@/utils/supabase/server';
import { success } from 'zod';

// 查找登入會員資料
export async function findMemberAction() {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
        console.error(`Error to find member data`, error.message);
        // return {success:false, error:error.message}
    }
    else {
        return user.id;
    }
}
// 查找登入會員資料
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
        return data;
    }

}