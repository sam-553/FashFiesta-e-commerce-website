'use client'
import React, { useState } from 'react';

const Rating = ({ value = 0, onRatingChange, disabled = false }) => {
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(value);

  const handleMouseEnter = (rating) => {
    if (!disabled) {
      setHoveredRating(rating);
    }
  };

  const handleMouseLeave = () => {
    if (!disabled) {
      setHoveredRating(0);
    }
  };

  const handleClick = (rating) => {
    if (!disabled) {
      setSelectedRating(rating);
      onRatingChange?.(rating);
    }
  };

  const generateStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const isFilled = i <= (hoveredRating || selectedRating);
      stars.push(
        <span
          key={i}
          className={`cursor-pointer text-xl ${isFilled ? 'text-yellow-500' : 'text-gray-400'}`}
          onMouseEnter={() => handleMouseEnter(i)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick(i)}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="flex">
      {generateStars()}
    </div>
  );
};

export default Rating;
