"use client"

import React from 'react'
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';
import { useRouter, useSearchParams } from 'next/navigation';

export default function RangeSelect() {

    const [price, setPrice] = React.useState([100, 150000]);
    const router = useRouter();

    const searchParams = useSearchParams();
    console.log("Range priec after refressh:", price)

    React.useEffect(() => {
        // If URL changes externally, update slider
        setPrice([
            Number(searchParams.get("min")) || 100,
            Number(searchParams.get("max")) || 150000
        ]);
    }, []);

    const addRange = (data) => {
        setPrice(data);

        const query = new URLSearchParams(window.location.search);
        query.set("min", data[0]);
        query.set("max", data[1]);
        router.push(`?${query.toString()}`);
    }

    const resetHandler = () => {
        setPrice([100, 150000]);
        const query = new URLSearchParams(window.location.search);
        query.delete("min");
        query.delete("max");
        router.push(`?${query.toString()}`);
    }

    return (
        <div className='w-full'>
            <RangeSlider
                min={100}
                max={150000}
                step={10000}
                value={price}
                onInput={addRange}
            />
            <div className="mt-3 text-xs text-muted-foreground flex justify-between items-center">
                <div>Rs.{price[0]} - Rs.{price[1]}</div>
                {price[0] !== 100 || price[1] !== 150000 ? <button className="text-xs text-muted-foreground cursor-pointer text-[#FF4858]" onClick={resetHandler}>Reset price range</button> : ""}
            </div>
        </div>
    )
}
