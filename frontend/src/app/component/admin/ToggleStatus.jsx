"use client"
import { axiosApiInstance, getCookie } from '@/app/library/helper';
import React, { useState } from 'react'
import { toast } from 'react-toastify';

export default function ToggleStatus({ status, toggleURL, id }) {


    const [current_status, setCurrentStatus] = useState(status);
    const token = getCookie('admin_token');

    console.log("token", token)


    const toggleHandler = () => {
        axiosApiInstance.patch(
            toggleURL,
            { id: id, new_status: !current_status }, {
            headers: {
                Authorization: token ?? ""
            }
        }).then(
            (response) => {
                if (response.data.flag == 1) {
                    setCurrentStatus(!current_status);
                    toast.success(response.data.message)
                } else {
                    toast.error(response.data.message)
                }
            }
        ).catch(
            (response) => {
                toast.error(response.data.message)
            }
        )
    }

    return (
        <>
            <button onClick={toggleHandler} className={`${current_status ? "bg-green-500" : "bg-red-500"} text-white p-1 px-2 rounded-xl cursor-pointer`}>{current_status ? "Active" : "Inactive"}</button>
        </>
    )
}
