'use client';
import React, { useState } from 'react';

export default function StandardButton({ standardItems }) {
    // console.log(standardItems);
    // standardItems.map((i) => { console.log(i); });
    const [status,setStatus]=useState([...standardItems])



    const handleSelect = (target) => {
        
        const newSelected = status.map(item=>{
            if(item.select_id==target.select_id){
                return {
                    ...item,
                    status:!item.status
                }
            }

            return item
        })
        
        setStatus(newSelected)
    };

    return (
        <>
            {standardItems.map(i => (
                <div key={i.standard_id} className={`w-20 py-1 border border-solid rounded-sm hover:bg-lime-400 cursor-pointer border-lime-400 text-center `} onClick={()=>handleSelect(i)} >{i.name}</div>
            )
            )}
        </>
    );
}
