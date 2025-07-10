'use client'

import React, { useState, useEffect } from 'react';
import { IconCloudUpload, IconTrash, IconX } from '@tabler/icons-react';
import Navbar from '../navbar/page';
import Footer from '../footer/page';
import productCategory from '../category/page';
import { useDispatch, useSelector } from 'react-redux';
import { removeError, removeSuccess, uploadProducts } from '../features/admin/adminSlice';
import { toast } from 'react-toastify';
import Loader from '../loader/page';

const UploadProduct = () => {
    const { loading, error, success } = useSelector((state) => state.admin);
    const dispatch = useDispatch();

    const [previewUrls, setPreviewUrls] = useState([]);
    const [fullscreenImage, setFullscreenImage] = useState('');
    const [openFullscreenImage, setOpenFullscreenImage] = useState(false);

    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState([]); // base64 strings for backend

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);

        files.forEach((file) => {
            const previewUrl = URL.createObjectURL(file);
            setPreviewUrls((prev) => [...prev, previewUrl]);

            const reader = new FileReader();
            reader.onloadend = () => {
                if (reader.readyState === 2) {
                    setImages((prev) => [...prev, reader.result]);
                }
            };
            reader.readAsDataURL(file);
        });
    };

    useEffect(() => {
        // Revoke all blob URLs only on component unmount
        return () => {
            previewUrls.forEach((url) => URL.revokeObjectURL(url));
        };
    }, []);

    const handleDeleteImage = (index) => {
        setPreviewUrls((prev) => {
            URL.revokeObjectURL(prev[index]); // Revoke immediately
            return prev.filter((_, i) => i !== index);
        });
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    const createProductSubmit = (e) => {
        e.preventDefault();
        const payload = { name, price, category, description, stock, image: images };
        dispatch(uploadProducts(payload));
    };

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(removeError());
        }
        if (success) {
            toast.success('Product created successfully');
            setName('');
            setCategory('');
            setDescription('');
            setImages([]);
            setStock('');
            setPrice('');
            setPreviewUrls([]);
            dispatch(removeSuccess());
        }
    }, [dispatch, error, success]);

    return (
        <>
            <Navbar />
            {loading ? (
                <Loader />
            ) : (
                <>
                    <div className="w-full min-h-screen flex justify-center items-center bg-gray-100 mt-16 pb-10">
                        <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-2xl">
                            <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">Create Product</h2>

                            <form className="grid gap-4" onSubmit={createProductSubmit}>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter product name"
                                    className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition bg-gray-50"
                                />

                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition bg-gray-50 text-gray-700"
                                >
                                    <option value="">Select Category</option>
                                    {productCategory.map((item) => (
                                        <option value={item.value} key={item.id}>
                                            {item.label}
                                        </option>
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
                                            onChange={handleFileChange}
                                        />
                                    </div>
                                </label>

                                {previewUrls.length > 0 && (
                                    <div className="grid grid-cols-4 gap-3 mt-2">
                                        {previewUrls.map((url, index) => (
                                            <div key={url} className="relative group">
                                                <img
                                                    src={url}
                                                    alt={`Preview ${index}`}
                                                    className="rounded-xl object-cover w-full h-24 cursor-pointer border border-gray-300 shadow hover:scale-105 transition"
                                                    onClick={() => {
                                                        setFullscreenImage(url);
                                                        setOpenFullscreenImage(true);
                                                    }}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteImage(index)}
                                                    className="absolute top-1 right-1 bg-gray-700 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                                                >
                                                    <IconTrash size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

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
                                    disabled={loading}
                                    className={`bg-gray-700 hover:bg-gray-800 text-white rounded-xl py-3 font-medium transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {loading ? 'Uploading...' : 'Upload Product'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {openFullscreenImage && (
                        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
                            <div className="relative max-w-2xl w-full">
                                <button
                                    onClick={() => setOpenFullscreenImage(false)}
                                    className="absolute top-4 right-4 bg-gray-800 text-white rounded-full p-2"
                                >
                                    <IconX size={24} />
                                </button>
                                <img src={fullscreenImage} alt="Fullscreen Preview" className="rounded-xl w-full object-contain max-h-[80vh]" />
                            </div>
                        </div>
                    )}
                </>
            )}
            <Footer />
        </>
    );
};

export default UploadProduct;
