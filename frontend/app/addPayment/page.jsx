
'use client'

import React, { useEffect, useState } from 'react';
import Navbar from 'app/navbar/page';
import Footer from 'app/footer/page';

import { useSelector } from 'react-redux';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import axios from 'axios';
import Checkoutpath from '../checkoutPath/page';


const PaymentPage = () => {
  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const [hydrated, setHydrated] = useState(false);
  const router = useRouter();
  const { user } = useSelector((state) => state.user)




  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) return null;

  const subtotal = cartItems?.reduce((acc, item) => acc + item.price * item.quantity, 0) || 0;
  const shippingCharges = subtotal > 1000 ? 0 : 100;
  const tax = subtotal * 0.18;
  const total = subtotal + shippingCharges + tax;



  const handleGoBack = () => {
    router.back();
  };

  const completePayment = async (amount) => {
    try {
      const token = localStorage.getItem('token');

      const config = {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // 1️⃣ Get Razorpay Key
      const { data: keyData } = await axios.get(
        'http://localhost:5000/payment/getKey',
        config
      );
      const { Key } = keyData;
      console.log("Key Data:", Key);

      // 2️⃣ Create Order
      const { data: orderData } = await axios.post(
        'http://localhost:5000/payment/processPayment',
        { amount },
        config
      );
      const { order } = orderData;
      console.log("Order Data:", order);

      if (!window.Razorpay) {
        toast.error("Razorpay SDK not loaded. Please refresh.");
        return;
      }

      // 3️⃣ Setup Razorpay options
      const options = {
        key: Key,
        amount: order.amount,
        currency: "INR",
        name: "FashFiesta",
        description: `Payment for Order #${order.id}`,
        order_id: order.id,
        handler: async function (response) {
          try {
            const { data: verificationData } = await axios.post(
              'http://localhost:5000/payment/paymentVerification',
              {
                razorpay_signature: response.razorpay_signature,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id
              },
              config
            );

            if (verificationData.success) {
              console.log("Payment Success:", response);
              toast.success("Payment successful!");
              router.push(`/paymentSuccess?reference=${verificationData.reference}`);

            } else {
              toast.error("Payment verification failed.");
            }
          } catch (err) {
            console.error(err);
            toast.error("Error verifying payment.");
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
          contact: shippingInfo?.phone,
        },
        notes: {
          address: `${shippingInfo?.address ?? ""}, ${shippingInfo?.city ?? ""}, ${shippingInfo?.state ?? ""}, ${shippingInfo?.country ?? ""}, ${shippingInfo?.pincode ?? ""}`,
        },
        theme: { color: "#3399cc" },
      };

      const razor = new window.Razorpay(options);
      razor.open();

    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Payment processing failed");
    }
  };




  return (

    <>
      <Navbar />
      <main className="container mx-auto px-4 py-10 mt-16 max-w-2xl">
        <Checkoutpath activepath={2} />
        <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-8 text-gray-800">Payment</h1>

        <section className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 transition hover:shadow-xl">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Order Summary</h2>
          <div className="space-y-2 text-gray-700">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping Charges:</span>
              <span>₹{shippingCharges.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax:</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold border-t pt-2">
              <span>Total:</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-8 flex flex-col md:flex-row justify-center gap-4">
            <button
              onClick={() => completePayment(total)}
              className="w-full md:w-[60%] bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-xl font-semibold shadow-md transition transform hover:scale-105 active:scale-95"
            >
              Pay Now
            </button>
            <button
              onClick={handleGoBack}
              className="w-full md:w-[30%] bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-xl font-semibold shadow-md transition transform hover:scale-105 active:scale-95"
            >
              Go Back
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default PaymentPage;

