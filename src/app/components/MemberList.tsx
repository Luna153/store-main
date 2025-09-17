'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Database } from '@/lib/supabase/database.types'; // 記得匯入你的 database.types.ts

// 使用 Supabase 自動生成的型別
type MemberTable = Database['public']['Tables']['MemberTable']['Row'];


export default function MemberList() {
    // const [data, setData] = useState<TestTable[]>([]); // 用來儲存資料庫data
    // const [inputValues, setInputValues] = useState({}); // 用來管理每個input的值

    // const supabase = createClient();

    // // Step 1: 在 useEffect 中讀取資料
    // useEffect(() => {
    //     const fetchData = async () => {
    //         const { data, error } = await supabase.from('testTable').select('*');
    //         if (data) {
    //             setData(data);

    //             // const initValues: Record<number, string | null> = {};
    //             // data.forEach((item) => {
    //             //     initValues[item.id] = item.Name;
    //             // });
    //             setInputValues(data);
    //             console.log(data);
    //         }

    //         if (error) {
    //             console.log('資料連線錯誤');
    //             return;
    //         }
    //     };
    //     fetchData();
    // }, []);

    // Step 2: 處理 input 值的變更
    // const handleInputChange = (id: number, name: string | null) => {
    //     setInputValues((preValue) => ({
    //         ...preValue,
    //         // [id]: name
    //         // [id]: email
    //     }));

    //     console.log(inputValues);
    // };

    // Step 3: 建立更新函式
    // const handleUpdate= async (id:number)=>{
    //     const {error}=await supabase
    //     .from('testTable')
    //     .update({Name:inputValues[id]})
    //     .eq('id',id)

    //     if(error){
    //         console.log('更新失敗', error.message)
    //     }else{
    //         console.log('更新成功')
    //     }
    // }

    const [newPassword, setNewPassword] = useState('');
    const [status, setStatus] = useState('');

    const supabase = createClient();
    const router = useRouter();

    const handleUpdatePassword = async () => {
        setStatus('更新中...');

        // 這裡我們假設要更新 id 為 1 的使用者
        const { data, error } = await supabase
            .from('MemberTable')
            .update({
                Password: newPassword, // 將 Password 欄位更新為 newPassword 的值
            })
            .eq('Name', 'Luna') // 加上 .eq() 來指定要更新哪一筆資料
            .select();

        if (error) {
            console.error('更新失敗:', error.message);
            setStatus(`更新失敗: ${error.message}`);
        } else {
            console.log('更新成功:', data);
            setStatus('更新成功！');
            setNewPassword(''); // 清空輸入框
        }
    };

    const handleDelete = async () => {
        // 執行刪除操作，並使用 .eq() 來指定要刪除哪一筆
        const { error } = await supabase
            .from('MemberTable')
            .delete()
            .eq('id', 11); // 這裡傳入要刪除的 id

        if (error) {
            console.error('刪除失敗:', error.message);
        } else {
            console.log('刪除成功');
            // 刪除成功後，重新整理頁面以更新 UI
            router.refresh();
        }
    };



    return (
        <>
            <div style={{ padding: '20px' }}>
                <h2>更新使用者密碼 (ID: 8)</h2>
                <input
                    type="text"
                    placeholder="輸入新密碼"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    style={{ marginRight: '10px' }}
                />
                <button onClick={handleUpdatePassword}>更新密碼</button>
                <p>{status}</p>
            </div>
            <button onClick={handleDelete}>刪除id:11</button>
            {/* {data?.map((i,index) => (
                <input key={i.id} type="text" onChange={(e) => setInputValues(e.target)} value={inputValues[index].Name}/>
            ))} */}
        </>
    );
}
