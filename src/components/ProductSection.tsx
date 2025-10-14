import React, { useState } from 'react';
import Image from 'next/image';
import ProductCard from './product/Card';
import { getBaseUrl } from '@/utils/getBaseURL';



export default async function ProductSection() {
  // 動態獲取基礎網址
  const baseUrl = getBaseUrl()

  // 建立完整的 API 端點 URL
  const apiEndpoint = `${baseUrl}/api/products`;
  // const res = await fetch('/api/products');
  // const products = await res.json();
  // console.log(products)

  // 使用完整的 URL 進行內部呼叫
  const res = await fetch(apiEndpoint, {
    // 建議加入 no-store 來確保數據是即時的
    cache: 'no-store'
  });

  if(!res.ok){
    // 處理 HTTP 錯誤
    throw new Error(`Failed to fetch data from API: ${res.status}`)
  }

  const products = await res.json();

  return (
    <>
      <div className=" productSection h-screen px-5 bg-slate-300" id='productSection'>
        <h2>product</h2>
        <div className="grid grid-cols-4 gap-2">
          {products.map(i => (
            <ProductCard key={i.product_id} name={i.name} price={i.price} />
          ))}
        </div>
      </div>
    </>
  );
}
