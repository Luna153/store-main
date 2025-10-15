import React from 'react';
import Image from 'next/image';
import Link from 'next/link';




export default async function ProductSection() {



  return (
    <>
      <div className=" productSection h-screen px-5 bg-slate-300" id='productSection'>
        <Link href='/product'>product</Link>
      </div>
    </>
  );
}
