import { notFound } from 'next/navigation';

// 這裡必須使用 Next.js 提供得伺服器客戶端, 才能安全的使用 Service Role Key
import { createClient } from '@/utils/supabase/client';


// 頁面元件使用 ProductDetailPageProps 進行類型註解
export default async function ProductDetailPage({params}) {

    // 獲取並解析產品 ID
    // const productId =  params.pid;
    const { pid } = await params;
    const idAsNumber = parseInt(pid, 10);

    // 檢查 ID 是否為有效的數字, 未檢查可能會導致 Supabase 查詢失敗
    if (isNaN(idAsNumber)) {
        notFound(); // 無效 ID 視為 404
    }

    // 執行 Supabase 查詢
    const supabase = createClient();

    const { data, error } = await supabase
        .from('ProductTable')
        .select('*')
        .eq('product_id', idAsNumber) // 使用數字 ID 進行精確匹配
        .single(); // 類型斷言: 告訴 TypeScript 返回的數據符合 Product 介面

    // 錯誤處理
    if (error) {
        console.error('SUPABASE_QUERY_ERROR', error);

        // 在生產環境中, 可以拋出錯誤給 error.tsx 處理
        throw new Error('無法載入產品詳情, 請稍後再試');
    }

    // 找不到產品處理 (404)
    if (!data) {
        notFound();
    }

    const product = data ; 

    return (
        <>
            <h2>商品名稱: {product.name}</h2>
            <h3>價格: ${product.price.toFixed(0)}</h3>
        </>
    );

}