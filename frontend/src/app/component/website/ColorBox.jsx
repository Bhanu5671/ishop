"use client"

import React, { useState, useEffect } from 'react'
import { getColorData } from '@/app/library/api-call';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ColorBox() {

    const [colors, setColors] = useState([]);
    const [user_color, setUserColor] = useState([]);
    const router = useRouter();
    const searchParams = useSearchParams();
    const addColor = (color_slug) => {
        if (user_color.includes(color_slug)) {
            setUserColor(user_color.filter(c => c !== color_slug));
        } else {
            setUserColor([...user_color, color_slug]);
        }
    }

    useEffect(
        () => {
            if (user_color.length > 0) {
                const query = new URLSearchParams();
                query.append('color', user_color.join('-'));
                router.push(`?${query.toString()}`);
            } else {
                router.push(`?`);
            }
        }, [user_color]
    )


    const fetchData = async () => {
        const colorJSON = await getColorData(null, true);
        const colorsData = colorJSON ? colorJSON.colors : [];
        setColors(colorsData);
    }

    useEffect(() => {
        fetchData();
        // const params = searchParams;
        // console.log("params:", params);
        // const paramsData = params.get('color')?.split("-") || [];
        // console.log("paramsData:", paramsData);
        // for (let i = 0; i < paramsData.length; i++) {
        //     const found = user_color.append(paramsData[i]);
        //     if (found) setUserColor([...user_color, found]);
        // }
    }, []);



    return (
        <div className="px-4 py-4">
            <div className="flex items-center gap-3 flex-wrap">
                {colors.map((color, idx) => (
                    <button onClick={() => addColor(color.slug)}
                        aria-label={`Color ${idx + 1}`}
                        key={color._id}
                        className="h-5 w-5 rounded-full ring-1 ring-black/10 cursor-pointer"
                        style={{ backgroundColor: color.hexacode, opacity: user_color.includes(color.slug) ? 1 : 0.5 }}
                    />
                ))}
            </div>
        </div>
    )
}
