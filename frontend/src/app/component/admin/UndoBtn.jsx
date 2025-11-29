"use client"
import { axiosApiInstance } from '@/app/library/helper';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React from 'react'
import { FaUndo } from "react-icons/fa";
import { toast } from 'react-toastify';
import { getCookie } from '@/app/library/helper';

export default function UndoBtn({ UndoURL }) {
    const token = getCookie("admin_token");
    const router = useRouter();
    const undoHandler = () => {
        toast.loading("Undo Items...")
        axiosApiInstance.patch(UndoURL, {}, {
            headers: {
                Authorization: token ?? ""
            }
        }).then(
            (response) => {
                if (response.data.flag == 1) {
                    toast.dismiss();
                    toast.success(response.data.message);
                    router.refresh();
                } else {
                    toast.error(response.data.message)
                    toast.dismiss();
                }
            }
        ).catch(
            (error) => {
                toast.error("Something went wrong")
                toast.dismiss();
                console.log(error)
            }
        )
    }

    return (
        <>
            <button onClick={undoHandler} className='cursor-pointer text-amber-400' title='Undo'><FaUndo />
            </button>
        </>
    )
}
