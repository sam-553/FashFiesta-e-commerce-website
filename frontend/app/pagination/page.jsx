'use client'
import React from 'react';
import { useSelector } from 'react-redux';

const Pagination = ({
  currentPage,
  onPagechange,
  nextPageText = 'Next',
  lastPageText = 'Last',
  firstPageText = 'First',
  prevPageText = 'Prev',
}) => {
  const { totalpages, product } = useSelector((state) => state.product);

  if (product.length === 0 || totalpages <= 1) return null;

  const getPageNumbers = () => {
    const pageWindow = 2;
    const pages = [];
    for (
      let i = Math.max(1, currentPage - pageWindow);
      i <= Math.min(totalpages, currentPage + pageWindow);
      i++
    ) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex justify-center items-center gap-1 mt-10 text-sm flex-wrap">
      {currentPage > 1 && (
        <>
          <button
            onClick={() => onPagechange(1)}
            className="px-3 py-1.5 border rounded hover:bg-gray-900"
          >
            {firstPageText}
          </button>
          <button
            onClick={() => onPagechange(currentPage - 1)}
            className="px-3 py-1.5 border rounded hover:bg-gray-900"
          >
            {prevPageText}
          </button>
        </>
      )}

      {getPageNumbers().map((number) => (
        <button
          key={number}
          onClick={() => onPagechange(number)}
          className={`px-3 py-1.5 border rounded ${
            currentPage === number
              ? 'bg-gray-700 text-white'
              : 'text-gray-700 hover:bg-gray-900'
          }`}
        >
          {number}
        </button>
      ))}

      {currentPage < totalpages && (
        <>
          <button
            onClick={() => onPagechange(currentPage + 1)}
            className="px-3 py-1.5 border rounded hover:bg-gray-900"
          >
            {nextPageText}
          </button>
          <button
            onClick={() => onPagechange(totalpages)}
            className="px-3 py-1.5 border rounded hover:bg-gray-900"
          >
            {lastPageText}
          </button>
        </>
      )}
    </div>
  );
};

export default Pagination;
