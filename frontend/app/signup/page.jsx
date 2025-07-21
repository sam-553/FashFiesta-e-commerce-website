'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { IconEyeOff, IconCheck, IconEye, IconLoader3 } from '@tabler/icons-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../features/user/userSlice';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const signupSchema = Yup.object().shape({
  name: Yup.string().required('Please enter name'),
  email: Yup.string().email('Invalid email').required('Please enter a valid email'),
  password: Yup.string().required('Please enter a strong password'),
  confirmPassword: Yup.string()
    .required('Please confirm your password')
    .oneOf([Yup.ref('password'), null], 'Passwords must match'),
});

const RegisterUser = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { error, success, loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const signupForm = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      image: '',
    },
    validationSchema: signupSchema,
    onSubmit: async (values) => {
      const dataToSend = {
        name: values.name,
        email: values.email,
        password: values.password,
        avatar: values.image,
      };
      dispatch(register(dataToSend));
    },
  });

  useEffect(() => {
    if (error) {
      toast.error(typeof error === 'string' ? error : error.message || 'Something went wrong');
    }
    if (success) {
      toast.success('Registered successfully!');
      router.push('/');
      signupForm.resetForm();
    }
  }, [error, success]);

  const uploadImage = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      signupForm.setFieldValue('image', reader.result);
      toast.success('Profile image ready for upload');
    };
    reader.onerror = () => {
      toast.error('Image upload failed, please try again.');
    };
  };

  return (
    <div className="min-h-screen flex justify-center items-center px-4">
      <div className="w-full max-w-md px-6 py-6 rounded-2xl shadow-2xl bg-gray-50">
        {/* Profile Image Upload */}
        <div className="text-center mb-4">
          <label
            htmlFor="image"
            className="relative w-24 h-24 mx-auto rounded-full overflow-hidden shadow-md cursor-pointer block group hover:scale-105 transition"
          >
            <img
              src={signupForm.values.image || '/images/assest/signin.png'}
              alt="Profile"
              className="w-full h-full object-cover group-hover:brightness-75 transition duration-300"
            />
            <input type="file" id="image" accept="image/*" className="hidden" onChange={uploadImage} />
          </label>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={signupForm.handleSubmit}>
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              onChange={signupForm.handleChange}
              value={signupForm.values.name}
              className="w-full px-3 py-2 rounded-md border focus:ring-2 focus:ring-gray-600"
            />
            {signupForm.touched.name && signupForm.errors.name && (
              <p className="text-xs text-red-600 mt-1">{signupForm.errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              onChange={signupForm.handleChange}
              value={signupForm.values.email}
              className="w-full px-3 py-2 rounded-md border focus:ring-2 focus:ring-gray-600"
            />
            {signupForm.touched.email && signupForm.errors.email && (
              <p className="text-xs text-red-600 mt-1">{signupForm.errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                onChange={signupForm.handleChange}
                value={signupForm.values.password}
                className="w-full px-3 py-2 rounded-md border focus:ring-2 focus:ring-gray-600"
              />
              <div
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <IconEye size={20} /> : <IconEyeOff size={20} />}
              </div>
            </div>
            {signupForm.touched.password && signupForm.errors.password && (
              <p className="text-xs text-red-600 mt-1">{signupForm.errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                onChange={signupForm.handleChange}
                value={signupForm.values.confirmPassword}
                className="w-full px-3 py-2 rounded-md border focus:ring-2 focus:ring-gray-600"
              />
              <div
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <IconEye size={18} /> : <IconEyeOff size={18} />}
              </div>
            </div>
            {signupForm.touched.confirmPassword && signupForm.errors.confirmPassword && (
              <p className="text-xs text-red-600 mt-1">{signupForm.errors.confirmPassword}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={signupForm.isSubmitting || loading}
            className="w-full py-3 px-4 bg-gray-700 text-white rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-600 flex items-center justify-center gap-2"
          >
            {signupForm.isSubmitting || loading ? (
              <>
                <IconLoader3 className="animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <IconCheck />
                Sign Up
              </>
            )}
          </button>

          {/* Redirect */}
          <p className="text-sm text-center mt-3 text-gray-600">
            Already have an account?
            <Link href="/login" className="text-gray-800 ml-1 hover:underline font-medium">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterUser;
