"use client";

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'next/navigation';
import { toast } from 'react-toastify';




import { createReview, getproductDetails, removeError, removeSuccess } from 'app/features/products/productSlice';
import { addtoCart, removeMessage } from 'app/features/cart/cartSlice';
import Navbar from 'app/navbar/page';
import Footer from 'app/footer/page';
import Loader from 'app/loader/page';
import { IconStar, IconStarFilled, IconStarsFilled } from '@tabler/icons-react';


const ProductDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const [userRating, setUserRating] = useState(null);
  const [hoverRating, setHoverRating] = useState(null);
  const [comment, setComment] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(null);
  const [zoomImage, setZoomImage] = useState(false);
  const [transformOrigin, setTransformOrigin] = useState('center center');

  const { productDetails: product, loading, error, reviewLoading, reviewSuccess } = useSelector(state => state.product);
  const { success: cartSuccess, message: cartMessage, loading: cartLoading, error: cartError } = useSelector(state => state.cart);

  useEffect(() => {
    if (id) dispatch(getproductDetails(id));

  }, [dispatch, id]);

  useEffect(() => {
    if (error) {
      toast.error(error);
     
      
      dispatch(removeError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (cartError) {
      toast.error(cartError);
      
      
      dispatch(removeError());
    }
  }, [cartError, dispatch]);

  useEffect(() => {
    if (cartSuccess) {
      toast.success(cartMessage);
      dispatch(removeMessage());
    }
  }, [cartSuccess, cartMessage, dispatch]);

  useEffect(() => {
    if (reviewSuccess) {
      toast.success('Review added successfully');
      setUserRating(null);
      setComment('');
      dispatch(removeSuccess());
      dispatch(getproductDetails(id));
    }
  }, [reviewSuccess, dispatch, id]);

  useEffect(() => {
    if (product?.image?.[0]?.url) {
      setActiveImage(product.image[0].url);
    }
  }, [product]);

  const increaseQuantity = () => {
    if (product && quantity >= product.stock) {
      toast.error('Cannot exceed available stock');
      return;
    }
    setQuantity(q => q + 1);
  };

  const decreaseQuantity = () => {
    if (quantity <= 1) {
      toast.error('Quantity cannot be less than 1');
      return;
    }
    setQuantity(q => q - 1);
  };

  const addToCartHandler = () => {
    dispatch(addtoCart({ id, quantity }));
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!userRating) {
      toast.error('Please select a rating');
      return;
    }
    dispatch(createReview({ rating: userRating, comment, productId: id }));
  };

  const handleZoomMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setTransformOrigin(`${x}% ${y}%`);
    setZoomImage(true);
  };

  const handleZoomLeave = () => setZoomImage(false);

  // ⭐️ Custom inline Rating component for clickable symbols
  const StarRating = ({ value, onChange, disabled }) => {
    return (
      <div className={`flex space-x-1 ${disabled ? 'cursor-default' : 'cursor-pointer'}`}>
        {[...Array(5)].map((_, index) => (
          <IconStarFilled
            key={index}
            size={20}
            className={`transition-colors ${
              (hoverRating ?? value) > index ? 'text-yellow-400' : 'text-gray-300'
            }`}
            onClick={() => !disabled && onChange(index + 1)}
            onMouseEnter={() => !disabled && setHoverRating(index + 1)}
            onMouseLeave={() => !disabled && setHoverRating(null)}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-6xl mx-auto font-sans bg-gray-50 min-h-screen mt-6 mb-4">
        {loading ? (
          <Loader />
        ) : product ? (
          <>
            {/* Product Display */}
            <div className="flex flex-col md:flex-row gap-10 mb-12 bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition duration-300">
              <div className="flex-1 flex justify-center items-center flex-col gap-4">
                {activeImage && (
                  <div className="relative overflow-hidden rounded-xl border shadow w-full max-w-sm h-80">
                    <img
                      src={activeImage}
                      alt={product.name || 'Product image'}
                      onMouseMove={handleZoomMove}
                      onMouseLeave={handleZoomLeave}
                      className={`w-full h-full object-contain transition-transform duration-300 ${zoomImage ? 'scale-150' : 'scale-100'}`}
                      style={{ transformOrigin }}
                    />
                  </div>
                )}
                {product.image.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto scrollbar-hide mt-2">
                    {product.image.map((img, idx) => (
                      <img
                        key={idx}
                        src={img.url}
                        alt={`Thumbnail ${idx}`}
                        onMouseEnter={() => setActiveImage(img.url)}
                        className={`h-20 w-20 object-contain rounded border cursor-pointer transition ${activeImage === img.url ? 'ring-2 ring-red-500' : 'hover:ring-2 hover:ring-gray-400'}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="flex-1 space-y-4">
                <h2 className="text-3xl font-bold">{product.name}</h2>
                <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
                <p className="text-2xl text-indigo-600 font-semibold">₹{product.price}</p>
                <div className="flex items-center gap-2">
                  <StarRating value={product.ratings || 0} disabled={true} />
                  <span className="text-sm text-gray-500">({product.numOfReviews || 0} Reviews)</span>
                </div>
                <p className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.stock > 0 ? `In stock (${product.stock} available)` : 'Out of stock'}
                </p>

                {product.stock > 0 && (
                  <>
                    <div className="flex items-center gap-2 mt-4">
                      <span className="font-medium">Quantity:</span>
                      <button onClick={decreaseQuantity} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition shadow-sm text-lg font-medium">-</button>
                      <input type="text" value={quantity} readOnly className="w-12 text-center border rounded shadow-sm bg-white" />
                      <button onClick={increaseQuantity} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition shadow-sm text-lg font-medium">+</button>
                    </div>
                    <button onClick={addToCartHandler} disabled={cartLoading} className="w-full mt-6 bg-gray-700 text-white py-3 rounded-lg hover:bg-gray-900 shadow-md hover:shadow-lg transform hover:scale-105 transition font-medium">
                      {cartLoading ? 'Adding...' : 'Add to Cart'}
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Review Form */}
            <div className="mb-12 bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition duration-300">
              <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
              <form onSubmit={handleSubmitReview}>
                <StarRating value={userRating || 0} onChange={setUserRating} disabled={false} />
                <textarea
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="Write your review here..."
                  className="w-full mt-4 p-3 border rounded-md shadow-sm hover:shadow-md transition focus:ring-2 focus:ring-gray-300 focus:outline-none"
                  rows={4}
                  required
                />
                <button type="submit" disabled={reviewLoading} className="mt-4 bg-gray-700 text-white py-2 px-6 rounded-md hover:bg-gray-900 shadow-md hover:shadow-lg transform hover:scale-105 transition font-medium">
                  {reviewLoading ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            </div>

            {/* Reviews List */}
            <div className="space-y-6" id="reviews-section">
              <h3 className="text-xl font-semibold mb-6">Customer Reviews</h3>
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((review, idx) => (
                  <div key={idx} className="bg-white border rounded-lg p-5 shadow-sm hover:shadow-md transition">
                    <StarRating value={review.rating} disabled={true} />
                    <p className="text-gray-700 mt-2">{review.comment}</p>
                    <p className="text-sm text-gray-500 mt-1">by {review.name}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No reviews yet.</p>
              )}
            </div>
          </>
        ) : (
          <p className="text-center text-gray-600 mt-10">Product not found.</p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default ProductDetails;
