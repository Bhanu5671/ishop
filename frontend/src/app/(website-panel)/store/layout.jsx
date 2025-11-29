import React from 'react';
import SidebarFilters from '@/app/component/website/SidebarFilters'
import StoreTools from '@/app/component/website/StoreTools';

export default async function layout({ children }) {

    return (
        <div className='p-4 flex gap-5'>
            <div className='w-1/5 max-md:hidden'>
                <SidebarFilters />
            </div>
            <div className='w-4/5 flex flex-col gap-5 max-md:w-full'>
                <StoreTools />
                {children}
            </div>
        </div>
    )
}
