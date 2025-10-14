import React from 'react';
import Image from 'next/image';
import ProductCard from './product/Card';
import { createClient } from '@/utils/supabase/client';




export default async function ProductSection() {
  const supabase = createClient();
  const { data: productItems, error } = await supabase
    .from('ProductTable')
    .select('*');

  if (error) {
    // 如果在這裡拋出錯誤，Next.js 會捕捉並顯示生產環境的安全訊息
    console.error('SUPABASE_QUERY_ERROR:', error);
    throw new Error('Failed to fetch product data from Supabase.', { cause: error });
  }


  return (
    <>
      <div className=" productSection h-screen px-5 bg-slate-300" id='productSection'>
        <h2>product</h2>
        <div className="grid grid-cols-4 gap-2">
          {productItems.map(i => (
            <ProductCard key={i.product_id} name={i.name} price={i.price} />
          ))}
        </div>
      </div>
    </>
  );
}
