'use client'

import React from 'react'

const Loader = () => {
  return (
    <div className="flex justify-center items-center h-[200px] w-full">
      <div className="w-20 h-20 border-4 border-t-4 border-white/30 border-t-purple-700 rounded-full animate-spin" />
    </div>

  )
}

export default Loader