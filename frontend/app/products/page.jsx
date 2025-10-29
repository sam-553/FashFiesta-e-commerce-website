"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { Pagination } from '@mui/material';

import Loader from '../loader/page';
import Navbar from '../navbar/page';
import Footer from '../footer/page';
import NoProductFound from '../noproduct/page';
import { getproduct } from '../features/products/productSlice';
import productCategory from '../category/page';
import ProductCard from '../productcard/page';

const ProductsContent = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [keyword, setKeyword] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [category, setCategory] = useState('');

    const { product, loading, error, totalpages } = useSelector(state => state.product);

    useEffect(() => {
        const kw = searchParams.get('keyword') || '';
        const page = parseInt(searchParams.get('page'), 10) || 1;
        const cat = searchParams.get('category') || '';

        setKeyword(kw);
        setCurrentPage(page);
        setCategory(cat);
    }, [searchParams]);

    useEffect(() => {
        dispatch(getproduct({ keyword, page: currentPage, category }));
    }, [dispatch, keyword, currentPage, category]);

    useEffect(() => {
        if (!loading && product?.length === 0 && !error) {
            const params = new URLSearchParams(searchParams.toString());
            let modified = false;

            if (keyword && category) {
                toast.info('No products found for this keyword in category, showing category only.');
                params.delete('keyword');
                modified = true;
            } else if (category) {
                toast.info('No products found in this category, showing all products.');
                params.delete('category');
                modified = true;
            } else if (keyword) {
                toast.info('No products found for this keyword, showing all products.');
                params.delete('keyword');
                modified = true;
            }

            if (modified) {
                params.set('page', '1');
                router.push(`/products?${params.toString()}`);
            }
        }
    }, [loading, product, keyword, category, searchParams, router, error]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const handlePageChange = (_, page) => {
        const params = new URLSearchParams(searchParams.toString());
        page === 1 ? params.delete('page') : params.set('page', page);
        keyword ? params.set('keyword', keyword) : params.delete('keyword');
        category ? params.set('category', category) : params.delete('category');
        router.push(`/products?${params.toString()}`);
        if (typeof window !== 'undefined') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleCategoryClick = (catValue) => {
        const params = new URLSearchParams(searchParams.toString());
        catValue ? params.set('category', catValue) : params.delete('category');
        keyword ? params.set('keyword', keyword) : params.delete('keyword');
        params.set('page', '1');
        router.push(`/products?${params.toString()}`);
        if (typeof window !== 'undefined') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <>
            <Navbar />
            <div className="flex flex-col md:flex-row gap-6 p-4 md:p-8 min-h-screen mt-16">
                {/* Categories Sidebar */}
                <div className="w-full md:w-1/4 bg-white p-6 shadow-md rounded-2xl border border-gray-200">
                    <h2 className="text-2xl font-bold mb-6 border-b pb-3 text-gray-800">Categories</h2>
                    <ul className="space-y-1">
                        <li>
                            <button
                                onClick={() => handleCategoryClick('')}
                                aria-pressed={!category}
                                className={`w-full text-left px-4 py-1 rounded-lg transition-all duration-200 ${
                                    !category ? 'bg-gray-200 text-gray-900 font-semibold ring-1 ring-gray-300' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
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
                                        cat.value === category ? 'bg-gray-200 text-gray-900 font-semibold ring-1 ring-gray-300' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                    }`}
                                >
                                    {cat.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Products Grid */}
                <div className="w-full md:w-3/4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {loading ? (
                            <div className="col-span-full flex justify-center items-center h-32">
                                <Loader size={35} color="#4F46E5" />
                            </div>
                        ) : product?.length > 0 ? (
                            product.map((item) => (
                                <ProductCard product={item} key={item._id} />
                            ))
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

const Products = () => (
    <Suspense fallback={<Loader size={40} color="#4F46E5" />}>
        <ProductsContent />
    </Suspense>
);

export default Products;
