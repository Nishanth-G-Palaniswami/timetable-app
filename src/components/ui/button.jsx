
import React from 'react'
export function Button({ variant='default', size='md', className='', ...props }) {
  const base = 'inline-flex items-center justify-center rounded-2xl px-4 py-2 text-base font-medium transition border shadow-sm'
  const variants = {
    default: 'bg-sky-600 text-white border-sky-700 hover:bg-sky-700',
    secondary: 'bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200',
    outline: 'bg-white text-slate-800 border-slate-300 hover:bg-slate-50',
    ghost: 'bg-transparent border-transparent hover:bg-slate-100'
  }
  const sizes = { sm: 'px-3 py-1 text-sm', md: '', icon: 'p-2 aspect-square' }
  const cls = [base, variants[variant]||variants.default, sizes[size]||'', className].join(' ')
  return <button className={cls} {...props} />
}
