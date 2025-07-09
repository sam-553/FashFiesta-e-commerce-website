'use client'

import React from 'react';
import { Search } from 'lucide-react';

const NoProductFound = ({ keyword }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] py-10 text-center">
      <Search className="w-16 h-16 text-gray-400 mb-4" />
      <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Products Found</h2>
      <p className="text-gray-500 text-base max-w-md">
        {keyword
          ? `We couldn’t find any products matching "${keyword}". Try adjusting your filters or using different keywords.`
          : `We couldn’t find any products. Try adjusting your filters or searching with different keywords.`}
      </p>
    </div>
  );
};

export default NoProductFound;
