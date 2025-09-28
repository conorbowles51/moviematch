import React from 'react'

export default function Navbar() {
  return (
    <div className='w-full bg-zinc-50 flex gap-3 justify-end px-8 py-2'>
      <a className='underline cursor-pointer'>Library</a>
      <a className='underline cursor-pointer'>My account</a>
    </div>
  )
}
