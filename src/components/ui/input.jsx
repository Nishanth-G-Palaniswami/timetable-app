
import React from 'react'
export function Input({ className='', ...props }) {
  return <input className={'w-full min-w-[220px] rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:ring-2 focus:ring-sky-300 '+className} {...props} />
}
