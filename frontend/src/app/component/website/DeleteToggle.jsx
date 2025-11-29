"use client"
import React from 'react'
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { removeItem } from '@/redux/features/cartSlice';
import { axiosApiInstance } from '@/app/library/helper';
import { useSelector } from 'react-redux';
import { FiTrash2 } from "react-icons/fi"


export default function DeleteToggle({ id, final_price, original_price, user_id }) {
    const [deleteToggle, setDeleteToggle] = useState(false);
    const dispatch = useDispatch()
    const user = useSelector((store) => store.user);

    const deleteItem = (id, final_price, original_price, user_id) => {
        dispatch(removeItem({ id, final_price, original_price }));
        if (user?.data != null) {
            console.log("Called Delete")
            axiosApiInstance.delete(`/cart/remove/${id}`, { data: { userId: user.data._id } }).then(
                (response) => {
                    if (response.data.flag == 1) {
                        console.log(response.data.message)
                    } else {
                        console.log(response.data.message)
                    }
                }
            ).catch(
                (error) => {
                    console.log(error)
                }
            )
        }
    }

    return (
        <>
            <button
                onClick={() => { setDeleteToggle(true) }}
                className="w-8 h-8 flex items-center justify-center text-red-500 hover:bg-red-50 rounded transition-colors"
                title="Delete item"
            >
                <FiTrash2 size={16} className='cursor-pointer' />
            </button>
            {/* Delete Confirmation Modal */}
            {
                deleteToggle && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60">
                        <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full text-center animate-fade-in">
                            <FiTrash2 size={40} className="mx-auto text-red-500 mb-4" />
                            <h2 className="text-xl font-semibold mb-2 text-gray-900">Remove Item?</h2>
                            <p className="text-gray-600 mb-6">Are you sure you want to delete this item from your cart? This action cannot be undone.</p>
                            <div className="flex justify-center gap-4">
                                <button
                                    className="px-5 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition cursor-pointer"
                                    onClick={() => setDeleteToggle(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-5 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition cursor-pointer"
                                    onClick={() => {
                                        // You can store the item id in state and call deleteItem here
                                        deleteItem(id, final_price, original_price, user_id);
                                        setDeleteToggle(false)
                                        // deleteItem(itemId, ...);
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    )
}
