'use client'

import React, { useEffect, useState } from 'react';
import Navbar from '../navbar/page';
import Footer from '../footer/page';
import Checkoutpath from '../checkoutPath/page';
import { Country, State, City } from 'country-state-city';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { removeError, saveShippingInfo } from '../features/cart/cartSlice';
import { useRouter } from 'next/navigation';

const Shipping = () => {
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const { shippinfInfo } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const router = useRouter()

  const states = country ? State.getStatesOfCountry(country) : [];
  const cities = country && state ? City.getCitiesOfState(country, state) : [];

  const handleshopinginfoSubmit = (e) => {
    e.preventDefault(); // needed so form submits correctly without reloading
    if (phone.length !== 10) {
      toast.error('Phone number is invalid, please enter a valid phone number');
    }

    else {
      dispatch(saveShippingInfo({ phone, pincode, country, state, city, address }))
      toast.success('Address added successfully');
      router.push('/confirmOrder')
    }
    // here you can dispatch shipping info to Redux or proceed to next step

  };



  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-10 mt-12 max-w-4xl">
        <Checkoutpath activepath={0} />

        <h1 className="text-3xl font-extrabold text-center mb-8 text-gray-800">
          Shipping Details
        </h1>

        <form
          className="bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-gray-100 w-full"
          onSubmit={handleshopinginfoSubmit}
        >
          {/* Address and Country */}
          <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
            <div className="flex flex-col flex-1">
              <label htmlFor="address" className="mb-1 text-gray-700 font-medium">
                Address
              </label>
              <input
                id="address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="123 Main Street"
                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-400 transition shadow-sm"
              />
            </div>

            <div className="flex flex-col flex-1">
              <label htmlFor="country" className="mb-1 text-gray-700 font-medium">
                Country
              </label>
              <select
                id="country"
                value={country}
                onChange={(e) => {
                  setCountry(e.target.value);
                  setState('');
                  setCity('');
                }}
                className="border border-gray-300 rounded-lg p-3 bg-white focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-400 transition shadow-sm"
              >
                <option value="">Select Country</option>
                {Country.getAllCountries().map((item) => (
                  <option key={item.isoCode} value={item.isoCode}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Phone and State */}
          <div
            className={`flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 ${country ? 'md:max-w-full' : 'md:max-w-[50%]'
              }`}
          >
            <div className="flex flex-col flex-1">
              <label htmlFor="phone" className="mb-1 text-gray-700 font-medium">
                Phone Number
              </label>
              <input
                id="phone"
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone Number"
                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-400 transition shadow-sm"
              />
            </div>

            {country && (
              <div className="flex flex-col flex-1">
                <label htmlFor="state" className="mb-1 text-gray-700 font-medium">
                  State
                </label>
                <select
                  id="state"
                  value={state}
                  onChange={(e) => {
                    setState(e.target.value);
                    setCity('');
                  }}
                  className="border border-gray-300 rounded-lg p-3 bg-white focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-400 transition shadow-sm"
                >
                  <option value="">Select State</option>
                  {states.map((item) => (
                    <option key={item.isoCode} value={item.isoCode}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Pincode and City */}
          <div
            className={`flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 ${state ? 'md:max-w-full' : 'md:max-w-[50%]'
              }`}
          >
            <div className="flex flex-col flex-1">
              <label htmlFor="pincode" className="mb-1 text-gray-700 font-medium">
                Pin Code
              </label>
              <input
                id="pincode"
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="Postal Code"
                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-400 transition shadow-sm"
              />
            </div>

            {state && (
              <div className="flex flex-col flex-1">
                <label htmlFor="city" className="mb-1 text-gray-700 font-medium">
                  City
                </label>
                <select
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="border border-gray-300 rounded-lg p-3 bg-white focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-400 transition shadow-sm"
                >
                  <option value="">Select City</option>
                  {cities.map((item) => (
                    <option key={item.name} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"

            className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-semibold shadow-lg transition transform hover:scale-[1.02] active:scale-95"
          >
            Continue to Confirm Order
          </button>
        </form>
      </main>
      <Footer />
    </>
  );
};

export default Shipping;
