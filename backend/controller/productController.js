import handleasyncError from '../middlewear/handleasyncError.js';
import Model from '../model/productmodel.js';

import APIFunctionality from '../utils/apiFunctionality.js';
import User from '../model/usermodel.js';
import cloudinaryModule from 'cloudinary';
import HandleError from '../utils/handleError.js';

const cloudinary = cloudinaryModule.v2;

// Create product
const createProduct = handleasyncError(async (req, res) => {
  let image = []
  if (typeof req.body.image === 'string') {
    image.push(req.body.image)
  } else {
    image = req.body.image
  }
  const imagelinks = []
  for (let i = 0; i < image.length; i++) {
    const result = await cloudinary.uploader.upload(image[i], {
      folder: 'products'
    })
    imagelinks.push({
      public_id: result.public_id,
      url: result.secure_url
    })
  }
  req.body.image = imagelinks



  req.body.user = req.user.id;
  const product = await new Model(req.body).save();
  res.status(200).json(product);
});

// Get all products with pagination and filters
const getAllProduct = handleasyncError(async (req, res, next) => {
  const resultPerPage = 3;

  // Initialize API features with search and filter
  const apiFeature = new APIFunctionality(Model.find(), req.query)
    .search()
    .filter()
   

  // Count total products matching filters
  const filterQuery = apiFeature.query.clone();
  const productcount = await filterQuery.countDocuments();
  const totalpages = Math.ceil(productcount / resultPerPage) || 1; // prevent division by 0

  // Page validation
  const page = Number(req.query.page) || 1;
  if (totalpages > 0 && page > totalpages) {
    return next(new HandleError("This page does not exist", 400));
  }

  // Pagination
  apiFeature.pagination(resultPerPage);

  // Execute query
  const product = await apiFeature.query;

  res.status(200).json({
    success: true,
    product,
    productcount,
    resultPerPage,
    totalpages,
    currentpage: page,
  });
});


// Update product
const updateproduct = handleasyncError(async (req, res, next) => {
  let product = await Model.findById(req.params.id)

  if (!product) {
    return next(new HandleError("Product not found", 500));
  }
  let images = []
  if (typeof req.body.image === 'string') {
    images.push(req.body.image)
  } else if (Array.isArray(req.body.image)) {
    images = req.body.image
  }
  if (images.length > 0) {
    for (let i = 0; i < product.image.length; i++) {
      await cloudinary.uploader.destroy(product.image[i].public_id)
    }
    const imagelinks = []
    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.uploader.upload(images[i], {
        folder: 'products'
      })
      imagelinks.push({
        public_id: result.public_id,
        url: result.secure_url
      })
    }

    req.body.image = imagelinks
  }

  const updatedproduct = await Model.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ message: "Product updated", updatedproduct });
});

// Delete product
const deleteproduct = handleasyncError(async (req, res, next) => {
  const product = await Model.findByIdAndDelete(req.params.id);

  if (!product) {

    return next(new HandleError("Product not found", 500));
  }
  for (let i = 0; i < product.image.length; i++) {
    await cloudinary.uploader.destroy(product.image[i].public_id)
  }
  res.status(200).json({ message: "Product deleted successfully", product });
});

// Get single product details
const getproductdetails = handleasyncError(async (req, res, next) => {
  const product = await Model.findById(req.params.id);
  if (!product) {
    return next(new HandleError("Product not found", 500));
  }
  res.status(200).json({ success: true, product });
});

// Create or update review
const createReviewForProduct = handleasyncError(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  console.log("Creating review for product:", productId, "Rating:", rating, "Comment:", comment);
  console.log("User ID:", req.user?._id, "User Name:", req.user?.name);
  console.log("req.body:", req.body);

  if (!rating || !comment || !productId) {
    return next(new HandleError("Rating, comment, and productId are required", 400));
  }

  const ratingNum = Number(rating);
  if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
    return next(new HandleError("Rating must be a number between 1 and 5", 400));
  }

  const product = await Model.findById(productId);
  if (!product) {
    return next(new HandleError("Product not found", 404));
  }

  // Construct the review
  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: ratingNum,
    comment,
  };

  // Check if the user has already reviewed
  const reviewExists = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );

  if (reviewExists) {
    // Update existing review
    product.reviews.forEach((r) => {
      if (r.user.toString() === req.user._id.toString()) {
        r.rating = ratingNum;
        r.comment = comment;
      }
    });
  } else {
    // Add new review
    product.reviews.push(review);
  }

  product.numOfReviews = product.reviews.length;
  product.ratings =
    product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.numOfReviews;

  // ✅ Correct save on the document, not on the model class
  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: "Review added successfully",
    product,
  });
});


// Get all reviews of a product
const getProductReviews = handleasyncError(async (req, res, next) => {
  const products = await Model.find();
  if (!products || products.length === 0) {
    return next(new HandleError("No products found", 404));
  }

  const reviews = products.flatMap(product => {
    return (product.reviews || []).map(review => ({
      ...review.toObject(),
      productName: product.name,
      productImage: product.image,
      totalReview: product.numOfReviews,
      productId: product._id
    }));
  });

  res.status(200).json({
    success: true,
    reviews,
  });
});

// Get all reviews of a single product
const getSingleProductReviews = handleasyncError(async (req, res, next) => {
  const product = await Model.findById(req.params.id);
  if (!product) {
    return next(new HandleError("Product not found", 404));
  }

  const review = product.reviews.map(review => ({
    ...review.toObject(),
    productName: product.name,
    productImage: product.image,
    productId: product._id,
  }));

  res.status(200).json({
    success: true,
    review,
  });
});


// Delete a review
const deleteReview = handleasyncError(async (req, res, next) => {
  const { productId, reviewId } = req.params;

  if (!productId || !reviewId) {
    return next(new HandleError("Product ID and Review ID are required", 400));
  }

  const product = await Model.findById(productId);
  if (!product) {
    return next(new HandleError("Product not found", 400));
  }

  const reviews = product.reviews.filter(
    (review) => review._id.toString() !== reviewId.toString()
  );

  const ratings = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const numOfReviews = reviews.length;

  product.reviews = reviews;
  product.ratings = ratings;
  product.numOfReviews = numOfReviews;
  await product.save();

  res.status(200).json({
    success: true,
    message: "Review deleted successfully",
    deletedReviewId: reviewId
  });
});



// Get all products for admin
const getAdminProducts = handleasyncError(async (req, res, next) => {
  const products = await Model.find();
  res.status(200).json({
    success: true,
    products,
  });
});

export {
  createProduct,
  getAllProduct,
  updateproduct,
  deleteproduct,
  getproductdetails,
  getAdminProducts,
  createReviewForProduct,
  getProductReviews,
  deleteReview,
  getSingleProductReviews
};

