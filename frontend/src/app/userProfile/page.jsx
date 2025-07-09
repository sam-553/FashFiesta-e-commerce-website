'use client'

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { updateUser } from '../features/user/userSlice';
import { toast } from 'react-toastify';
import Loader from '../loader/page';
import { X as IconX } from 'lucide-react'; // using Lucide for consistent Next.js project icon handling
import Navbar from '../navbar/page';
import Footer from '../footer/page';
import Link from 'next/link';

const UserProfile = () => {
    const { user, loading, isAuthenticated } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const router = useRouter();

    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [avatar, setAvatar] = useState('');
    const [avatarPreview, setAvatarPreview] = useState('');

    const onClose = () => {
        router.push('/');
    };

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push('/login');
        }
    }, [loading, isAuthenticated, router]);


    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setEmail(user.email || '');
            const avatarUrl = user.avatar?.url || 'https://i.pravatar.cc/150?img=3';
            setAvatar(avatarUrl);
            setAvatarPreview(avatarUrl);
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('avatar', avatar);

            await dispatch(updateUser(formData)).unwrap();
            toast.success('Profile updated successfully');
            setIsEditing(false);
        } catch (error) {
            toast.error(error?.message || 'Profile update failed');
        }
    };

    const handleCancel = () => {
        if (user) {
            setName(user.name || '');
            setEmail(user.email || '');
            const avatarUrl = user.avatar?.url || 'https://i.pravatar.cc/150?img=3';
            setAvatar(avatarUrl);
            setAvatarPreview(avatarUrl);
        }
        setIsEditing(false);
    };

    const uploadImage = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setAvatar(reader.result);
            setAvatarPreview(reader.result);
            toast.success('Profile image ready for upload');
        };
        reader.onerror = () => {
            toast.error('Image upload failed, please try again.');
        };
    };

    if (loading || !user) {
        return <Loader />;
    }

    const joinedDate = user.createdAt;

    return (
        <>
            <Navbar />
            <div className="min-h-screen flex items-center justify-center top-16 bg-gray-100 p-4 relative">


                <form
                    onSubmit={handleSubmit}
                    className="rounded-3xl shadow-md w-full max-w-md p-8  space-y-6 transition bg-white"
                >


                    <div className="flex flex-col items-center space-y-3">

                        <img
                            src={avatarPreview || 'https://i.pravatar.cc/150?img=3'}
                            alt="User Avatar"
                            className="w-28 h-28 rounded-full shadow object-cover border-4 border-gray-300 hover:shadow-md transition-all duration-300"
                        />

                        {isEditing && (
                            <label className="cursor-pointer text-sm text-gray-700 hover:text-blue-600 transition">
                                <span className="underline">Change Avatar</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={uploadImage}
                                />
                            </label>
                        )}

                        <h2 className="text-2xl font-semibold text-gray-800">{name}</h2>
                        <p className="text-sm text-gray-500">
                            Joined on {new Date(joinedDate).toLocaleDateString()}
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                disabled={!isEditing}
                                className={`w-full mt-1 px-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 transition ${isEditing
                                    ? 'border-gray-300 bg-white text-gray-800'
                                    : 'bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200'
                                    }`}
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={!isEditing}
                                className={`w-full mt-1 px-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 transition ${isEditing
                                    ? 'border-gray-300 bg-white text-gray-800'
                                    : 'bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200'
                                    }`}
                            />
                        </div>
                    </div>

                    {isEditing ? (
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="w-full py-2 bg-gray-700 text-white rounded-full hover:bg-gray-800 transition text-sm font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="w-full py-2 bg-gray-700 text-white rounded-full hover:bg-blue-700 transition text-sm font-medium"
                            >
                                Save Changes
                            </button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setIsEditing(true)}
                            className="w-full py-2 bg-gray-700 text-white rounded-full hover:bg-gray-800 transition text-sm font-medium"
                        >
                            Edit Profile
                        </button>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                            href="/updatePassword"
                            className="w-full py-2 bg-gray-700 text-white rounded-full hover:bg-gray-800 transition text-sm font-medium text-center"
                        >
                            Change Password
                        </Link>
                        <Link
                            href="/orders"
                            className="w-full py-2 bg-gray-700 text-white rounded-full hover:bg-gray-800 transition text-sm font-medium text-center"
                        >
                            My Orders
                        </Link>
                    </div>

                </form>
            </div>
            <Footer />
        </>
    );
};

export default UserProfile;
