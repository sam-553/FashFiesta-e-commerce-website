'use client'

import React, { useEffect, useMemo, useState } from 'react';
import Navbar from '../navbar/page';
import Footer from '../footer/page';
import Checkoutpath from '../checkoutPath/page';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';

const OrderConfirmation = () => {
  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);
  const totalPrice = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [cartItems]
  );
  const shippingCharge = totalPrice > 500 ? 0 : 10;
  const taxAmount = Math.floor(totalPrice * 0.18);
  const grandTotal = totalPrice + shippingCharge + taxAmount;

  const proceedToPayment = () => {
    const data = {
      shippingCharge,
      taxAmount,
      grandTotal, totalPrice
    }
    sessionStorage.setItem('orderSummary', JSON.stringify(data));
    router.push('/addPayment');
    console.log(data);

  }

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-10 mt-16 max-w-3xl">
        <Checkoutpath activepath={1} />
        <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-10 text-gray-800">
          Confirm Your Order
        </h1>

        {/* Shipping Details */}
        <section className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100 transition hover:shadow-xl">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Shipping Details</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm md:text-base text-gray-700">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-3">Name</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Address</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t hover:bg-gray-50">
                  <td className="p-3">{isMounted ? user?.name ?? "N/A" : "Loading..."}</td>
                  <td className="p-3">{isMounted ? shippingInfo?.phone ?? "N/A" : "Loading..."}</td>
                  <td className="p-3">
                    {isMounted ? (
                      `${shippingInfo?.address ?? ""}, ${shippingInfo?.city ?? ""}, ${shippingInfo?.state ?? ""}, ${shippingInfo?.country ?? ""}, ${shippingInfo?.pincode ?? ""}`
                    ) : (
                      "Loading..."
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Cart Items */}
        <section className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100 transition hover:shadow-xl">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Your Cart Items</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm md:text-base">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="p-3 text-left">Image</th>
                  <th className="p-3 text-left">Product</th>
                  <th className="p-3 text-center">Quantity</th>
                  <th className="p-3 text-right">Price</th>
                  <th className="p-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {isMounted ? (
                  cartItems.length > 0 ? (
                    cartItems.map((item, index) => (
                      <tr key={index} className="border-t hover:bg-gray-50">
                        <td className="p-3">
                          <img
                            src={item.image || "/placeholder.png"}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                        </td>
                        <td className="p-3">{item.name}</td>
                        <td className="p-3 text-center">{item.quantity}</td>
                        <td className="p-3 text-right">₹{item.price}</td>
                        <td className="p-3 text-right">₹{item.price * item.quantity}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="p-3 text-center" colSpan={5}>
                        Your cart is empty.
                      </td>
                    </tr>
                  )
                ) : (
                  <tr>
                    <td className="p-3 text-center" colSpan={5}>
                      Loading...
                    </td>
                  </tr>
                )}
              </tbody>


            </table>
          </div>
        </section>

        {/* Order Summary */}
        <section className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 transition hover:shadow-xl">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Order Summary</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm md:text-base text-gray-700">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-3">Subtotal</th>
                  <th className="p-3">Shipping Charges</th>
                  <th className="p-3">Tax</th>
                  <th className="p-3">Total</th>
                </tr>
              </thead>
              <tbody>
                {
                  isMounted ? (
                    <tr className="border-t hover:bg-gray-50 font-semibold">
                      <td className="p-3">{totalPrice}</td>
                      <td className="p-3">{shippingCharge}</td>
                      <td className="p-3">{taxAmount}</td>
                      <td className="p-3">{grandTotal}</td>
                    </tr>
                  ) : (
                    <tr>
                      <td className="p-3 text-center" colSpan={5}>
                        Loading...
                      </td>
                    </tr>
                  )
                }
              </tbody>
            </table>
          </div>
          <div className="flex justify-center mt-6">
            <button className="w-[80%] md:w-[50%] bg-gray-800 hover:bg-gray-900 text-white py-3 rounded-xl font-semibold shadow-md transition transform hover:scale-105 active:scale-95" onClick={proceedToPayment} >
              Proceed to Payment
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default OrderConfirmation;