'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import Navbar from '../navbar/page';
import Footer from '../footer/page';
import { useDispatch, useSelector } from 'react-redux';
import { createNewOrder, removeError, removeSuccess } from '../features/order/orderSlice';
import { toast } from 'react-toastify';
import { clearCart } from '../features/cart/cartSlice';
import Loader from '../loader/page';

const PaymentSuccess = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const [reference, setReference] = useState('');

    const { shippingInfo, cartItems } = useSelector((state) => state.cart);
    const { loading, success, error } = useSelector((state) => state.order);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const ref = params.get('reference');
            setReference(ref);
        }
    }, []);

    const handleContinueShopping = () => {
        router.push('/');
    };

    const handleViewOrders = () => {
        router.push('/orders');
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const orderItems = JSON.parse(sessionStorage.getItem('orderSummary'));
            if (!orderItems || !reference) return;

            const createOrderData = async () => {
                try {
                    const orderData = {
                        shippingInfo: {
                            address: shippingInfo?.address ?? "",
                            city: shippingInfo?.city ?? "",
                            state: shippingInfo?.state ?? "",
                            country: shippingInfo?.country ?? "",
                            pinCode: shippingInfo?.pincode ?? "",
                            phoneNo: shippingInfo?.phone ?? "",
                        },
                        orderItems: cartItems.map((item) => ({
                            name: item.name,
                            price: item.price,
                            quantity: item.quantity,
                            image: item.image,
                            product: item.product,
                        })),
                        paymentInfo: {
                            id: reference,
                            status: 'paid',
                        },
                        itemPrice: orderItems.totalPrice,
                        taxPrice: orderItems.taxAmount,
                        shippingPrice: orderItems.shippingCharge,
                        totalPrice: orderItems.grandTotal,
                    };
                    console.log(orderData);
                    dispatch(createNewOrder(orderData));
                    sessionStorage.removeItem('orderSummary');
                } catch (error) {
                    toast.error('Order creation error');
                }
            };
            createOrderData();
        }
    }, [dispatch, shippingInfo, cartItems, reference]);

    useEffect(() => {
        if (success) {
            toast.success('Order placed successfully');
            dispatch(clearCart());
            dispatch(removeSuccess());
        }
    }, [dispatch, success]);

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(removeError());
        }
    }, [dispatch, error]);

    return (
        <>
            <Navbar />
            {loading ? (
                <Loader />
            ) : (
                <main className="flex flex-col items-center justify-center min-h-[80vh] py-12 px-4 bg-gradient-to-b from-green-50 via-white to-white relative overflow-hidden mt-10">
                    <div className="absolute inset-0 bg-[url('/confetti.svg')] bg-repeat opacity-10 pointer-events-none animate-fadeIn"></div>
                    <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full text-center border border-gray-100 animate-fadeIn">
                        <div className="flex justify-center mb-4 animate-bounce">
                            <CheckCircle className="text-green-500" size={72} />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-green-700 mb-2">
                            🎉 Payment Successful!
                        </h1>
                        <p className="text-gray-600 mb-4">
                            Thank you for your purchase. Your payment was processed successfully, and your order is being prepared.
                        </p>
                        {reference && (
                            <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg mb-6 text-sm break-all border border-gray-200">
                                <span className="font-medium">Payment Reference:</span> {reference}
                            </div>
                        )}
                        <div className="flex flex-col md:flex-row gap-4 justify-center">
                            <button
                                onClick={handleContinueShopping}
                                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition transform hover:scale-105 active:scale-95"
                            >
                                Continue Shopping
                            </button>
                            <button
                                onClick={handleViewOrders}
                                className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition transform hover:scale-105 active:scale-95"
                            >
                                View Orders
                            </button>
                        </div>
                    </div>
                </main>
            )}
            <Footer />
        </>
    );
};

export default PaymentSuccess;
