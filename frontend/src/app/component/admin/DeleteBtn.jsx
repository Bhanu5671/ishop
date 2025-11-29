"use client"
import { axiosApiInstance } from '@/app/library/helper';
import React, { useState } from 'react'
import { MdDelete } from "react-icons/md";
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import ConfirmBox from './ConfirmBox';
import { getCookie } from '@/app/library/helper';

export default function DeleteBtn({ DeleteURL, flag }) {
    const router = useRouter();
    const [toggleConfirm, setToggleConfirm] = useState(false);
    const token = getCookie("admin_token");
    console.log("Deleted Token", token)
    const deleteProcess = () => {
        if (flag == 1) {
            toast.loading("Moving to trash.....")
            //Trash Code Run
            axiosApiInstance.patch(DeleteURL, {}, {
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
                    }
                }
            ).catch(
                (error) => {
                    toast.dismiss();
                    toast.error("Something went wrong");
                }
            )
        } else {
            toast.loading("Deleting....")
            //Delete Code Run
            axiosApiInstance.delete(DeleteURL, {
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
                    }
                }
            ).catch(
                (error) => {
                    toast.dismiss();
                    toast.error("Something went wrong");
                }
            )
        }
    }

    const DeleteHandler = () => {
        setToggleConfirm(true);
    }
    return (
        <>
            {toggleConfirm && <ConfirmBox onCanClick={() => { setToggleConfirm(false) }} onDelClick={deleteProcess} flag={flag} />}
            <button onClick={DeleteHandler} className='text-red-500 text-xl cursor-pointer' title='Delete'>
                <MdDelete />
            </button>
        </>

    )
}
