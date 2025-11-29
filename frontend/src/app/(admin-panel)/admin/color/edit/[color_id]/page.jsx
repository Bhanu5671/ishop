"use client"
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { getCookie, titletoSlug } from '@/app/library/helper';
import { toast } from 'react-toastify';
import { FaBackward } from "react-icons/fa";
import { axiosApiInstance } from '@/app/library/helper';
import { getColorData } from '@/app/library/api-call';

export default function Edit({ params }) {
  const { color_id } = React.use(params);  // corrected: use destructuring from params directly
  const token = getCookie("admin_token");
  const [color, setColor] = useState(null);
  const nameRef = useRef();
  const slugRef = useRef();

  const getdata = async () => {
    const colorJSON = await getColorData(color_id);
    const data = colorJSON?.colors;
    setColor(data);
  };

  useEffect(() => {
    getdata();
  }, [color_id]);

  const nameChangeHandler = () => {
    slugRef.current.value = titletoSlug(nameRef.current.value);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const data = {
      name: nameRef.current.value,
      slug: slugRef.current.value
    };
    axiosApiInstance.put(`/color/update/${color._id}`, data, {
      headers: { Authorization: token ?? '' }
    })
      .then(response => {
        if (response.data.flag === 1) toast.success(response.data.message);
        else toast.error(response.data.message);
      })
      .catch(err => console.error("Error updating color:", err));
  };

  return (
    <>
      <main className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <section className="w-full bg-white max-w-full mx-auto rounded-lg border border-[#e2e2e2] shadow-xl p-8">
          <header className="mb-6">
            <h1 className="text-3xl font-semibold text-black tracking-wide">Color / Edit</h1>
            <p className="text-gray-600 mt-1 text-lg">Edit your Color</p>
          </header>

          <div className="flex justify-end mb-6">
            <Link href="/admin/color" passHref>
              <button
                type="button"
                className="inline-flex items-center gap-3 rounded-md bg-black px-6 py-3 text-white font-semibold shadow-lg hover:shadow-2xl transition cursor-pointer"
              >
                <FaBackward className="h-5 w-5" />
                <span>Back to Color</span>
              </button>
            </Link>
          </div>

          <form onSubmit={submitHandler} className="max-w-full space-y-8">
            <div className="flex flex-col">
              <label htmlFor="color-name" className="text-lg font-semibold text-black mb-3">
                Color Name
              </label>
              <input
                id="color-name"
                type="text"
                placeholder="Enter Color name"
                className="w-full rounded-md border border-[#e2e2e2] bg-white px-5 py-4 text-black placeholder-gray-400 outline-none shadow-sm focus:shadow-md focus:border-black transition"
                required
                ref={nameRef}
                defaultValue={color?.name}
                onChange={nameChangeHandler}
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="color-slug" className="text-lg font-semibold text-black mb-3">
                Color Slug
              </label>
              <input
                id="color-slug"
                type="text"
                placeholder="Color slug"
                className="w-full rounded-md border border-[#e2e2e2] bg-gray-100 px-5 py-4 text-black placeholder-gray-400 cursor-not-allowed outline-none shadow-sm focus:shadow-md focus:border-black transition"
                required
                ref={slugRef}
                defaultValue={color?.slug}
                readOnly
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="rounded-md bg-black px-8 py-4 text-white text-lg font-semibold shadow-lg hover:shadow-2xl transition transform hover:-translate-y-0.5 cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </form>
        </section>
      </main>
    </>
  );
}
