'use client'

import Link from 'next/link';
import React, { useState, useEffect, useRef } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser, logout, removeError } from '../features/user/userSlice';
import { toast } from 'react-toastify';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Profile', href: '/userProfile' },
  { label: 'My Order', href: '/orders' },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const profileRef = useRef(null);

  const { isAuthenticated, user, error, loading } = useSelector((state) => state.user);
  const { cartItems } = useSelector((state) => state.cart);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(loadUser());
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    if (error) {
      toast.error(error, { toastId: 'userError' });
      dispatch(removeError());
    }
  }, [error, dispatch]);

//   const handleSearchSubmit = (e) => {
//     e.preventDefault();
//     const query = searchQuery.trim();

//     const params = new URLSearchParams(window.location.search);
//     const category = params.get('category') || '';

//     const searchParams = new URLSearchParams();
//     if (query) searchParams.set('keyword', query);
//     if (category) searchParams.set('category', category);

//     router.push(`/products?${searchParams.toString()}`);
//     setSearchQuery('');
//     setIsMenuOpen(false);
// };


  const handleLogout = async () => {
    await dispatch(logout());
    router.push('/login');
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileOpen]);

  return (
    <>
      {isProfileOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-[999]"
          onClick={() => setIsProfileOpen(false)}
        />
      )}

      <nav className="fixed top-0 w-full bg-gray-100 dark:bg-gray-900 shadow-md z-[1000] text-gray-900 dark:text-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/">
            <span
              onClick={() => setIsMenuOpen(false)}
              className="text-[1.5rem] font-bold text-gray-800 dark:text-gray-400 cursor-pointer"
            >
              FashFiesta
            </span>
          </Link>

          <div className="hidden md:flex ml-6 flex-1">
            <ul className="flex gap-8 items-center">
              {navLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="hover:text-blue-600 dark:hover:text-blue-400">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-2 md:gap-6">
            {/* <form
              onSubmit={handleSearchSubmit}
              className="hidden lg:flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-full px-3 py-1.5"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="bg-transparent text-sm text-gray-900 dark:text-white outline-none"
              />
              <button type="submit">
                <SearchIcon className="text-gray-700 dark:text-gray-300" />
              </button>
            </form> */}

            <Link href="/cartItem" className="relative">
              <ShoppingCartIcon className="hover:text-blue-600 dark:hover:text-blue-400" />
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-semibold w-5 h-5 rounded-full flex items-center justify-center">
                {mounted && isAuthenticated ? cartItems.length : 0}
              </span>
            </Link>

            {loading ? (
              <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse" />
            ) : !isAuthenticated ? (
              <Link href="/login">
                <PersonAddIcon className="hover:text-blue-600 dark:hover:text-blue-400" />
              </Link>
            ) : (
              <div ref={profileRef} className="relative">
                <img
                  src={user?.avatar?.url || '/default-avatar.png'}
                  alt={user?.name || 'User'}
                  className="w-8 h-8 rounded-full cursor-pointer border border-gray-300 dark:border-gray-600"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                />
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 bg-white dark:bg-gray-800 shadow-lg rounded p-2 min-w-[160px] z-[1001]">
                    <p className="text-sm text-gray-800 dark:text-gray-200 px-2 truncate">{user?.name}</p>
                    {user?.role === 'admin' ? (
                      <Link
                        href="/adminDashboard"
                        onClick={() => setIsProfileOpen(false)}
                        className="block text-sm px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      >
                        Admin Dashboard
                      </Link>
                    ) : (
                      <Link
                        href="/userProfile"
                        onClick={() => setIsProfileOpen(false)}
                        className="block text-sm px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      >
                        Profile
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block text-sm text-left w-full px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden">
              {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-gray-100 dark:bg-gray-800 px-6 py-4 space-y-4">
            {navLinks.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setIsMenuOpen(false)}
                className="block hover:text-blue-600 dark:hover:text-blue-400"
              >
                {label}
              </Link>
            ))}
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center gap-2 bg-white dark:bg-gray-700 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded shadow-sm"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="bg-transparent text-sm text-gray-900 dark:text-white outline-none w-full"
              />
              <button type="submit">
                <SearchIcon className="text-gray-700 dark:text-gray-300" />
              </button>
            </form>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
