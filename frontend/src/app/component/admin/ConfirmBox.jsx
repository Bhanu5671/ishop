"use client"
import React from 'react'

export default function ConfirmBox({ onCanClick, onDelClick, flag }) {
    return (
        <>
            <div className="fixed inset-0 w-screen h-screen flex justify-center items-center bg-black/50 backdrop-blur-md z-50">
                <div className="bg-white p-8 rounded-3xl shadow-lg max-w-xl w-full flex flex-col gap-6">
                    <h2 className="text-2xl font-semibold text-black text-right">Are you sure?</h2>
                    <p className="text-base text-center text-gray-900">
                        Do you really want to {flag === 0 ? "delete" : "trash"} this item? This process cannot be undone.
                    </p>
                    <div className="flex justify-end gap-4">
                        <button
                            onClick={onCanClick}
                            className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 transition cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onDelClick}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 transition cursor-pointer"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
