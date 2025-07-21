'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';

import { Loader2, PackageCheck, ShoppingCart, Truck, IndianRupee } from 'lucide-react';
import { getSingleOrder } from 'app/features/order/orderSlice';
import Navbar from 'app/navbar/page';
import Footer from 'app/footer/page';

const OrderDetailsPage = () => {
    const params = useParams();
    const dispatch = useDispatch();
    const { order, loading, error } = useSelector((state) => state.order);

    useEffect(() => {
        if (params.id) {
            dispatch(getSingleOrder(params.id));
        }
    }, [dispatch, params.id]);

    return (
        <>
            <Navbar />
            <main className="container mx-auto px-4 py-12 mt-16 max-w-3xl min-h-screen animate-fade-in ">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-center text-gray-800 mb-10 tracking-tight drop-shadow">
                    Order Details
                </h1>

                {loading ? (
                    <div className="flex justify-center items-center text-gray-600 animate-pulse">
                        <Loader2 className="animate-spin mr-2 w-6 h-6" /> Loading your order...
                    </div>
                ) : error ? (
                    <p className="text-center text-red-500 font-medium">{error}</p>
                ) : order && order.orderItems ? (
                    <div className="bg-white/60 backdrop-blur-lg border border-gray-200 rounded-3xl shadow-2xl p-8 transition-transform hover:scale-[1.01] space-y-8">

                        {/* Order ID */}
                        <div className="flex items-center gap-2 text-gray-700">
                            <PackageCheck className="text-gray-700" />
                            <span className="font-semibold">Order ID:</span>
                            <span className="truncate text-sm text-gray-600">{order._id}</span>
                        </div>

                        <hr className="border-gray-300" />

                        {/* Order Information */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                { label: 'Order Status', value: order.orderStatus, color: order.orderStatus === 'Delivered' ? 'text-green-600' : 'text-yellow-600' },
                                { label: 'Payment Status', value: order.paymentInfo?.status === 'paid' ? 'Paid' : 'Pending', color: order.paymentInfo?.status === 'paid' ? 'text-green-600' : 'text-red-600' },
                                { label: 'Paid At', value: order.paidAt ? new Date(order.paidAt).toLocaleString() : 'Not Paid', color: 'text-gray-800' },
                                { label: 'Ordered On', value: new Date(order.createdAt).toLocaleString(), color: 'text-gray-800' },
                            ].map((item, idx) => (
                                <div key={idx} className="bg-white/40 rounded-xl p-4 shadow hover:shadow-lg transition-transform hover:scale-[1.02]">
                                    <div className="text-gray-500 text-xs sm:text-sm">{item.label}</div>
                                    <div className={`font-semibold ${item.color}`}>{item.value}</div>
                                </div>
                            ))}
                        </div>

                        <hr className="border-gray-300" />

                        {/* Items Ordered */}
                        <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-700 mt-8">
                            <ShoppingCart /> Items Ordered
                        </h2>

                        <div className="mt-4 rounded-2xl overflow-hidden shadow-lg border border-gray-200 bg-white/50 backdrop-blur">

                            {/* Table Header */}
                            <div className="grid grid-cols-12 gap-2 bg-gray-100 text-gray-700 font-semibold text-sm py-3 px-4">
                                <div className="col-span-2 text-center mr-6">Image</div>
                                <div className="col-span-4 ml-8">Product Name</div>
                                <div className="col-span-3 text-center">Quantity</div>
                                <div className="col-span-3 text-center">Price</div>
                            </div>

                            {/* Table Rows */}
                            {order.orderItems.map((item) => (
                                <div
                                    key={item._id}
                                    className="grid grid-cols-12 gap-2 items-center py-3 px-4 border-t border-gray-200 hover:bg-white/60 transition-all duration-150"
                                >
                                    {/* Image */}
                                    <div className="col-span-3 flex justify-center mr-20">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-16 h-16 object-cover rounded-lg border border-gray-300 shadow-sm hover:scale-105 transition-transform"
                                        />
                                    </div>

                                    {/* Product Name */}
                                    <div className="col-span-3">
                                        <div className="font-medium text-gray-800 truncate">{item.name}</div>
                                    </div>

                                    {/* Quantity */}
                                    <div className="col-span-3 text-center text-gray-700 font-medium">
                                        {item.quantity}
                                    </div>

                                    {/* Price */}
                                    <div className="col-span-3 text-center text-gray-800 font-semibold">
                                        ₹{item.price.toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <hr className="border-gray-300" />

                        {/* Price Breakdown */}
                        <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-700">
                            <IndianRupee /> Price Details
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                { label: 'Items Price', value: `₹${(order.itemPrice ?? 0).toFixed(2)}` },
                                { label: 'Tax Price', value: `₹${(order.taxPrice ?? 0).toFixed(2)}` },
                                { label: 'Shipping Price', value: `₹${(order.shippingPrice ?? 0).toFixed(2)}` },
                                { label: 'Total Price', value: `₹${(order.totalPrice ?? 0).toFixed(2)}` },
                            ].map((item, idx) => (
                                <div key={idx} className="bg-white/40 rounded-xl p-4 shadow hover:shadow-lg transition-transform hover:scale-[1.02]">
                                    <div className="text-gray-500 text-xs sm:text-sm">{item.label}</div>
                                    <div className="font-semibold text-gray-800">{item.value}</div>
                                </div>
                            ))}
                        </div>

                        <hr className="border-gray-300" />

                        {/* Shipping Information */}
                        <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-700">
                            <Truck /> Shipping Information
                        </h2>
                        <div className="bg-white/40 rounded-xl p-4 text-gray-700 shadow hover:shadow-lg transition-transform hover:scale-[1.02]">
                            <div>
                                {order.shippingInfo?.address}, {order.shippingInfo?.city},{' '}
                                {order.shippingInfo?.state} - {order.shippingInfo?.pinCode}
                            </div>
                            <div>Phone: {order.shippingInfo?.phoneNo}</div>
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-gray-500">No order details found.</p>
                )}
            </main>
            <Footer />
        </>
    );
};

export default OrderDetailsPage;
