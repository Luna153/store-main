'use client';
import React, { useState } from 'react';
import { FaShoppingCart, FaHeart, FaRegHeart } from 'react-icons/fa';

interface productProps {
    // image: string,
    name: string,
    price: number,
}
// 
export default function ProductCard({ name, price }: productProps) {
    const [wishList, setWishList] = useState(false);

    return (
        <>
            <div className="card aspect-3/4 bg-slate-100 rounded-sm grid grid-rows-3 gap-2 py-4 px-3 w-full h-auto">
                <div className="card_header row-span-2 bg-slate-200 w-full h-full "></div>
                <div className="card_content text-end">
                    <div className="card_name">{name}</div>
                    <div className="card_price">{`$${price}`}</div>
                </div>
                <div className="card_footer flex justify-end gap-2">
                    {wishList ? (<FaHeart className='my-1' onClick={() => setWishList(!wishList)} />) : (<FaRegHeart className='my-1' onClick={() => setWishList(!wishList)} />)}
                    <FaShoppingCart className='my-1' />
                </div>
            </div>
        </>
    );
}
