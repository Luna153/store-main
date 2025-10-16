'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { success } from 'zod';

interface InsertData {
    member_id: string,
    product_id: number;
}

// 加入收藏功能
export async function addToWishListAction({ product_id }) {

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    // const { data: { user }, error } = await supabase.auth.getUser();
    // console.log(user);
    // console.log(supabase)
    const { data, error } = await supabase
        .from('WishListTable')
        .insert([
            { member_id: user.id, product_id },
        ])
        .select();

    // if (error) {
    //     console.error('Error adding to wishList ', error.message);
    //     return { success: false, error: error.message };
    // }

    // 💡 效能優化：使用 revalidatePath 清除快取
    // 確保收藏成功後，顯示收藏清單的頁面會自動刷新並顯示新項目
    // revalidatePath('/account/wishlist');

    // return { success: true, data };

}
