// 假設這是一個客戶端元件，例如 UpdateProfileForm.tsx
'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toast } from 'sonner';

export async function updateUserProfile(userId: string, newUserName: string) {
    const supabase = createClientComponentClient();

    const { error } = await supabase
        .from('MemberTable') // 👈 你的表格名稱
        .update({ user_name: newUserName }) // 👈 更新 user_name 欄位
        .eq('id', userId); // 👈 確保只更新當前使用者的資料

    if (error) {
        console.error('更新名稱失敗:', error);
        toast.error('更新名稱失敗。');
    } else {
        toast.success('名稱已成功更新！');
    }
}