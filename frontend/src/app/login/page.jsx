'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { IconEye, IconEyeOff, IconLoader3 } from '@tabler/icons-react';
import { toast } from 'react-toastify';
import { login } from '../features/user/userSlice';

// ✅ Yup validation schema with remember validation
const loginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Please enter your email'),
  password: Yup.string().required('Please enter your password'),
  remember: Yup.boolean().oneOf([true], 'You must check Remember me to proceed'),
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const { error, loading, success } = useSelector(state => state.user);

  const loginForm = useFormik({
    initialValues: {
      email: '',
      password: '',
      remember: false,
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      try {
        const resultAction = await dispatch(login(values));
        if (login.fulfilled.match(resultAction)) {
          const { token } = resultAction.payload;
          localStorage.setItem('token', token);
        }
      } catch (err) {
        // Errors handled by useEffect
      }
    },
  });

  useEffect(() => {
    if (error) {
      toast.error(typeof error === 'string' ? error : error.message || "Something went wrong");
    }
    if (success) {
      toast.success("Login successful!");
      router.push('/');
      loginForm.resetForm();
    }
  }, [error, success]);

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4">
      <div className="w-full max-w-md p-6 bg-gray-50 border border-gray-200 rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl">
        <div className="text-center mb-6">
          <img
            src="/images/assest/signin.png"
            alt="Sign In"
            className="w-20 h-20 mx-auto mb-3 rounded-full shadow-sm hover:scale-105 transition-transform duration-300"
          />
          <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
          <p className="text-sm text-gray-500">Sign in to continue</p>
        </div>

        <form className="space-y-5" onSubmit={loginForm.handleSubmit} noValidate>
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              onChange={loginForm.handleChange}
              onBlur={loginForm.handleBlur}
              value={loginForm.values.email}
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-200"
              placeholder="you@example.com"
            />
            {loginForm.touched.email && loginForm.errors.email && (
              <p className="text-xs text-red-600 mt-1">{loginForm.errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between mb-1">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
              <Link href="/forgotPassword" className="text-sm text-red-600 hover:underline">Forgot?</Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                onChange={loginForm.handleChange}
                onBlur={loginForm.handleBlur}
                value={loginForm.values.password}
                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-200"
                placeholder="••••••••"
              />
              <span
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <IconEye size={20} /> : <IconEyeOff size={20} />}
              </span>
            </div>
            {loginForm.touched.password && loginForm.errors.password && (
              <p className="text-xs text-red-600 mt-1">{loginForm.errors.password}</p>
            )}
          </div>

          {/* Remember Me */}
          <div className="flex flex-col">
            <div className="flex items-center">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                onChange={loginForm.handleChange}
                onBlur={loginForm.handleBlur}
                checked={loginForm.values.remember}
                className="h-4 w-4 text-gray-700 border-gray-300 rounded focus:ring-gray-500"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-gray-700">Remember me</label>
            </div>
            {loginForm.touched.remember && loginForm.errors.remember && (
              <p className="text-xs text-red-600 mt-1">{loginForm.errors.remember}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-600 text-sm font-medium tracking-wide flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <IconLoader3 className="animate-spin" />
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>

          <p className="text-center text-sm text-gray-700 mt-3">
            Don’t have an account?
            <Link href="/signup" className="ml-1 text-red-600 hover:underline font-medium">
              Create Account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
