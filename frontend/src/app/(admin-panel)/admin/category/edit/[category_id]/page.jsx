"use client"
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { titletoSlug } from '@/app/library/helper';
import { toast } from 'react-toastify';
import { FaBackward } from "react-icons/fa";
import { axiosApiInstance } from '@/app/library/helper';
import { getCategoryData } from '@/app/library/api-call';
import { getCookie } from '@/app/library/helper';

export default function Edit({ params }) {

    const { category_id } = React.use(params);

    console.log(category_id)

    const token = getCookie("admin_token");
    const [category, setCategory] = useState(null);
    const nameRef = useRef();
    const slugRef = useRef();

    const getdata = async () => {
        const categoryJSON = await getCategoryData(category_id);
        const data = categoryJSON?.categories;
        setCategory(data);
    };

    useEffect(() => {
        getdata();
    }, [category_id]);

    const nameChangeHandler = () => {
        slugRef.current.value = titletoSlug(nameRef.current.value);
    };

    const submitHandler = (e) => {
        e.preventDefault();
        const data = {
            name: nameRef.current.value,
            slug: slugRef.current.value
        };
        axiosApiInstance.put(`/category/update/${category._id}`, data,
            {
                headers: {
                    Authorization: token ?? ''
                }
            }
        )
            .then((response) => {
                if (response.data.flag === 1) {
                    toast.success(response.data.message);
                } else {
                    toast.error(response.data.message);
                }
            }).catch((err) => {
                console.error("Error creating category:", err);
            });
    };

    return (
        <>
            <div className="max-full mx-auto p-5 sm:p-8 bg-white shadow-lg rounded-md border border-[#e2e2e2] ">
                <header className="mb-6">
                    <h1 className="text-3xl font-bold text-black">Category / Edit</h1>
                    <p className="text-gray-500 mt-1">Edit your Category</p>
                </header>

                <div className="flex justify-end mb-6">
                    <Link href="/admin/category" passHref>
                        <button
                            className="flex items-center gap-2 bg-black text-white px-5 py-3 rounded-sm shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                            type="button"
                        >
                            <FaBackward style={{ fill: "white", fontSize: "18px" }} />
                            <span>Back to Category</span>
                        </button>
                    </Link>
                </div>

                <form onSubmit={submitHandler} className="space-y-6">
                    <div className="flex flex-col">
                        <label className="text-black font-semibold mb-2" htmlFor="categoryName">Category Name</label>
                        <input
                            id="categoryName"
                            type="text"
                            placeholder="Enter Category name"
                            className="w-full p-3 border border-[#e2e2e2] rounded-sm shadow-sm focus:shadow-md focus:outline-none transition-shadow"
                            required
                            ref={nameRef}
                            defaultValue={category?.name}
                            onChange={nameChangeHandler}
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-black font-semibold mb-2" htmlFor="categorySlug">Category Slug</label>
                        <input
                            id="categorySlug"
                            type="text"
                            placeholder="Category slug"
                            className="w-full p-3 border border-[#e2e2e2] rounded-sm shadow-sm bg-gray-50 cursor-not-allowed"
                            required
                            ref={slugRef}
                            defaultValue={category?.slug}
                            readOnly={true}
                        />
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="bg-black text-white rounded-sm px-6 py-3 cursor-pointer shadow-md hover:shadow-lg transition-shadow font-semibold"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
