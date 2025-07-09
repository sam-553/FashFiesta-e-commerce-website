'use client'

import React, { useEffect } from 'react';
import Navbar from '../navbar/page';
import Footer from '../footer/page';
import { Pencil, Trash } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteuser, fetchAllUsers, removeError } from '../features/admin/adminSlice';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const UserPage = () => {
    const { users = [], loading, error } = useSelector((state) => state.admin);
    const dispatch = useDispatch();
    console.log(users);
    const router = useRouter()


    useEffect(() => {
        dispatch(fetchAllUsers());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            toast.error('Error fetching users');
            dispatch(removeError());
        }
    }, [dispatch, error]);
    const handleEdit = (userId) => {
        router.push(`/updateUser/${userId}`)

    }

    const handleDeleteUser = async (userId) => {
        if (confirm('Are you sure you want to delete this user?')) {
            try {
                await dispatch(deleteuser(userId)).unwrap();
                toast.success('User deleted successfully');
                dispatch(fetchAllUsers());
            } catch (error) {
                toast.error(error?.message || 'Error deleting user');
            }
        }
    };

    return (
        <>
            <Navbar />
            <div className="max-w-6xl mx-auto p-4 mt-16">
                <h2 className="text-gray-800 font-bold text-center text-3xl mb-6">All Users</h2>

                {loading && <p className="text-center text-gray-500">Loading users...</p>}
                {!loading && users.length === 0 && (
                    <p className="text-center text-gray-500">No users found.</p>
                )}

                <div className="overflow-x-auto rounded-2xl shadow mt-4">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">S.No</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Avatar</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Role</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Created Date</th>
                                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {users.map((user, index) => (
                                <tr key={user._id}>
                                    <td className="px-4 py-3 text-sm text-gray-700">{index + 1}</td>
                                    <td className="px-4 py-3 text-sm text-gray-700"><img
                                        src={user?.avatar?.url || '/placeholder.jpg'}
                                        alt={user?.name ?? 'Product Image'}
                                        className="w-12 h-12 rounded-full object-cover shadow-sm"
                                    />
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-700">{user.name}</td>
                                    <td className="px-4 py-3 text-sm text-gray-700">{user.email}</td>
                                    <td className="px-4 py-3 text-sm text-gray-700">{user.role}</td>
                                    <td className="px-4 py-3 text-sm text-gray-700">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-3 flex justify-center gap-3">
                                        <button
                                            onClick={() => { handleEdit(user._id) }}
                                            className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition">
                                            <Pencil className="w-4 h-4 text-blue-600" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteUser(user._id)}

                                            className="p-2 rounded-full bg-red-100 hover:bg-red-200 transition">
                                            <Trash className="w-4 h-4 text-red-600" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default UserPage;
