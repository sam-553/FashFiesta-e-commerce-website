'use client'
import React, { useEffect } from 'react';
import Footer from 'app/footer/page';
import Navbar from 'app/navbar/page';
import Banner from 'app/banner/page';
import ProductCard from 'app/productcard/page';
import { useDispatch, useSelector } from 'react-redux';
import { getproduct } from 'app/features/products/productSlice';
import Loader from 'app/loader/page';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import Refubnishedproduct from 'app/refubnishedPrduct/page';


const Home = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { product, loading, error } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(getproduct({ keyword: '' }));
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(typeof error === 'string' ? error : error.message || 'Something went wrong');
    }
  }, [error]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Navbar />
          <Banner />
          <div className="p-8 mt-12 flex flex-col items-center justify-around text-gray-800 dark:text-gray-100">
            <h2 className="text-4xl font-semibold mb-8 text-center text-gray-300 dark:text-gray-800 drop-shadow-sm">
              Trending Now
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 w-full max-w-[1200px] p-8">
              {product.map((p) => (
                <ProductCard product={p} key={p._id}  />

              ))}
            </div>
             <h2 className="text-4xl font-semibold mb-8 text-center text-gray-300 dark:text-gray-800 drop-shadow-sm">
             Refubnishedproduct
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 w-full max-w-[1200px] p-8">
              {product.map((p) => (
                <Refubnishedproduct product={p} key={p._id}  />
                
              ))}
            </div>
          </div>
          <Footer />
        </>
      )}
    </>
  );
};

export default Home;
