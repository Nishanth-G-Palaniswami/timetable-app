
import React from 'react'
export function Badge({ variant='default', className='', ...props }) {
  const styles = {
    default: 'bg-sky-600 text-white border-sky-700',
    secondary: 'bg-slate-100 text-slate-800 border-slate-200',
    outline: 'bg-white text-slate-700 border-slate-300',
  }
  return <span className={'inline-flex items-center gap-1 rounded-xl border px-2 py-0.5 text-xs '+(styles[variant]||styles.default)+' '+className} {...props} />
}
