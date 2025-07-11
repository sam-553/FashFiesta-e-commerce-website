

"use client";

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllReviews, deleteReviews, fetchSingleProductReviews } from '@/app/features/admin/adminSlice';
import { Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import Loader from '../loader/page';
import Footer from '../footer/page';
import Navbar from '../navbar/page';

const AdminReviewPage = () => {
    const dispatch = useDispatch();
    const { reviews, loading, review: selectedProductReviews } = useSelector((state) => state.admin);

    const [openReviewDetails, setOpenReviewDetails] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        dispatch(fetchAllReviews());
    }, [dispatch]);

    const handleViewReviews = (product) => {
        dispatch(fetchSingleProductReviews(product.productId));
        setSelectedProduct(product);
        setOpenReviewDetails(true);
    };

    const handleCloseReviews = () => {
        setOpenReviewDetails(false);
        setSelectedProduct(null);
    };

  const handleDeleteReview = (reviewId) => {
    if (!selectedProduct) return;

    const confirmDelete = window.confirm("Are you sure you want to delete this review?");
    if (!confirmDelete) return;

    

    dispatch(deleteReviews({ productId: selectedProduct.productId, reviewId }))
        .then(() => {
           toast.update( "Review deleted successfully.");
            dispatch(fetchAllReviews());
            dispatch(fetchSingleProductReviews(selectedProduct.productId)); // Refresh modal after delete
        })
        .catch(() => {
            toast.error("Failed to delete review.");
        });
};


    // Deduplicate reviews by productId for display
    const uniqueProducts = reviews.reduce((acc, curr) => {
        if (!acc.find(item => item.productId === curr.productId)) {
            acc.push({
                productId: curr.productId,
                productName: curr.productName,
                productImage: curr.productImage,
                totalReview: curr.totalReview,
            });
        }
        return acc;
    }, []);

    return (
        <>
        <Navbar/>
           {
            loading?(<Loader/>):(
                 <div className="max-w-5xl mx-auto p-6 space-y-6">
                <h1 className="text-3xl font-bold text-gray-800 text-center">Product Reviews Management</h1>

                <div className="overflow-x-auto rounded-xl shadow-lg">
                    <table className="min-w-full bg-white">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-4 text-left text-gray-700">S. No</th>
                                <th className="p-4 text-left text-gray-700">Product Name</th>
                                <th className="p-4 text-left text-gray-700">Product Image</th>
                                <th className="p-4 text-left text-gray-700">Total Reviews</th>
                                <th className="p-4 text-left text-gray-700">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {uniqueProducts && uniqueProducts.length > 0 ? (
                                uniqueProducts.map((item, index) => (
                                    <tr key={item.productId} className="hover:bg-blue-50 transition cursor-pointer">
                                        <td className="p-4 text-gray-600">{index + 1}</td>
                                        <td className="p-4 font-medium text-gray-800">{item.productName}</td>
                                        <td className="p-4">
                                            <img
                                                src={item.productImage?.[0]?.url || '/fallback.png'}
                                                alt={item.productName || 'Product Image'}
                                                onError={(e) => e.currentTarget.src = '/fallback.png'}
                                                className="w-16 h-16 object-cover rounded shadow"
                                            />
                                        </td>
                                        <td className="p-4 text-gray-600">{item.totalReview}</td>
                                        <td className="p-4">
                                            {item.totalReview > 0 && (
                                                <button
                                                    className="px-3 py-2 rounded-full bg-gray-600 text-white text-sm hover:bg-gray-700 active:scale-95 transition"
                                                    onClick={() => handleViewReviews(item)}
                                                >
                                                    View Reviews
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="p-4 text-center text-gray-500">
                                        {loading ? 'Loading reviews...' : 'No reviews found.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            )
           }

            {openReviewDetails && selectedProduct && (
                <div className="max-w-5xl mx-auto px-4 py-10">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-3xl font-bold text-gray-800">
                            Reviews for {selectedProduct.productName}
                        </h1>
                        <button
                            onClick={handleCloseReviews}
                            className="px-3 py-2 rounded-full bg-red-600 text-white hover:bg-red-700 active:scale-95 transition"
                        >
                            Close
                        </button>
                    </div>
                    <div className="overflow-x-auto rounded-xl shadow">
                        <table className="min-w-full bg-white">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="p-4 text-left text-gray-700">S. No</th>
                                    <th className="p-4 text-left text-gray-700">Rating</th>
                                    <th className="p-4 text-left text-gray-700">Comment</th>
                                    <th className="p-4 text-left text-gray-700">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedProductReviews && selectedProductReviews.length > 0 ? (
                                    selectedProductReviews.map((review, index) => (
                                        <tr key={review._id} className="hover:bg-gray-50">
                                            <td className="p-4 text-gray-600">{index + 1}</td>
                                            <td className="p-4 text-gray-800">{review.rating}</td>
                                            <td className="p-4 text-gray-600 max-w-xs break-words">{review.comment}</td>
                                            <td className="p-4">
                                                <button
                                                    onClick={() => handleDeleteReview(review._id)}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="p-4 text-center text-gray-500">
                                            No reviews for this product.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            <Footer/>
        </>
    );
};

export default AdminReviewPage;