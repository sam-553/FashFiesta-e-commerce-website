'use client'

import React, { useEffect, useState } from 'react';
import { Pencil, Trash, Table, Rows, Star } from 'lucide-react';
import Navbar from '../navbar/page';
import Footer from '../footer/page';
import { useDispatch, useSelector } from 'react-redux';
import { deleteProduct, fetchAdminProducts, removeError } from '../features/admin/adminSlice';
import Loader from '../loader/page';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const ProductList = () => {
    const [view, setView] = useState('table');
    const { products = [], loading, error } = useSelector((state) => state.admin);
    const dispatch = useDispatch();
    const router = useRouter();

    useEffect(() => {
        dispatch(fetchAdminProducts());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            toast.error('Error fetching products');
            dispatch(removeError());
        }
    }, [dispatch, error]);

    const formatDate = (dateString) =>
        new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });

    const handleEdit = (productId) => {
        router.push(`/updateProduct/${productId}`);
    };

    const handleDelete = async (productId) => {
        if (confirm('Are you sure you want to delete this product?')) {
            try {
                await dispatch(deleteProduct(productId)).unwrap();
                toast.success('Product deleted successfully');
                dispatch(fetchAdminProducts());
            } catch (error) {
                toast.error(error?.message || 'Error deleting product');
            }
        }
    };

    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <>
                    <Navbar />
                    <main className="p-6 max-w-7xl mx-auto mt-10">
                        <h2 className="text-gray-800 font-bold text-center text-3xl mb-6">All Products</h2>

                        <div className="flex justify-end mb-4 gap-2">
                            <button
                                onClick={() => setView('table')}
                                className={`p-2 rounded-full shadow transition ${view === 'table' ? 'bg-gray-800 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                            >
                                <Table className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setView('row')}
                                className={`p-2 rounded-full shadow transition ${view === 'row' ? 'bg-gray-800 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                            >
                                <Rows className="w-5 h-5" />
                            </button>
                        </div>

                        {view === 'table' ? (
                            <div className="overflow-x-auto rounded-lg shadow bg-white">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            {['S.No', 'Image', 'Name', 'Price', 'Rating', 'Category', 'Stock', 'Created At', 'Action'].map(
                                                (heading) => (
                                                    <th
                                                        key={heading}
                                                        className="text-left p-3 text-sm font-semibold text-gray-700"
                                                    >
                                                        {heading}
                                                    </th>
                                                )
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-100">
                                        {products?.filter((product) => product && product.name).map((product, index) => (
                                            <tr key={product._id} className="hover:bg-gray-50 transition duration-200">
                                                <td className="p-3 text-gray-600">{index + 1}</td>
                                                <td className="p-3">
                                                    <img
                                                        src={product?.image?.[0]?.url || '/placeholder.jpg'}
                                                        alt={product?.name ?? 'Product Image'}
                                                        className="w-12 h-12 rounded object-cover shadow-sm"
                                                    />
                                                </td>
                                                <td className="p-3 text-gray-800">{product.name}</td>
                                                <td className="p-3 font-medium text-gray-700">₹{product.price}</td>
                                                <td className="p-3 flex items-center gap-1 text-gray-700 ml-4">
                                                    {product.ratings} <Star className="w-4 h-4 text-yellow-500" />
                                                </td>
                                                <td className="p-3">
                                                    <span className="px-2 py-0.5 bg-gray-200 text-gray-800 rounded text-xs">
                                                        {product.category}
                                                    </span>
                                                </td>
                                                <td className={`p-3 font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    {product.stock}
                                                </td>
                                                <td className="p-3 text-gray-600">{formatDate(product.createdAt)}</td>
                                                <td className="p-3 flex gap-2">
                                                    <button
                                                        title="Edit"
                                                        onClick={() => handleEdit(product._id)}
                                                        className="text-blue-600 hover:text-blue-800 transition"
                                                    >
                                                        <Pencil className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(product._id)}
                                                        title="Delete"
                                                        className="text-red-600 hover:text-red-800 transition"
                                                    >
                                                        <Trash className="w-5 h-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {products?.filter((product) => product && product.name).map((product, index) => (
                                    <div
                                        key={product._id}
                                        className="bg-white rounded-lg shadow p-4 flex flex-col gap-2 hover:shadow-md hover:-translate-y-0.5 transition"
                                    >
                                        <div className="flex justify-between items-center text-sm text-gray-500">
                                            <span>#{index + 1}</span>
                                            <div className="flex gap-2">
                                                <button
                                                    title="Edit"
                                                    onClick={() => handleEdit(product._id)}
                                                    className="text-blue-600 hover:text-blue-800 transition"
                                                >
                                                    <Pencil className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product._id)}
                                                    title="Delete"
                                                    className="text-red-600 hover:text-red-800 transition"
                                                >
                                                    <Trash className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="relative overflow-hidden rounded-md">
                                            <img
                                                src={product?.image?.[0]?.url || '/placeholder.jpg'}
                                                alt={product?.name ?? 'Product Image'}
                                                className="w-full h-40 object-cover transform hover:scale-105 transition duration-300"
                                            />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                                        <div className="grid grid-cols-2 gap-1 text-sm text-gray-700">
                                            <div>
                                                Price: <span className="font-medium">₹{product.price}</span>
                                            </div>
                                            <div>
                                                Rating: {product.ratings} <Star className="w-4 h-4 text-yellow-500 inline" />
                                            </div>
                                            <div>
                                                Category: <span className="px-2 py-0.5 bg-gray-200 text-gray-800 rounded text-xs">{product.category}</span>
                                            </div>
                                            <div className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                                                Stock: {product.stock}
                                            </div>
                                            <div className="col-span-2 text-gray-600">
                                                Created: {formatDate(product.createdAt)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </main>
                    <Footer />
                </>
            )}
        </>
    );
};

export default ProductList;
