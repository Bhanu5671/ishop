import React from 'react'

export default function loading() {
  return (
    <div className="fixed inset-0 z-60 backdrop-blur-md flex justify-center items-center w-full h-full ">
      <div className="w-[400px] h-auto bg-white rounded-2xl flex justify-center items-center p-[3rem] shadow-sm flex-col gap-4">
        <div>
          <div className="text-6xl text-black font-semibold text-center rounded-[100%] border-4 border-black border-t-transparent animate-spin" style={{ width: '35px', height: '35px' }}></div>
        </div>
        <div className='text-center md:text-2xl text-lg font-semi-bold text-black'>Processing your request...</div>
      </div>
    </div>
  )
}
// This component is used to show a loading state in the admin panel.
// It can be used when data is being fetched or processed.