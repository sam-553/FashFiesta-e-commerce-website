"use client";

import React, { useEffect, useState } from 'react';
import { IconCloudUpload, IconTrash } from '@tabler/icons-react';
import Navbar from '@/app/navbar/page';
import productCategory from '@/app/category/page';
import Footer from '@/app/footer/page';
import { removeError, removeSuccess, updateProduct } from '@/app/features/admin/adminSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useRouter } from 'next/navigation';
import { getproductDetails } from '@/app/features/products/productSlice';
import { toast } from 'react-toastify';
import Loader from '@/app/loader/page';

const UpdateProduct = () => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState([]); // New images as base64
    const [imagePreview, setImagePreview] = useState([]); // For previewing new images
    const [oldImages, setOldImages] = useState([]); 
    const router=useRouter()                            // Already uploaded images

    const { productDetails } = useSelector(state => state.product);
    const { success, error, loading } = useSelector(state => state.admin);

    

    const dispatch = useDispatch();
    const params = useParams();
    const productId = params?.id;

    useEffect(() => {
        if (productId) {
            dispatch(getproductDetails(productId));
        }
    }, [dispatch, productId]);

    useEffect(() => {
        if (productDetails) {
            setName(productDetails.name || '');
            setCategory(productDetails.category || '');
            setPrice(productDetails.price || '');
            setStock(productDetails.stock || '');
            setDescription(productDetails.description || '');
            if (productDetails.image && Array.isArray(productDetails.image)) {
                setOldImages(productDetails.image.map(img => img.url));
            }
        }
    }, [productDetails]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        files.forEach((file) => {
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(prev => [...prev, previewUrl]);

            const reader = new FileReader();
            reader.onloadend = () => {
                if (reader.readyState === 2) {
                    setImages(prev => [...prev, reader.result]);
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const handleRemoveNewImage = (index) => {
        setImagePreview(prev => prev.filter((_, i) => i !== index));
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleRemoveOldImage = (index) => {
        setOldImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleUpdateSubmit = (e) => {
        e.preventDefault();
        const payload = {
           
            name,
            price,
            category,
            description,
            stock,
            image: images,
            oldImages
        };
        dispatch(updateProduct({id:productId,formData:payload}));
    };
    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(removeError());
        }
        if (success) {
            toast.success('Product updated successfully');
            setName('')
            setCategory('')
            setDescription('')
            setImages([])
            setStock('')
            setPrice('')
             setImagePreview([])
             router.push('/productList')
            dispatch(removeSuccess());
            
        }
    }, [dispatch, error, success]);
    return (
        <>
            <Navbar />
            <>
         
                  <div className="w-full min-h-screen flex justify-center items-center bg-gray-100 mt-16 pb-10">
                <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-2xl">
                    <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">Update Product</h2>

                    <form className="grid gap-4" onSubmit={handleUpdateSubmit}>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            type="text"
                            placeholder="Enter product name"
                            className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition bg-gray-50"
                        />

                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition bg-gray-50 text-gray-700"
                        >
                            <option value="">Select Category</option>
                            {productCategory.map((item, index) => (
                                <option value={item.value} key={item.id || index}>{item.label}</option>
                            ))}
                        </select>

                        <label htmlFor="uploadImages">
                            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-gray-500 hover:bg-gray-50 transition cursor-pointer">
                                <IconCloudUpload size={40} className="text-gray-500 mb-2" />
                                <p className="text-gray-600">Click or drag files to upload</p>
                                <input
                                    type="file"
                                    id="uploadImages"
                                    className="hidden"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </div>
                        </label>

                        {/* New Images (above) */}
                        <div className="grid grid-cols-3 gap-3 mt-2">
                            {imagePreview.map((url, index) => (
                                <div
                                    key={`new-${index}`}
                                    className="relative group rounded-xl overflow-hidden border border-gray-300 shadow"
                                >
                                    <img
                                        src={url || undefined}
                                        alt={`Selected Preview ${index}`}
                                        className="object-cover w-full h-24"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveNewImage(index)}
                                        className="absolute top-1 right-1 bg-gray-700 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                                    >
                                        <IconTrash size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Old Images (below, next line) */}
                        <div className="grid grid-cols-3 gap-3 mt-4">
                            {oldImages.map((url, index) => (
                                <div
                                    key={`old-${index}`}
                                    className="relative group rounded-xl overflow-hidden border border-gray-300 shadow"
                                >
                                    <img
                                        src={url || undefined}
                                        alt={`Old Preview ${index}`}
                                        className="object-cover w-full h-24"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveOldImage(index)}
                                        className="absolute top-1 right-1 bg-gray-700 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                                    >
                                        <IconTrash size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>


                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="Enter price"
                            className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition bg-gray-50"
                        />

                        <input
                            type="number"
                            value={stock}
                            onChange={(e) => setStock(e.target.value)}
                            placeholder="Enter stock quantity"
                            className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition bg-gray-50"
                        />

                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter product description"
                            rows={4}
                            className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition bg-gray-50 resize-none"
                        ></textarea>

                        <button
                            type="submit"
                            className="bg-gray-700 hover:bg-gray-800 text-white rounded-xl py-3 font-medium transition"
                        >
                            {loading ?'updating...':'Update product'}
                        </button>
                    </form>
                </div>
            </div>
           
          </>
            <Footer />
        </>
    );
};

export default UpdateProduct;
