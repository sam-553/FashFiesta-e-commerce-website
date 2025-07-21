'use client'

import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../navbar/page';
import Footer from '../footer/page';
import { IconTrash } from '@tabler/icons-react';
import { toast } from 'react-toastify';
import { removeFromCart } from '../features/cart/cartSlice';
import { useRouter } from 'next/navigation';

const Cartitem = () => {
  const cartState = useSelector((state) => state.cart);
  const { isAuthenticated, user } = useSelector((state) => state.user);

  const [cartItems, setCartItems] = useState([]);
  const dispatch = useDispatch();
  const router = useRouter();


  useEffect(() => {
    if (cartState.cartItems && cartState.cartItems.length > 0) {
      setCartItems(cartState.cartItems);
    } else {
      const localCart = localStorage.getItem('cartItems');
      if (localCart) {
        setCartItems(JSON.parse(localCart));
      }
    }
  }, [cartState.cartItems]);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const totalQuantity = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.quantity, 0),
    [cartItems]
  );

  const totalPrice = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [cartItems]
  );


  const handleIncrease = (productId) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.product === productId
          ? item.quantity < item.stock
            ? { ...item, quantity: item.quantity + 1 }
            : (toast.error('Cannot exceed available stock'), item)
          : item
      )
    );
  };

  const handleDecrease = (productId) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.product === productId
          ? item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item
          : item
      )
    );
  };

  const handleRemove = (productId) => {
    dispatch(removeFromCart(productId));
    toast.success('Item removed from cart');
  };

  const shippingCharge = totalPrice > 500 ? 0 : 10;
  const taxAmount = totalPrice * 0.18;
  const grandTotal = totalPrice + shippingCharge + taxAmount;

  const handleCheckout = () => {
    if (!isAuthenticated) {
      router.push('/login');
      toast.error('please login to continue shopping')
    } else {
      router.push('/shipping');
    }
  };


  return (
    <>
      <Navbar />
      <main className='container mx-auto py-10 px-4 mt-10'>
        <h1 className='text-2xl font-bold text-center mb-8 text-gray-800'>Your Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center text-gray-500">
            Your cart is empty.
            <div className="mt-4">
              <a
                href="/products"
                className="inline-block bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded transition"
              >
                Continue Shopping
              </a>
            </div>
          </div>
        ) : (
          <div className='flex flex-col lg:flex-row gap-10 lg:justify-between'>
            {/* Cart Items */}
            <div className='w-full max-w-3xl space-y-4'>
              {cartItems.map((item) => (
                <div
                  key={item.product}
                  className='flex bg-white rounded-xl shadow hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-200'
                >
                  <div className='min-w-[128px] h-32 bg-gray-100 flex items-center justify-center'>
                    <img
                      src={item.image}
                      alt={item.name}
                      className='h-24 w-24 object-contain transition-transform duration-300 hover:scale-110'
                    />
                  </div>
                  <div className='flex-1 p-4 relative'>
                    <button
                      onClick={() => handleRemove(item.product)}
                      className='absolute top-2 right-2 text-gray-500 hover:bg-gray-600 hover:text-white p-2 rounded-full transition-colors duration-200'
                    >
                      <IconTrash size={18} />
                    </button>
                    <h2 className='text-lg font-semibold text-gray-800 line-clamp-1'>{item.name}</h2>
                    <p className='text-sm text-gray-500 mb-2'>Quantity: {item.quantity}</p>
                    <div className='flex items-center justify-between mb-2'>
                      <span className='text-gray-700 font-semibold'>₹{item.price}</span>
                      <span className='text-gray-800 font-semibold'>₹{item.price * item.quantity}</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <button
                        className='w-7 h-7 border border-gray-600 text-gray-600 rounded hover:bg-gray-600 hover:text-white transition'
                        onClick={() => handleDecrease(item.product)}
                      >
                        -
                      </button>
                      <span className='px-2'>{item.quantity}</span>
                      <button
                        className='w-7 h-7 border border-gray-600 text-gray-600 rounded hover:bg-gray-600 hover:text-white transition'
                        onClick={() => handleIncrease(item.product)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className='w-full max-w-sm'>
              <div className='bg-white rounded-xl shadow border border-gray-200 overflow-hidden'>
                <h2 className='bg-gray-600 text-white text-lg font-medium px-4 py-2'>Summary</h2>
                <div className='p-4 space-y-4'>
                  <div className='flex justify-between text-gray-700 font-medium'>
                    <span>Quantity</span>
                    <span>{totalQuantity}</span>
                  </div>
                  <div className='flex justify-between text-gray-700 font-medium'>
                    <span>Subtotal</span>
                    <span>₹{totalPrice}</span>
                  </div>
                  <div className='flex justify-between text-gray-700 font-medium'>
                    <span>Shipping Charge</span>
                    <span>₹{shippingCharge}</span>
                  </div>
                  <div className='flex justify-between text-gray-700 font-medium'>
                    <span>Tax (18%)</span>
                    <span>₹{taxAmount.toFixed(2)}</span>
                  </div>
                  <div className='flex justify-between text-gray-800 font-bold border-t pt-2'>
                    <span>Grand Total</span>
                    <span>₹{grandTotal.toFixed(2)}</span>
                  </div>
                  <button
                    className='w-full bg-gray-600 hover:bg-gray-700 text-white py-2 rounded transition'
                    onClick={handleCheckout}
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};

export default Cartitem;
