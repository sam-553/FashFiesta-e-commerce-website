'use client'

import React, { useEffect, useState } from 'react';
import Navbar from '@/app/navbar/page';
import Footer from '@/app/footer/page';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useRouter } from 'next/navigation';
import { getSingleUser, removeError, removeSuccess, updateUserRole } from '@/app/features/admin/adminSlice';
import Loader from '@/app/loader/page';
import { toast } from 'react-toastify';

const UpdateUserPage = () => {
    const params = useParams();
    const UserId = params?.id;
    const router = useRouter();

    const { user, loading, error, success } = useSelector((state) => state.admin);
    const dispatch = useDispatch();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');

    useEffect(() => {
        if (!user || user._id !== UserId) {
            dispatch(getSingleUser(UserId));
        }
    }, [dispatch, UserId]);

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setEmail(user.email || '');
            setRole(user.role || '');
        }
    }, [user]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || !email || !role) {
            toast.error("Please fill all fields.");
            return;
        }
        const payload = { name, email, role };
        dispatch(updateUserRole({ id: UserId, formData: payload }));
    };

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(removeError());
        }
        if (success) {
            toast.success('User updated successfully');
            dispatch(removeSuccess());
            router.push('/allUsers');
        }
    }, [dispatch, error, success]);

    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <>
                    <Navbar />
                    <div className="max-w-xl mx-auto p-4 mt-16">
                        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Update User</h2>
                        <form
                            onSubmit={handleSubmit}
                            className="bg-white rounded-2xl shadow p-6 space-y-4"
                        >
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter name"
                                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:border-gray-400"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter email"
                                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:border-gray-400"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:border-gray-400"
                                >
                                    <option value="">Select Role</option>
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-2 rounded-lg text-white font-semibold bg-gray-600 hover:bg-gray-700 transition disabled:opacity-50"
                            >
                                {loading ? 'Updating...' : 'Update User'}
                            </button>
                        </form>
                    </div>
                    <Footer />
                </>
            )}
        </>
    );
};

export default UpdateUserPage;
