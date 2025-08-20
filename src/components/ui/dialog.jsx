
import React, { createContext, useContext, useState, cloneElement } from 'react'
const Ctx = createContext(null)
export function Dialog({ children }) {
  const [open, setOpen] = useState(false)
  return <Ctx.Provider value={{open, setOpen}}>{children}</Ctx.Provider>
}
export function DialogTrigger({ asChild, children }) {
  const { setOpen } = useContext(Ctx)
  const child = asChild ? children : <button>{children}</button>
  return cloneElement(child, { onClick: (...args)=>{ child.props.onClick?.(...args); setOpen(true) } })
}
export function DialogContent({ className='', children }) {
  const { open, setOpen } = useContext(Ctx)
  if (!open) return null
  return (
    <div role="dialog" className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={()=>setOpen(false)}>
      <div className={"bg-white rounded-2xl shadow-xl "+className} onClick={(e)=>e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}
export function DialogHeader(props){ return <div className="px-4 pt-4" {...props}/> }
export function DialogTitle(props){ return <h3 className="px-4 text-lg font-semibold" {...props}/> }
