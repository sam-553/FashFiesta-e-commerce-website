'use client';

import React from 'react';
import { Provider } from "react-redux";
import { store } from "./store";
import { ToastContainer } from "react-toastify";
import Script from "next/script";

export default function Providers({ children }) { 
  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
      <Provider store={store}>
        <ToastContainer position="top-center" />
        {children}
      </Provider>
    </>
  );
}
