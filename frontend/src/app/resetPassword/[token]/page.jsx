'use client'

import React, { useEffect, useState } from 'react';
import { IconLock, IconCheck } from '@tabler/icons-react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { removeError, resetPassword } from '@/app/features/user/userSlice';

const ResetPassword = () => {
  const [Password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { error, loading, success } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const router = useRouter();
  const { token } = useParams();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Dispatch with correct backend expected keys
    dispatch(resetPassword({ token, password: Password, confirmPassword }));

    // setPassword('');
    // setConfirmPassword('');
  };

  useEffect(() => {
    if (error) {
      toast.error(typeof error === 'string' ? error : error.message || 'Something went wrong');
      dispatch(removeError());
    }
    if (success) {
      toast.success('Password reset successfully!');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    }
  }, [error, success, dispatch, router]);

  return (
    <div className="min-h-screen flex justify-center items-center px-4 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-2xl bg-white/60 backdrop-blur-md">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800 tracking-tight">
          Create New Password
        </h2>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* New Password Field */}
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <div className="relative">
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={Password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-600 focus:outline-none transition"
                placeholder="Enter your new password"
                required
              />
              <div className="absolute inset-y-0 right-3 flex items-center text-gray-500">
                <IconLock size={20} />
              </div>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-600 focus:outline-none transition"
                placeholder="Confirm your new password"
                required
              />
              <div className="absolute inset-y-0 right-3 flex items-center text-gray-500">
                <IconLock size={20} />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg text-white flex items-center justify-center gap-2 transition 
              bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black ${loading && 'opacity-50 cursor-not-allowed'}`}
          >
            <IconCheck size={20} />
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;