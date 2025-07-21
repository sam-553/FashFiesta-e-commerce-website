'use client'

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import {
  Instagram,
  Linkedin,
  Facebook,
  Package,
  ShoppingCart,
  Star,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  User,
} from 'lucide-react';
import Footer from '../footer/page';
import Navbar from '../navbar/page';
import Loader from '../loader/page';
import { fetchAdminProducts, fetchAllOrders } from '../features/admin/adminSlice';
import { IconCurrencyEthereum } from '@tabler/icons-react';

const AdminDashboard = () => {
  const router = useRouter();
  const { user, loading } = useSelector((state) => state.user);
  const {products=[],orders=[],totalAmount}=useSelector((state)=>state.admin)
  const dispatch=useDispatch();
  console.log(products);
  console.log(orders);
  console.log(totalAmount);
  
  

  useEffect(() => {
   dispatch(fetchAdminProducts())
   dispatch(fetchAllOrders())
  }, [dispatch])
  const totalProducts=products.length;
  const totalOrders=orders.length;
 const outOfStock = products.filter(product => product.stock === 0).length;
const inStock = products.filter(product => product.stock > 0).length;

  const totalReviews=products.reduce((acc,products)=>acc+(products.reviews?.length||0),0)
  
  console.log(totalProducts,totalOrders);
  
  

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/');
    }else{
      router.push('/adminDashboard')
    }
  }, [user, loading, router]);

 

  const stats = [
    { label: 'Total Products', value:totalProducts , icon: <Package className="text-indigo-500 w-6 h-6" /> },
    { label: 'Total Orders', value: totalOrders, icon: <ShoppingCart className="text-green-500 w-6 h-6" /> },
    { label: 'Total Reviews', value: totalReviews, icon: <Star className="text-yellow-500 w-6 h-6" /> },
    { label: 'Total Revenue', value:`₹${totalAmount.toLocaleString()}`, icon: <DollarSign className="text-emerald-500 w-6 h-6" /> },
    { label: 'Out of Stock', value:outOfStock, icon: <AlertTriangle className="text-red-500 w-6 h-6" /> },
    { label: 'In Stock', value: inStock, icon: <CheckCircle className="text-green-600 w-6 h-6" /> },
  ];

  const sidebarSections = [
    {
      title: 'Projects',
      items: ['All Products', 'Create Product'],
      links: ['productList', 'uploadProduct'],
      icon: Package,
    },
    { title: 'Users', items: ['All Users'], links: ['allUsers'], icon: User },
    { title: 'Orders', items: ['All Orders'], links: ['allOrder'], icon: ShoppingCart },
    { title: 'Reviews', items: ['All Reviews'], links: ['reviewList'], icon: Star },
  ];

  const socialStats = [
    { icon: Instagram, label: 'Instagram', followers: '122k', posts: 12, color: 'text-pink-500' },
    { icon: Linkedin, label: 'LinkedIn', followers: '45k', posts: 34, color: 'text-blue-600' },
    { icon: Facebook, label: 'Facebook', followers: '78k', posts: 20, color: 'text-blue-500' },
  ];

  return (
   <>
   {
    loading?(<Loader/>):(
       <>
      <Navbar />
      <div className="grid grid-cols-1 md:grid-cols-4 min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 mt-16">
        {/* Sidebar */}
        <aside className="bg-gradient-to-b from-gray-800 to-gray-900 text-white p-6 md:col-span-1 flex flex-col gap-6 shadow-lg ">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-6 h-6 text-indigo-400" />
            <h1 className="text-xl font-bold tracking-tight">Admin Dashboard</h1>
          </div>
          <div className="border-t border-gray-300 "></div>
          {sidebarSections.map((section, index) => (
            <div key={index}>
              <p className="font-semibold mb-2 text-xs text-gray-400 uppercase tracking-wide">
                {section.title}
              </p>
              <ul className="space-y-1">
                {section.items.map((item, idx) => (
                  <li
                    key={idx}
                    className="cursor-pointer hover:bg-gray-700 rounded-lg px-3 py-2 transition flex items-center gap-2 group"
                  >
                    <section.icon className="w-4 h-4 text-indigo-300 group-hover:text-indigo-400 transition" />
                    <Link href={`/${section.links[idx]}`} className="text-sm">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </aside>

        {/* Main Content */}
        <main className="p-6 md:col-span-3 flex flex-col gap-6">
          {/* Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {stats.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow hover:shadow-xl p-6 flex flex-col justify-center items-center transition transform hover:scale-105"
              >
                {item.icon}
                <p className="text-gray-600 mt-2 text-sm">{item.label}</p>
                <p className="text-2xl font-bold mt-1">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Social Media Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {socialStats.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow hover:shadow-xl p-10 flex flex-col justify-center items-center transition transform hover:scale-105"
              >
                <item.icon className={`${item.color} w-14 h-14 cursor-pointer hover:scale-110 transition`} />
                <p className="mt-2 text-center text-gray-700 text-s font-medium">{item.label}</p>
                <p className="text-sm text-gray-700">
                  {item.followers} followers, {item.posts} posts
                </p>
              </div>
            ))}
          </div>
        </main>
      </div>
      <Footer />
    </>
    )
   }
   </>
  );
};

export default AdminDashboard;
