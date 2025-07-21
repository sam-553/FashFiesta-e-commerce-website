'use client'

import React, { useEffect, useState } from 'react';
import Navbar from 'app/navbar/page';
import Footer from 'app/footer/page';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useRouter } from 'next/navigation';
import { getSingleOrder } from 'app/features/order/orderSlice';
import { removeSuccess, removeError, updateOrderStatus } from 'app/features/admin/adminSlice';
import { toast } from 'react-toastify';

import Loader from 'app/loader/page';

const UpdateOrderPage = () => {
    const [status, setStatus] = useState('');
    const dispatch = useDispatch();
    const params = useParams();
    const orderId = params.id;
    const router = useRouter()

    const { order, loading, error } = useSelector((state) => state.order);
    const { success, error: adminError } = useSelector((state) => state.admin);

    useEffect(() => {
        if (orderId) {
            dispatch(getSingleOrder(orderId));
        }
    }, [dispatch, orderId]);

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(removeError());
        }
        if (adminError) {
            toast.error(adminError);
            dispatch(removeError());
        }
        if (success) {
            toast.success('Order status updated successfully');
            dispatch(removeSuccess());
            router.push('/allOrder')
        }
    }, [error, adminError, success, dispatch]);

    const handleUpdateStatus = () => {
        if (!status) {
            toast.error('Please select a status before updating.');
            return;
        }
        dispatch(updateOrderStatus({ orderId, status }));
    };

    return (
        <>
            {
                loading ? (<Loader />) : (
                    <>
                        <Navbar />
                        <div className="max-w-4xl mx-auto px-4 mt-20 mb-16">
                            <h2 className="text-center text-3xl font-bold text-gray-800 mb-8">
                                Update Order
                            </h2>

                            {/* Order Info */}
                            <div className="bg-white shadow rounded-2xl p-6 space-y-4 mb-8">
                                <div>
                                    <p className="text-gray-500 text-sm">Order ID</p>
                                    <p className="font-mono text-gray-800">{order?._id || 'Loading...'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm">Payment Status</p>
                                    <p className={`font-semibold ${order?.paymentInfo?.status === 'succeeded' ? 'text-green-600' : 'text-red-600'}`}>
                                        {order?.paymentInfo?.status || 'Loading...'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm">Total Price</p>
                                    <p className="font-semibold text-gray-800">₹{order?.totalPrice || '0'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm">Shipping Info</p>
                                    <p className="text-gray-800">
                                        {order?.shippingInfo?.address || ''}, {order?.shippingInfo?.city || ''}, {order?.shippingInfo?.state || ''}, {order?.shippingInfo?.country || ''} - {order?.shippingInfo?.pinCode || ''}
                                    </p>
                                    <p className="text-gray-800">Phone: {order?.shippingInfo?.phoneNo || ''}</p>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="bg-white shadow rounded-2xl p-6 mb-8">
                                <h3 className="text-xl font-semibold text-gray-800 mb-4">Order Items</h3>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full bg-white rounded-2xl">
                                        <thead className="bg-gradient-to-r from-gray-100 to-gray-200">
                                            <tr>
                                                <th className="text-left p-4 font-semibold text-gray-700">Image</th>
                                                <th className="text-left p-4 font-semibold text-gray-700">Name</th>
                                                <th className="text-left p-4 font-semibold text-gray-700">Quantity</th>
                                                <th className="text-left p-4 font-semibold text-gray-700">Price</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {order?.orderItems?.map((item, index) => (
                                                <tr key={index} className="hover:bg-gray-50 transition">
                                                    <td className="p-4">
                                                        <img src={item.image} alt={item.name} className="w-14 h-14 rounded-lg object-cover hover:scale-105 transition-transform" />
                                                    </td>
                                                    <td className="p-4 text-gray-800">{item.name}</td>
                                                    <td className="p-4 text-gray-800">{item.quantity}</td>
                                                    <td className="p-4 text-gray-800">₹{item.price}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Update Order Status */}
                            <div className="bg-white/60 shadow-xl rounded-2xl p-6 space-y-5 border border-gray-200">
                                <h3 className="text-2xl font-bold text-gray-800 mb-2 text-center">Update Order Status</h3>

                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg p-3 bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
                                >
                                    <option value="">Select Status</option>
                                    <option value="Processing">Processing</option>
                                    <option value="On The Way">On The Way</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Delivered">Delivered</option>
                                </select>

                                <button
                                    className="w-full bg-gradient-to-r from-gray-700 to-gray-900 text-white p-3 rounded-xl shadow hover:shadow-lg transition"
                                    onClick={handleUpdateStatus}
                                >
                                    Update Status
                                </button>
                            </div>
                        </div>
                        <Footer />
                    </>
                )
            }
        </>
    );
};

export default UpdateOrderPage;
