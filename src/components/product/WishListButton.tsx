'use client';
import { useAuth } from '@/app/auth/hooks/useAuth';
import { addWishListAction, deleteWishListAction } from '@/lib/actions/wishlist';
import { WishListButtonProps } from '@/type/product';
import { createClient } from '@/utils/supabase/client';
import React, { useState, useTransition } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { success } from 'zod';

export async function toggleWishlist(curFavoritedState, memberId, productId) {
    console.log(curFavoritedState);
    console.log(memberId);
    console.log(productId);
    const supabase = createClient();
    let error: any = null;

    // try {
    if (curFavoritedState) {
        console.log('delete');
        const { error } = await supabase
            .from('WishListTable')
            .delete()
            .eq('member_id', memberId)
            .eq('product_id', productId);
        // const 
    } else {
        console.log('add');

        const { error } = await supabase
            .from('WishListTable')
            .insert({ member_id: memberId, product_id: productId })
            .select();
    }

    if (error) {
        console.error('Wishlist DB Error:', error.message);
        // 處理重複鍵錯誤 (例如，嘗試新增已存在的記錄)
        if (error.code === '23505') {
            return { success: true, message: '記錄已存在，操作忽略。' };
        }
        return { success: false, message: `資料庫錯誤: ${error.message}` };
    }

    return { success: true };
    // } catch (e) {
    //     if (e.code == '23505') {
    //         return { success: true, message: 'Product already favorited.' };
    //     }
    // }




    // revalidatePath(`/product`);

}


export default function WishListButton({ memberId, productId, favoritedState, isLoggedIn }) {

    const [initFavoriteState, setInitFavoriteState] = useState(favoritedState);

    const handleToggleFavorite = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        e.preventDefault();
        toggleWishlist(initFavoriteState, memberId, productId);
        setInitFavoriteState(!initFavoriteState);
    };
    return (
        <>
            {/* 根據狀態決定按鈕樣式 */}
            <button onClick={handleToggleFavorite}>
                {initFavoriteState ? (<FaHeart className='my-1' />) : (<FaRegHeart className='my-1' />)}
            </button>
        </>
    );
}
