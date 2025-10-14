export function getBaseUrl(){
    // 檢查 VERCEL_URL 變數(Vercel 部屬時自動提供)
    if(process.env.VERCEL_URL){
        // 確保使用 http 協定
        return `http://${process.env.VERCEL_URL}`
    }

    // 檢查 NEXT_PUBLIC_BASE_URL 變數(手動設定的生產環境網址)
    // 這是為了一些非 Vercel 部署或特殊配置情況
    if(process.env.NEXT_PUBLIC_BASE_URL){
        return process.env.NEXT_PUBLIC_BASE_URL
    }

    // 預設為本地開發環境 (Fallback)
    // 如果在本地且都沒有設定, 就使用 localhost
    return 'http://localhost:3001'
}