"use client"

import React, { useState } from 'react';
import { FaEye } from "react-icons/fa";
import { MdOutlineCancel  } from "react-icons/md";
import parse from 'html-react-parser';

export default function ViewDetailes({ data }) {

    const [viewToggle, setViewToggle] = useState(false);
  
    return (
        <>
            {
                viewToggle && <div style={{ position: 'fixed', top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.7)", zIndex: "99999", display: "flex", justifyContent: "center", alignItems: "center", }}>

                    <div style={{ background: "white", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", width: "60%", borderRadius: "10px", padding: "20px", position: "relative" }}>
                        <div style={{ position: "absolute", top: "10px", right: "10px" }}>
                            <MdOutlineCancel onClick={()=>{setViewToggle(false)}} style={{fontSize:"20px",color:"red"}}/>
                        </div>
                        {parse(data)}
                    </div>
                </div>
            }
            <FaEye onClick={()=> setViewToggle(true)} />
        </>
    )
}
