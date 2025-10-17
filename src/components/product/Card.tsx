import React from 'react';
import { FaShoppingCart, FaHeart, FaRegHeart } from 'react-icons/fa';
import WishListButton from './WishListButton';
import { createClient } from '@/utils/supabase/server';
import { findMemberAction, findProdcutAction } from '@/lib/actions/product';


// 查找產品收藏狀態
async function findIsFavoraiteState(memberId, productId) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('WishListTable')
        .select('wishList_id')
        .eq('member_id', memberId)
        .eq('product_id', productId)
        .maybeSingle();

    if (error) {
        console.error('Error checking favorite existence:', error);

        throw new Error(`Database query failed: ${error.message}`);
    }

    // 如果 data 不為 null (即找到了一條紀錄), 則返回 true
    return !!data;

}



export default async function ProductCard({ name, price, productId }) {
    const memberId = await findMemberAction() || '';
    const favoritedState=await findIsFavoraiteState(memberId, productId)
    return (
        <>
            {/* <div className="card aspect-3/4 bg-slate-100 rounded-sm grid grid-rows-3 gap-2 py-4 px-3 w-full h-auto" onClick={() => router.push(`/product/${product_id}`)}> */}
            <div className="card aspect-3/4 bg-slate-100 rounded-sm grid grid-rows-3 gap-2 py-4 px-3 w-full h-auto">
                <div className="card_header row-span-2 bg-slate-200 w-full h-full "></div>
                <div className="card_content text-end">
                    <div className="card_name">{name}</div>
                    <div className="card_price">{`$${price}`}</div>
                </div>
                <div className="card_footer flex justify-end gap-2">
                    <WishListButton memberId={memberId} productId={productId} favoritedState={favoritedState}/>
                    {/* {favoritedState ? (<FaHeart className='my-1'/>) : (<FaRegHeart className='my-1'/>)} */}
                    <FaShoppingCart className='my-1' />
                </div>
            </div>
        </>
    );
}
