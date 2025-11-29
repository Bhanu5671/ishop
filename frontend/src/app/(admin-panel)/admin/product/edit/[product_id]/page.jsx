"use client"
import React, { useEffect, useRef, useState, use } from 'react';
import Link from 'next/link';
import { getCookie, titletoSlug } from '@/app/library/helper';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { FaBackward } from "react-icons/fa";
import { axiosApiInstance } from '@/app/library/helper';
import { getProductData, getCategoryData, getColorData } from '@/app/library/api-call';
import Select from 'react-select'
import ImageUpload from '@/app/component/admin/ImageUpload';
import RichTextEditor from '@/app/component/website/RichTextEditor';

export default function Edit({ params }) {
    const { product_id } = React.use(params);

    const token = getCookie('admin_token');
    const router = useRouter();
    const [product, setProduct] = useState(null);
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState([]);
    const [categorySelect, setCategorySelect] = useState();
    const [color, setColor] = useState([]);
    const [colorSelect, setColorSelect] = useState([]);
    const [beforeImage, setBeforeImage] = useState(null);
    const nameRef = useRef();
    const slugRef = useRef();
    const originalPriceRef = useRef();
    const discountPercentageRef = useRef();
    const finalPriceRef = useRef();


    const getData = async () => {
        const productJSON = await getProductData(product_id);
        const data = productJSON?.product;
        console.log(data);
        setProduct(data);
        const allCategoryJSON = await getCategoryData();
        const categoryData = allCategoryJSON.categories;
        setCategory(categoryData);
        const allColorJSON = await getColorData();
        const colorData = allColorJSON.colors;
        setColor(colorData);
        nameRef.current.value = data.name;
        slugRef.current.value = data.slug;
        originalPriceRef.current.value = data.original_price;
        discountPercentageRef.current.value = data.discount_percentage;
        finalPriceRef.current.value = data.final_price;
        const imageAddress = data.main_image ? data.main_image : "No Image is there...";
        setBeforeImage(imageAddress);
        setDescription(data.description);
        setCategorySelect({ label: data.category_id.name, value: data.category_id._id });
        const colorDataSelect = data.colors.map((color) => {
            return { label: color.name, value: color._id }
        })
        setColorSelect(colorDataSelect);
    }



    useEffect(
        () => {
            getData();
        }, [product_id]
    )


    useEffect(() => {
    }, [beforeImage]);



    const priceChangeHandler = () => {
        const originalPrice = originalPriceRef.current.value;
        const discountPercentage = discountPercentageRef.current.value;
        const finalPrice = Math.floor(originalPrice - (originalPrice * (discountPercentage / 100)));
        finalPriceRef.current.value = finalPrice;
    }


    const nameChangeHandler = () => {
        slugRef.current.value = titletoSlug(nameRef.current.value);
    }


    const submitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", nameRef.current.value);
        formData.append("slug", slugRef.current.value);
        formData.append("original_price", originalPriceRef.current.value);
        formData.append("discount_percentage", discountPercentageRef.current.value);
        formData.append("final_price", finalPriceRef.current.value);
        formData.append("description", description);
        formData.append("category", categorySelect?.value); // Send selected category ID
        formData.append("colors", JSON.stringify(colorSelect.map(opt => opt.value)));
        // formData.append("image", e.target.image.files[0]);
        console.log(e.target.image.files[0])
        // ...other fields...
        if (e.target.image.files[0]) {
            formData.append("image", e.target.image.files[0]);
        }
        // Optionally, send the current image path if no new image is uploaded
        else {
            formData.append("image", null);
        }


        console.log(formData.get("category"));
        console.log(formData.get("colors"));
        console.log(formData.get("description"));
        console.log(formData.get("original_price"));
        console.log(formData.get("final_price"));
        console.log(formData.get("discount_percentage"));
        console.log(formData.get("image"));


        axiosApiInstance.put(`/product/update/${product_id}`, formData, {
            headers: {
                Authorization: token ?? ''
            }
        }).then((response) => {
            if (response.data.flag == 1) {
                toast.success(response.data.message);
                router.push("/admin/product");
            } else {
                toast.error(response.data.message);
                console.error("Error updating product:", response.data.error);
            }
        }).catch((err) => {
            console.error("Error updating product:", err);
        });
    }



    // Assume your hooks and logic for data fetching and state management unchanged

    return (
        <main className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <section className="max-w-full mx-auto bg-white rounded-lg border border-[#e2e2e2] shadow-xl p-8 space-y-6">
                {/* Header */}
                <header>
                    <h1 className="text-3xl font-semibold text-black tracking-wide">Product / Edit</h1>
                    <p className="text-gray-600 mt-1 text-lg">Edit your Product</p>
                </header>

                {/* Back Button */}
                <div className="flex justify-end mb-6">
                    <Link href="/admin/product">
                        <button className="flex items-center gap-3 rounded-md bg-black px-6 py-3 text-white font-semibold shadow-lg hover:shadow-2xl transition cursor-pointer">
                            <FaBackward className="h-5 w-5" />
                            <span>Back to Product</span>
                        </button>
                    </Link>
                </div>

                {/* Form */}
                <form onSubmit={submitHandler} className="space-y-8">
                    {/* Name and Slug */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="name" className="block text-lg font-semibold text-black mb-2">Product Name</label>
                            <input
                                id="name"
                                type="text"
                                placeholder="Enter Product name"
                                ref={nameRef}
                                defaultValue={product?.name}
                                onChange={nameChangeHandler}
                                required
                                className="w-full rounded-md border border-[#e2e2e2] bg-white px-5 py-4 text-black placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
                            />
                        </div>
                        <div>
                            <label htmlFor="slug" className="block text-lg font-semibold text-black mb-2">Product Slug</label>
                            <input
                                id="slug"
                                type="text"
                                placeholder="Product slug"
                                ref={slugRef}
                                defaultValue={product?.slug}
                                readOnly
                                required
                                className="w-full rounded-md border border-[#e2e2e2] bg-gray-100 px-5 py-4 text-black placeholder-gray-400 cursor-not-allowed shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
                            />
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label htmlFor="original_price" className="block text-lg font-semibold text-black mb-2">Original Price</label>
                            <input
                                id="original_price"
                                type="number"
                                placeholder="Enter Original Price"
                                ref={originalPriceRef}
                                defaultValue={product?.original_price}
                                onChange={priceChangeHandler}
                                required
                                className="w-full rounded-md border border-[#e2e2e2] bg-white px-5 py-4 text-black placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
                                min={0}
                            />
                        </div>
                        <div>
                            <label htmlFor="discount_percentage" className="block text-lg font-semibold text-black mb-2">Discount Percentage</label>
                            <input
                                id="discount_percentage"
                                type="number"
                                placeholder="Enter Discount"
                                ref={discountPercentageRef}
                                defaultValue={product?.discount_percentage}
                                onChange={priceChangeHandler}
                                max={100}
                                min={0}
                                className="w-full rounded-md border border-[#e2e2e2] bg-white px-5 py-4 text-black placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
                            />
                        </div>
                        <div>
                            <label htmlFor="final_price" className="block text-lg font-semibold text-black mb-2">Final Price</label>
                            <input
                                id="final_price"
                                type="number"
                                placeholder="Final Price"
                                ref={finalPriceRef}
                                defaultValue={product?.final_price}
                                readOnly
                                className="w-full rounded-md border border-[#e2e2e2] bg-gray-100 px-5 py-4 text-black placeholder-gray-400 cursor-not-allowed shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
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
                                value={categorySelect}
                                onChange={setCategorySelect}
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
                                value={colorSelect}
                                onChange={setColorSelect}
                                className="mt-2"
                            />
                        </div>
                    </div>

                    {/* Image Upload */}
                    <ImageUpload editImage={beforeImage} />

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-lg font-semibold text-black mb-2">Description</label>
                        <RichTextEditor value={description} changeHandler={setDescription} />
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="bg-black text-white rounded-md px-8 py-4 font-semibold text-lg shadow-lg hover:shadow-2xl transition transform hover:-translate-y-0.5 cursor-pointer"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </section>
        </main>
    )
}
