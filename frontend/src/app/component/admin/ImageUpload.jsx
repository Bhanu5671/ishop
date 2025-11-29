import React from 'react'
import { useState, useRef } from 'react';

export default function ImageUpload({ editImage = null }) {
    const [previewImage, setPreviewImage] = useState(null);
    const imageRef = useRef();
    const imageChangeHandler = () => {
        const file = imageRef.current.files[0];
        const imageFile = new FileReader();
        imageFile.readAsDataURL(file);
        imageFile.onloadend = (e) => {
            setPreviewImage(e.target.result);   
        }
    }
    return (
        <div className='mt-4'>
            <label htmlFor="image" className='text-black'>Image</label>
            <input name='image' onChange={imageChangeHandler} ref={imageRef} hidden type="file" id="image" accept='png,jpg,jpeg,gif' className='w-full p-3 border border-gray-300 rounded-sm mt-2' />
            <div className=' cursor-pointer border-dashed h-auto border-2 w-full p-5 border-gray-300 rounded-sm mt-2' onClick={() => imageRef.current.click()}>
                {
                    previewImage ?
                        <div className='mt-2 flex justify-center items-center'>
                            <img src={previewImage} alt="Preview" className='object-fit' style={{ maxHeight: '200px', maxWidth: '500px' }} />
                        </div>
                        :
                        editImage != null ? <div className='mt-2 flex justify-center items-center'>
                            <img src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/images/products/${editImage}`} alt="Preview" className='object-fit' style={{ maxHeight: '200px', maxWidth: '500px' }} />
                        </div>
                            : <span className='text-gray-400 text-md flex justify-center items-center'>Click to upload image</span>
                }
            </div>

        </div>
    )
}
