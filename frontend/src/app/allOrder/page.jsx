'use client'

import React, { useEffect } from 'react';
import Navbar from '@/app/navbar/page';
import Footer from '@/app/footer/page';
import { useRouter } from 'next/navigation';
import { Pencil, Trash } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteOrder, fetchAllOrders, removeError } from '../features/admin/adminSlice';
import { toast } from 'react-toastify';
import Loader from '../loader/page';

const AllOrdersPage = () => {
    const router = useRouter();
    const { orders, error, loading } = useSelector((state) => state.admin);
    const dispatch = useDispatch();

    const handleView = (orderId) => {
        router.push(`/updateOrder/${orderId}`);
    };

    const handleDelete = async (orderId) => {
        if (confirm('Are you sure you want to delete this order?')) {
            try {
                await dispatch(deleteOrder(orderId)).unwrap();
                toast.success('Order deleted successfully');
                dispatch(fetchAllOrders());
            } catch (error) {
                toast.error(typeof error === 'string' ? error : error?.message || 'Error deleting order');
            }
        }
    };

    useEffect(() => {
        dispatch(fetchAllOrders());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            toast.error(typeof error === 'string' ? error : error?.message || 'Error fetching order');
            dispatch(removeError());
        }
    }, [dispatch, error]);

    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <>
                    <Navbar />
                    <div className="max-w-6xl mx-auto px-4 mt-20">
                        <h2 className="text-center text-3xl font-bold text-gray-800 mb-8">All Orders</h2>

                        <div className="overflow-x-auto rounded-2xl shadow-lg">
                            <table className="min-w-full bg-white rounded-2xl">
                                <thead className="bg-gradient-to-r from-gray-300 to-gray-300">
                                    <tr>
                                        <th className="text-left p-4 font-semibold text-gray-700">S.No</th>
                                        <th className="text-left p-4 font-semibold text-gray-700">Order ID</th>
                                        <th className="text-left p-4 font-semibold text-gray-700">Status</th>
                                        <th className="text-left p-4 font-semibold text-gray-700">Total Price</th>
                                        <th className="text-left p-4 font-semibold text-gray-700">Number of Items</th>
                                        <th className="text-center p-4 font-semibold text-gray-700">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order, index) => (
                                        <tr
                                            key={order._id}
                                            className="hover:bg-gray-100 transition duration-200"
                                        >
                                            <td className="p-4">{index + 1}</td>
                                            <td className="p-4 font-mono text-sm text-gray-700">{order._id}</td>
                                            <td
                                                className={`p-4 font-semibold ${
                                                    order.orderStatus === 'Delivered'
                                                        ? 'text-green-600'
                                                        : order.orderStatus === 'Shipped'
                                                        ? 'text-blue-600'
                                                        : 'text-yellow-600'
                                                }`}
                                            >
                                                {order.orderStatus}
                                            </td>
                                            <td className="p-4">₹{order.totalPrice.toLocaleString()}</td>
                                            <td className="p-4">{order.orderItems.length}</td>
                                            <td className="p-4 text-center flex items-center justify-center gap-3">
                                                <button
                                                    onClick={() => handleView(order._id)}
                                                    className="p-2 rounded-full border border-gray-300 hover:bg-blue-100 hover:border-blue-400 transition"
                                                    title="View / Edit"
                                                >
                                                    <Pencil className="w-5 h-5 text-blue-600" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(order._id)}
                                                    className="p-2 rounded-full border border-gray-300 hover:bg-red-100 hover:border-red-400 transition"
                                                    title="Delete"
                                                >
                                                    <Trash className="w-5 h-5 text-red-600" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {orders.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="text-center p-6 text-gray-500">
                                                No orders found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <Footer />
                </>
            )}
        </>
    );
};

export default AllOrdersPage;
