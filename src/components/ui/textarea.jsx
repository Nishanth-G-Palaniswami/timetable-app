
import React from 'react'
export function Textarea({ className='', ...props }) {
  return <textarea className={'w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-300 '+className} {...props} />
}
