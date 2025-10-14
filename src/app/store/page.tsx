import React from 'react';
// import Header from '../components/Header';
import Header from '@/components/Header';

import Footer from '../../components/Footer';
import KvSecion from '../../components/KvSecion';
import ProductSection from '../../components/ProductSection';

export default function StorePage() {
    return (
        <>
            <div className=" storeSection min-h-200 bg-slate-600" id="storeSection">
                <Header />
                <KvSecion />
                <ProductSection />
                <Footer />
            </div>
        </>
    );
}
