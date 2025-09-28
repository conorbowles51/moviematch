import React from 'react'

export default function Navbar() {
  return (
    <div className='w-full bg-gradient-to-r from-50% from-black to-zinc-900 text-white flex gap-3 justify-end px-8 py-2'>
      <a className='underline cursor-pointer'>Home</a>
      <a className='underline cursor-pointer'>Library</a>
      <a className='underline cursor-pointer'>My account</a>
    </div>
  )
}
