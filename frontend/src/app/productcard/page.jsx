'use client';
export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Rating from '@/app/rating/page'; // Ensure correct path

const ProductCard = ({ product }) => {
  // Safe fallback values to prevent undefined errors
  const [rating, setRating] = useState(product?.ratings ?? 0);

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  // Guard: If no product is passed, display fallback UI
  if (!product) {
    return (
      <div className="flex justify-center items-center h-64 w-64 bg-gray-100 rounded-xl shadow text-gray-500">
        No Product Data Available
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center bg-white">
      <div className="group w-[280px] bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:scale-[1.015] m-4">
        {/* Clickable Image */}
        <Link href={`/productDetails/${product._id}`} prefetch={false}>
          <div className="relative cursor-pointer h-[220px] w-full overflow-hidden rounded-t-3xl">
            {product?.image?.[0]?.url ? (
              <>
                <img
                  src={product.image[0].url}
                  alt={product?.name || "Product Image"}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 ease-in-out"
                />
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full w-full bg-gray-100 text-sm text-gray-400">
                No Image Available
              </div>
            )}
          </div>
        </Link>

        {/* Product Info */}
        <div className="p-5 text-center">
          <h3 className="text-base font-semibold text-gray-900 mb-1 truncate">
            {product.name ?? "No Name"}
          </h3>

          <p className="text-sm text-gray-500 mb-2 truncate">
            {product.description ?? "No description available."}
          </p>

          <p className="text-lg font-bold text-indigo-600 mb-2">
            ₹{product.price ?? "N/A"}
          </p>

          <div className="flex justify-center items-center mb-1">
            <Rating
              value={rating}
              onRatingChange={handleRatingChange}
              disabled={true}
            />
          </div>

          <p className="text-xs text-gray-400 mb-4">
            ({product.numOfReviews ?? 0} {product.numOfReviews === 1 ? 'Review' : 'Reviews'})
          </p>

          {/* View Details Button */}
          <Link href={`/productDetails/${product._id ?? ''}`} prefetch={false}>
            <button
              className="w-full bg-gray-700 hover:bg-gray-900 text-white font-medium py-2 rounded-full text-sm transition duration-300 shadow-sm hover:shadow-md disabled:bg-gray-400"
              disabled={!product._id}
            >
              View Details
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
