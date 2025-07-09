'use client'

import { AccountBalance, LibraryAddCheck, LocalShipping } from '@mui/icons-material';
import React from 'react';

const Checkoutpath = ({ activepath }) => {
    const path = [
        { label: 'Shipping', icon: <LocalShipping /> },
        { label: 'Confirm Order', icon: <LibraryAddCheck /> },
        { label: 'Payment', icon: <AccountBalance /> },
    ];

    return (
        <div className="flex items-center justify-center mb-8">
            {path.map((item, index) => {
                const isActive = activepath === index;
                const isCompleted = activepath > index;

                return (
                    <div className="flex items-center" key={index}>
                        <div className="flex items-center flex-col">
                            <div
                                className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold shadow transition
                          ${isActive
                                        ? 'bg-green-500 text-white'
                                        : isCompleted
                                            ? 'bg-green-400 text-white'
                                            : 'bg-gray-300 text-gray-600'
                                    }`}
                            >
                                {item.icon}
                            </div>
                            <span
                                className={`mt-2 text-sm font-medium transition
                           ${isActive || isCompleted ? 'text-green-600' : 'text-gray-600'}`}
                            >
                                {item.label}
                            </span>
                        </div>

                        {/* Line (skip after last item) */}
                        {index !== path.length - 1 && (
                            <div
                                className={`h-0.5 w-16 sm:w-24 md:w-40 mx-2 transition

                               ${isActive || isCompleted ? 'bg-green-500' : 'bg-gray-300'}`}
                            ></div>
                        )}
                    </div>
                );
            })}


        </div>
    );
};

export default Checkoutpath;
