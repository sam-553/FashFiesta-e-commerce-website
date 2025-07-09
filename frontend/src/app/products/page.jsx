'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Pagination } from '@mui/material';

import Loader from '../loader/page';
import Navbar from '../navbar/page';
import Footer from '../footer/page';
import NoProductFound from '../noproduct/page';
import { getproduct } from '../features/products/productSlice';
import productCategory from '../category/page';
import ProductCard from '../productcard/page';

const Products = () => {
    const dispatch = useDispatch();
    const router = useRouter();

    const [keyword, setKeyword] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [category, setCategory] = useState('');

    const { product, loading, error, totalpages } = useSelector((state) => state.product);

    // Extract query params on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const kw = params.get('keyword') || '';
            const page = parseInt(params.get('page'), 10) || 1;
            const cat = params.get('category') || '';

            setKeyword(kw);
            setCurrentPage(page);
            setCategory(cat);
        }
    }, []);

    // Fetch products when filters change
    useEffect(() => {
        dispatch(getproduct({ keyword, page: currentPage, category }));
    }, [dispatch, keyword, currentPage, category]);

    // Error handling
    useEffect(() => {
        if (!loading && product?.length === 0) {
            toast.dismiss();
            toast.error('No products found for this category');
        }
    }, [loading, product]);

    useEffect(() => {
        if (error) {
            toast.error(error.message || 'Something went wrong');
        }
    }, [error]);

    const handlePageChange = (_, page) => {
        if (page !== currentPage) {
            setCurrentPage(page);
            const params = new URLSearchParams(window.location.search);
            page === 1 ? params.delete('page') : params.set('page', page);
            router.push(`/products?${params.toString()}`);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleCategoryClick = (catValue) => {
        setCategory(catValue);
        setCurrentPage(1);
        const params = new URLSearchParams(window.location.search);
        catValue ? params.set('category', catValue) : params.delete('category');
        params.set('page', 1);
        router.push(`/products?${params.toString()}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <>
            <Navbar />
            <div className="flex flex-col md:flex-row gap-6 p-4 md:p-8 min-h-screen mt-16">
                {/* Sidebar */}
                <div className="w-full md:w-1/4 bg-white p-6 shadow-md rounded-2xl border border-gray-200">
                    <h2 className="text-2xl font-bold mb-6 border-b pb-3 text-gray-800">Categories</h2>
                    <ul className="space-y-1">
                        <li>
                            <button
                                onClick={() => handleCategoryClick('')}
                                aria-pressed={!category}
                                className={`w-full text-left px-4 py-1 rounded-lg transition-all duration-200 ${
                                    !category
                                        ? 'bg-gray-200 text-gray-900 font-semibold ring-1 ring-gray-300'
                                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                            >
                                All Categories
                            </button>
                        </li>
                        {productCategory.map((cat) => (
                            <li key={cat.id}>
                                <button
                                    onClick={() => handleCategoryClick(cat.value)}
                                    aria-pressed={cat.value === category}
                                    className={`w-full text-left px-4 py-1 rounded-lg transition-all duration-200 ${
                                        cat.value === category
                                            ? 'bg-gray-200 text-gray-900 font-semibold ring-1 ring-gray-300'
                                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                    }`}
                                >
                                    {cat.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Product Grid */}
                <div className="w-full md:w-3/4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {loading ? (
                            <div className="col-span-full flex justify-center items-center h-32">
                                <Loader size={35} color="#4F46E5" />
                            </div>
                        ) : product?.length > 0 ? (
                            product.map((item) => <ProductCard product={item} key={item._id} />)
                        ) : (
                            <div className="col-span-full text-center text-gray-600">
                                <NoProductFound keyword={keyword} />
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {totalpages > 1 && (
                        <div className="mt-10 flex justify-center">
                            <Pagination
                                count={totalpages}
                                page={currentPage}
                                onChange={handlePageChange}
                                color="standard"
                            />
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Products;