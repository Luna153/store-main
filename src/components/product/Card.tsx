'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';


import { FaShoppingCart, FaHeart, FaRegHeart } from 'react-icons/fa';
import { Product } from '@/type/product';
import { useAuth } from '@/app/auth/hooks/useAuth';
import { addToWishListAction } from '@/lib/actions/wishlist';
// import { createClient } from '@/utils/supabase/client';

// 
export default function ProductCard({ name, price, product_id }: Product) {
    const [wishList, setWishList] = useState(false);
    const router = useRouter();
    const { profile } = useAuth();
    // const supabase = createClient();


    const handleWishList = (event) => {
        event.stopPropagation();
        setWishList(!wishList);
        const member_id = profile.member_id;
        addToWishListAction({ product_id});



    };

    return (
        <>
            <div className="card aspect-3/4 bg-slate-100 rounded-sm grid grid-rows-3 gap-2 py-4 px-3 w-full h-auto" onClick={() => router.push(`/product/${product_id}`)}>
                <div className="card_header row-span-2 bg-slate-200 w-full h-full "></div>
                <div className="card_content text-end">
                    <div className="card_name">{name}</div>
                    <div className="card_price">{`$${price}`}</div>
                </div>
                <div className="card_footer flex justify-end gap-2">
                    {wishList ? (<FaHeart className='my-1' onClick={(event) => handleWishList(event)} />) : (<FaRegHeart className='my-1' onClick={(event) => handleWishList(event)} />)}
                    <FaShoppingCart className='my-1' />
                </div>
            </div>
        </>
    );
}
