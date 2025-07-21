'use client'

import React, { useEffect } from 'react';
import Navbar from '../navbar/page';
import Footer from '../footer/page';
import { PackageCheck, CheckCircle, XCircle, ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { getAllMyOrders } from '../features/order/orderSlice';




const OrdersPage = () => {
    const router = useRouter();
    const { orders = [], loading, error } = useSelector((state) => state.order);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllMyOrders());
    }, [dispatch]);

    const handleViewOrder = (id) => {
        router.push(`/vieworderDetails/${id}`);
    };

    return (
        <>
            <Navbar />
            <main className="container mx-auto px-4 py-12 mt-16 max-w-4xl">
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-8 text-center">
                    🛍️ Your Orders
                </h1>

                {loading ? (
                    <p className="text-center text-gray-500 animate-pulse">Loading orders...</p>
                ) : error ? (
                    <p className="text-center text-red-500">{error}</p>
                ) : orders.length === 0 ? (
                    <div className="flex flex-col items-center gap-2 text-gray-600">
                        <ShoppingBag size={48} className="text-gray-400" />
                        <p>No orders found.</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {orders.map((order) => (
                            <div
                                key={order._id}
                                className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition duration-200 cursor-pointer"
                                onClick={() => handleViewOrder(order._id)}
                            >
                                <div className="flex justify-between items-center mb-3">
                                    <div className="flex items-center gap-2 text-gray-700 font-semibold">
                                        <PackageCheck className="text-indigo-500" size={20} />
                                        <span>Order ID:</span>
                                        <span className="text-gray-900 truncate max-w-[150px]">
                                            {order._id}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2 text-sm">
                                    <div className="flex flex-col">
                                        <span className="text-gray-500">Status</span>
                                        <span
                                            className={`px-2 py-0.5 rounded-full text-xs font-semibold w-fit ${order.orderStatus === 'Delivered'
                                                    ? 'bg-green-100 text-green-700'
                                                    : order.orderStatus === 'Processing'
                                                        ? 'bg-yellow-100 text-yellow-700'
                                                        : 'bg-blue-100 text-blue-700'
                                                }`}
                                        >
                                            {order.orderStatus}
                                        </span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-gray-500">Items</span>
                                        <span className="font-medium">{order.orderItems.length}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-gray-500">Total</span>
                                        <span className="font-medium">₹{order.totalPrice}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-gray-500">Payment</span>
                                        {order.paymentInfo && order.paymentInfo.status === 'paid' ? (
                                            <span className="px-2 py-0.5 rounded-full text-xs font-semibold w-fit bg-green-100 text-green-700">
                                                Paid
                                            </span>
                                        ) : (
                                            <span className="px-2 py-0.5 rounded-full text-xs font-semibold w-fit bg-red-100 text-red-700">
                                                Pending
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-4 text-right">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleViewOrder(order._id);
                                        }}
                                        className="text-indigo-600 hover:underline text-sm font-medium"
                                    >
                                        View Order Details →
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </>
    );
};

export default OrdersPage;
