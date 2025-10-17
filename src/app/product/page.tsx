import React from 'react';
import ProductCard from '@/components/product/Card';
import Header from '@/components/Header';
import {  findProdcutAction } from '@/lib/actions/product';


export default async function ProductPage() {
    const productItems = await findProdcutAction() || [];

    return (
        <>
            <Header />
            <h1>Product Page</h1>
            <div className="grid grid-cols-4 gap-2">
                {productItems.map(i => (
                    <ProductCard key={i.product_id} name={i.name} price={i.price} productId={i.product_id} />
                ))}
            </div>
        </>
    );
}
