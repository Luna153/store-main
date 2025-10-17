'use client';
import { useAuth } from '@/app/auth/hooks/useAuth';
import { toggleWishListAction } from '@/lib/actions/wishlist';
import { WishListButtonProps } from '@/type/product';
import { createClient } from '@/utils/supabase/client';
import React, { useState, useTransition } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';


export default function WishListButton({ memberId, productId, favoritedState }) {



    return (
        <>
            {/* 根據狀態決定按鈕樣式 */}
            {favoritedState ? (<FaHeart className='my-1' />) : (<FaRegHeart className='my-1' />)}
        </>
    );
}
