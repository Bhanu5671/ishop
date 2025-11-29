"use client"
import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { toast } from 'react-toastify';
import { FaBackward } from "react-icons/fa";
import { axiosApiInstance, getCookie, titletoSlug } from '@/app/library/helper';
import Select from 'react-select'
import { getCategoryData, getColorData } from '@/app/library/api-call';
import ImageUpload from '@/app/component/admin/ImageUpload';
import RichTextEditor from '@/app/component/website/RichTextEditor';
import { useRouter } from 'next/navigation';

export default function AddProduct() {
    const token = getCookie("admin_token");
    const router = useRouter();
    const [category, setCategory] = useState([]);
    const [color, setColor] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [description, setDescription] = useState('');
    const [error, setError] = useState({
        name: "",
        slug: "",
        original_price: "",
        discount_percentage: "",
        final_price: ""
    })

    useEffect(() => {
        const getdata = async () => {
            const responseCategoryData = await getCategoryData();
            const categoryData = responseCategoryData.categories;
            setCategory(categoryData);

            const responseColorData = await getColorData();
            const colorData = responseColorData.colors;
            setColor(colorData);
        }
        getdata();
    }, [])

    const nameRef = useRef();
    const slugRef = useRef();
    const originalPriceRef = useRef();
    const discountPercentageRef = useRef();
    const finalPriceRef = useRef();

    const nameChangeHandler = () => {
        slugRef.current.value = titletoSlug(nameRef.current.value)
    }

    const priceChangeHandler = () => {
        const originalPrice = originalPriceRef.current.value;
        const discount = discountPercentageRef.current.value;

        if (discount < 0 || discount > 100) {
            setError({
                ...error,
                discount_percentage: "Percentage should be between 0 to 100"
            })
        } else {
            setError({
                ...error,
                discount_percentage: ""
            })
            const finalPrice = Math.floor(originalPrice - (originalPrice * discount / 100));
            finalPriceRef.current.value = finalPrice;
        }
    }

    const submitHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", nameRef.current.value);
        formData.append("slug", slugRef.current.value);
        formData.append("original_price", originalPriceRef.current.value);
        formData.append("discount_percentage", discountPercentageRef.current.value);
        formData.append("final_price", finalPriceRef.current.value);
        formData.append("category", e.target.category.value);
        formData.append("colors", JSON.stringify(selectedColors));
        formData.append("description", description);
        formData.append("image", e.target.image.files[0]);

        axiosApiInstance.post("/product/create", formData, {
            headers: {
                Authorization: token ?? ""
            }
        }).then((response) => {
            if (response.data.flag === 1) {
                e.target.reset();
                toast.success(response.data.message);
                router.push("/admin/product")
            } else {
                toast.error(response.data.message);
            }
        }).catch((err) => {
            console.error("Error creating product:", err);
        });
    }

    return (
        <main className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <section className="max-w-full mx-auto bg-white rounded-lg border border-[#e2e2e2] shadow-xl p-8">
                <header className="mb-6">
                    <h1 className="text-3xl font-semibold text-black tracking-wide">Add Product</h1>
                    <p className="text-gray-600 mt-1 text-lg">Add a new product to organize your inventory</p>
                </header>

                <div className="flex justify-end mb-6">
                    <Link href="/admin/product" passHref>
                        <button
                            type="button"
                            className="inline-flex items-center gap-3 rounded-md bg-black px-6 py-3 text-white font-semibold shadow-lg hover:shadow-2xl transition cursor-pointer"
                        >
                            <FaBackward className="h-5 w-5" />
                            <span>Back to Product</span>
                        </button>
                    </Link>
                </div>

                <form onSubmit={submitHandler} className="space-y-8 w-full">
                    {/* Product Name & Slug */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="name" className="block text-lg font-semibold text-black mb-2">Product Name</label>
                            <input
                                id="name"
                                type="text"
                                placeholder="Enter Product name"
                                className="w-full rounded-md border border-[#e2e2e2] bg-white px-5 py-4 text-black placeholder-gray-400 outline-none shadow-sm focus:shadow-md focus:border-black transition"
                                required
                                ref={nameRef}
                                onChange={nameChangeHandler}
                            />
                        </div>
                        <div>
                            <label htmlFor="slug" className="block text-lg font-semibold text-black mb-2">Product Slug</label>
                            <input
                                id="slug"
                                type="text"
                                placeholder="Product slug"
                                className="w-full rounded-md border border-[#e2e2e2] bg-gray-100 px-5 py-4 text-black placeholder-gray-400 cursor-not-allowed outline-none shadow-sm focus:shadow-md focus:border-black transition"
                                readOnly
                                required
                                ref={slugRef}
                            />
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label htmlFor="originalPrice" className="block text-lg font-semibold text-black mb-2">Original Price</label>
                            <input
                                id="originalPrice"
                                type="number"
                                min="0"
                                placeholder="Enter Original Price"
                                className="w-full rounded-md border border-[#e2e2e2] bg-white px-5 py-4 text-black placeholder-gray-400 outline-none shadow-sm focus:shadow-md focus:border-black transition"
                                required
                                ref={originalPriceRef}
                            />
                        </div>
                        <div>
                            <label htmlFor="discount" className="block text-lg font-semibold text-black mb-2">Discount Percentage</label>
                            <input
                                id="discount"
                                type="number"
                                min="0"
                                max="100"
                                defaultValue={0}
                                placeholder="Enter Discount"
                                className={`w-full rounded-md border px-5 py-4 text-black placeholder-gray-400 outline-none shadow-sm focus:shadow-md focus:border-black transition ${error.discount_percentage ? "border-red-500" : "border-[#e2e2e2]"
                                    }`}
                                ref={discountPercentageRef}
                                onChange={priceChangeHandler}
                                aria-invalid={error.discount_percentage ? "true" : "false"}
                            />
                            {error.discount_percentage && <p className="text-red-500 mt-1 text-sm">{error.discount_percentage}</p>}
                        </div>
                        <div>
                            <label htmlFor="finalPrice" className="block text-lg font-semibold text-black mb-2">Final Price</label>
                            <input
                                id="finalPrice"
                                type="number"
                                placeholder="Final Price"
                                className="w-full rounded-md border border-[#e2e2e2] bg-gray-100 px-5 py-4 text-black placeholder-gray-400 cursor-not-allowed outline-none shadow-sm focus:shadow-md focus:border-black transition"
                                readOnly
                                ref={finalPriceRef}
                            />
                        </div>
                    </div>

                    {/* Category & Colors Select */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="category" className="block text-lg font-semibold text-black mb-2">Category</label>
                            <Select
                                name="category"
                                options={category.map(cat => ({ label: cat.name, value: cat._id }))}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <label htmlFor="colors" className="block text-lg font-semibold text-black mb-2">Color</label>
                            <Select
                                name="colors"
                                isMulti
                                closeMenuOnSelect={false}
                                options={color.map(col => ({ label: col.name, value: col._id }))}
                                onChange={options => {
                                    const selected = options ? options.map(opt => opt.value) : [];
                                    setSelectedColors(selected);
                                }}
                                className="mt-2"
                            />
                        </div>
                    </div>

                    {/* Image Upload */}
                    <ImageUpload />

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-lg font-semibold text-black mb-2">Description</label>
                        <RichTextEditor
                            value={description}
                            changeHandler={data => setDescription(data)}
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="bg-black text-white rounded-md px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-2xl transition transform hover:-translate-y-0.5 cursor-pointer"
                        >
                            Add
                        </button>
                    </div>
                </form>
            </section>
        </main>
    )
}
