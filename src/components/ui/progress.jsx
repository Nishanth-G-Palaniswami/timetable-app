
import React from 'react'
export function Progress({ value=0, className='' }) {
  return (
    <div className={'w-full rounded-full bg-slate-200 overflow-hidden '+className}>
      <div style={{width: Math.max(0, Math.min(100, value)) + '%'}} className="h-full bg-emerald-500"></div>
    </div>
  )
}
