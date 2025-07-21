'use client'

import React, { useEffect, useState } from 'react';
import { IconMail, IconCheck } from '@tabler/icons-react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { removeError, removeSuccess, requestResetPassword } from '../features/user/userSlice';





const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const { loading, error, success, message } = useSelector(state => state.user);
  const dispatch = useDispatch();

  const forgotPasswordEmail = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('email', email);
    dispatch(requestResetPassword(formData));
  };

  useEffect(() => {
    if (error) {
      toast.error(typeof error === 'string' ? error : error.message || 'Something went wrong');
      dispatch(removeError());
    }
    if (success) {
      toast.success(message || 'Request sent to your email');
      dispatch(removeSuccess());
    }
  }, [error, success, message, dispatch]);

  return (
    <div className="min-h-screen flex justify-center items-center px-4 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-2xl bg-white/60 backdrop-blur-md">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800 tracking-tight">
          Reset Your Password
        </h2>

        <form className="space-y-5" onSubmit={forgotPasswordEmail}>
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-600 focus:outline-none transition"
                placeholder="Enter your registered email"
                required
              />
              <div className="absolute inset-y-0 right-3 flex items-center text-gray-500">
                <IconMail size={20} />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg text-white flex items-center justify-center gap-2 transition 
              ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black'}`}
          >
            <IconCheck size={20} />
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
