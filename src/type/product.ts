// 產品資訊
export interface Product {
    product_id: number,
    name: string,
    // image: string,
    // quantity: number;
    price: number;
    // 有其他欄位在這裡新增...
}

// action回覆
export interface ActionResponse {
    success: boolean;
    message?: string;

}

// 寫入收藏資料
export interface WishListInsertData {
    member_id: string,
    product_id: number;
}


// 收藏按鈕元件Props 
export interface WishListButtonProps {
    productId: number,
    initialIsFavorited: boolean,
    isLoggedIn: boolean;
}


export interface Favorite {
    product_id: number;
}