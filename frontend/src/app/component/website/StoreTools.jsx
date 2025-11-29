"use client"

import React from 'react'
import Select from 'react-select';
import { useRouter, useSearchParams } from 'next/navigation';
import SidebarFilters from './SidebarFilters';
export default function StoreTools() {

    const options = [
        { value: 'sortByName=1', label: 'Name: Ascending Order' },
        { value: 'sortByName=-1', label: 'Name: Descending Order' },
        { value: 'sortByPrice=1', label: 'Price: Low to High' },
        { value: 'sortByPrice=-1', label: 'Price: High to Low' },
        // { value: 'best_selling', label: 'Best  Selling' },
        { value: 'sortByDate=-1', label: 'Newest' }
    ];

    const showOptions = [
        { value: 'show=12', label: '12 per page' },
        { value: 'show=24', label: '24 per page' },
        { value: 'show=36', label: '36 per page' },
    ];

    const clearRef = React.useRef();

    const searchParams = useSearchParams();
    const [sortOption, setSortOption] = React.useState(null);
    const [showOption, setShowOption] = React.useState(null);


    console.log("show option:", showOption);
    console.log("selected sort option:", sortOption);

    const router = useRouter();

    React.useEffect(() => {
        const params = searchParams.toString();
        const found = options.find(opt => params.includes(opt.value));
        if (found) setSortOption(found);

        const foundShow = showOptions.find(opt => params.includes(opt.value));
        if (foundShow) setShowOption(foundShow);
    }, [searchParams]);

    React.useEffect(() => {
        if (sortOption) {
            router.push(`?${sortOption.value}`);
        } else {
            router.push(`/store`);
        }
    }, [sortOption]);

    React.useEffect(() => {
        if (showOption) {
            router.push(`?${showOption.value}`);
        }
    }, [showOption]);

    return (
        <div className='flex justify-start items-center gap-11 max-md:gap-2.5'>
            <div className='flex items-center gap-5 max-md:gap-2.5'>
                <div>
                    <label htmlFor="sort_by" className='color-[#22262A] text-sm'>Sort By</label>
                </div>
                <Select value={sortOption} onChange={(option) => { setSortOption(option) }}
                    options={options} className='w-52 text-sm max-md:w-36'
                />

                {
                    sortOption != null ? <div>
                        <button className='text-sm bg-[#FF4858] cursor-pointer text-white px-3 py-2 rounded-sm' ref={clearRef} onClick={() => { setSortOption(null) }}>Clear</button>
                    </div> : ""
                }
            </div>
            <div className='flex items-center gap-5 max-md:hidden md:hidden'>
                <div>
                    <label htmlFor="show" className='color-[#22262A] text-sm'>Show</label>
                </div>
                <Select value={showOption} onChange={(option) => { setShowOption(option) }}
                    options={showOptions} className='w-40 text-sm max-md:w-25'
                />
            </div>
        </div>
    )
}
