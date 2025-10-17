// 這個檔案將包含核心的收藏切換邏輯。

'use server';

import { ActionResponse } from '@/type/product';
import { createClient } from '@/utils/supabase/server';
import { statSync } from 'fs';
import { revalidatePath } from 'next/cache';
import { success } from 'zod';

/**
 * 檢查並切換產品的收藏狀態 (新增或移除)
 * @param {number} productId - 產品的 ID
 * @param {boolean} isCurrentlyFavorited - 產品目前是否已被收藏
 */

// export async function toggleWishListAction(
//     product_id: number,
//     isCurrentlyFavorited: boolean
// ): Promise<ActionResponse> {
//     const supabase = await createClient();
//     const { data: { user } } = await supabase.auth.getUser();

//     if (!user) {
//         return { success: false, message: 'User not authenticated. Please log in' };
//     }

//     const member_id = user.id;

//     try {

//         if (isCurrentlyFavorited) {
//             // 移除收藏 (DELETE)
//             const { error } = await supabase
//                 .from('WishListTable')
//                 .delete()
//                 .eq('member_id', member_id)
//                 .eq('product_id', product_id);

//             if (error) throw error;
//             // if (error) {
//             //     console.error('Error removing from wishlist:', error.message);
//             //     return { success: false, message: `Remove failed ${error.message}` };
//             // }

//         } else {
//             // 新增收藏
//             const { error } = await supabase
//                 .from('WishListTable')
//                 .insert({ member_id, product_id })
//                 .select();
//             if (error) throw error;

//             // if (error) {
//             //     // 處理重複收藏的錯誤 (通常 Supabase 會返回 23505 錯誤碼)
//             //     if (error.code == '23505') {
//             //         return { success: false, message: `Product already favoratied.` };
//             //     }

//             //     console.error(`Error adding to wishlist:`, error.message);
//             //     return { success: false, message: `Addition failed: ${error.message}` };
//             // }
//         }
//         // 確保產品頁面或收藏清單的快取被清除
//         // 這裡使用者回到該頁面時會看到最新的狀態
//         revalidatePath(`/product/${product_id}`);
//         revalidatePath(`/account/wishlist`);
//     } catch (e: any) {
//         // 處理可能的唯一性約束錯誤 (重複收藏)
//         if (e.code == '23505') {
//             return { success: true, message: 'Product already favorited.' };
//         }
//         console.error('Wishlist action failed:', e.message);
//         return { success: false, message: `操作失敗: ${e.message}` };
//     }


// }

const supabase = await createClient();
// 新增收藏
export async function addWishListAction(memberId, productId) {
    const { error } = await supabase
        .from('WishListTable')
        .insert({ member_id: memberId, product_id: productId })
        .select();
    // if (error) throw error;
}
// 移除收藏 (DELETE)
export async function deleteWishListAction(memberId, productId) {
    const { error } = await supabase
        .from('WishListTable')
        .delete()
        .eq('member_id', memberId)
        .eq('product_id', productId);
}
