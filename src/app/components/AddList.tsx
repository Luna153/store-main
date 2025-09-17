'use client';

import React, { useState } from "react";
import { createClient } from '@/lib/supabase/client';


export default function AddList() {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const supabase = createClient();
    // 使用 await 來等待 createClient 函式完成


    const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const { data, error } = await supabase
            .from('MemberTable')
            .insert({
                Name: name,
                Email: email,
                Password: password
            })
            .select();

        if (error) {
            console.log('連線失敗');
            return;
        }

        clear();

        console.log(data);
    };

    const clear = () => {
        setName('');
        setEmail('');
        setPassword('');


    };

    return (
        <>
            <form onSubmit={handleAdd}>
                <input type="text"
                    placeholder="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required />
                <input type="text"
                    placeholder="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required />
                <input type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required />
                <button>SEND</button>
            </form>
        </>
    );
}
