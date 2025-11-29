"use client"

import { axiosApiInstance, getCookie } from '@/app/library/helper';
import React, { useState } from 'react'
import { FaImages, FaRegTrashAlt } from "react-icons/fa";
import { ImCancelCircle } from "react-icons/im";
import { toast } from 'react-toastify';


export default function MultipleImages({ deleteURL, apiURL, other_images }) {
  const token = getCookie("admin_token");
  console.log("multi", token)

  const [otherImages, setOtherImages] = useState(other_images);
  const [multiImagesToggle, setMultiImagesTogggle] = useState(false);

  const deleteHandler = (index) => {
    axiosApiInstance.delete(deleteURL + "/" + index, {
      headers: {
        Authorization: token ?? ''
      }
    }).then(
      (response) => {
        if (response.data.flag == 1) {
          toast.success(response.data.message);
          setOtherImages(response.data.otherImages);
          e.target.reset();
        } else {
          toast.error(response.data.message);
        }
      }
    ).catch(
      (error) => {
        toast.error(error);
      }
    )
  }

  const submitHandler = (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (let file of e.target.images.files) {
      formData.append("images", file);
    }
    axiosApiInstance.post(apiURL, formData, {
      headers: {
        Authorization: token ?? ""
      }
    }).then(
      (response) => {
        if (response.data.flag == 1) {
          toast.success(response.data.message);
          setOtherImages(response.data.otherImages);
          e.target.reset();
        } else {
          toast.error(response.data.message);
        }
      }
    ).catch(
      (error) => {
        toast.error(error);
      }
    )

    console.log(e.target.images.files)
  }

  return (
    <>
      {
        multiImagesToggle && <div className='fixed top-0 z-60 left-0 w-full h-full backdrop-blur-md  ' style={{ backgroundColor: "rgba(0,0,0,0.3)", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", gap: "20px", }}>


          <div style={{ width: "60%", backgroundColor: "white", padding: "20px", borderRadius: "10px", maxHeight: "70%" }} className='flex items-center relative flex-wrap gap-2 justify-center'>
            <div className='absolute top-[20px] right-[20px] cursor-pointer text-red-600' style={{}}><ImCancelCircle onClick={() => { setMultiImagesTogggle(false) }} /></div>
            {
              otherImages.length != 0 ? otherImages.map(
                (images, index) => (
                  <div style={{ width: "20%", height: "170px", position: "relative" }} className='group' key={index + 1}>
                    <div style={{ position: "absolute", top: 0, left: 0, backgroundColor: "rgba(0,0,0,0.6", width: "100%", height: "100%" }} className='rounded-sm flex justify-center items-center opacity-0 group-hover:opacity-100'>
                      <FaRegTrashAlt color='white' size={22} onClick={() => { deleteHandler(index) }} />
                    </div>
                    <img src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/images/products/other-images/${images}`} alt={`Product Image ${index + 1}`} key={index + 1} className='border border-gray-300 rounded-sm' />
                  </div>
                )
              ) : "No Images(s)"
            }
          </div>

          <form onSubmit={submitHandler} className='bg-white rounded-[10px] px-[20px] py-[20px] flex justify-between items-center w-[60%]'>
            <input type="file" name="images" id="" multiple />
            <button className='cursor-pointer py-2 px-3 bg-black text-white rounded-sm'>Save</button>
          </form>

        </div>
      }
      <FaImages onClick={() => { setMultiImagesTogggle(true) }} />


    </>
  )
}
