
import React, { createContext, useContext, useState } from 'react'
const TabsCtx = createContext(null)
export function Tabs({ defaultValue, children, className='' }){
  const [value, setValue] = useState(defaultValue)
  return <TabsCtx.Provider value={{value, setValue}}><div className={className}>{children}</div></TabsCtx.Provider>
}
export function TabsList({ children }){ return <div className="inline-flex gap-2 rounded-xl border bg-white p-1">{children}</div> }
export function TabsTrigger({ value, children }){
  const ctx = useContext(TabsCtx)
  const active = ctx.value === value
  return <button className={'px-3 py-1.5 text-sm rounded-lg border '+(active?'bg-sky-600 text-white border-sky-700':'bg-white border-slate-300')} onClick={()=>ctx.setValue(value)}>{children}</button>
}
export function TabsContent({ value, children, className='' }){
  const ctx = useContext(TabsCtx)
  if (ctx.value !== value) return null
  return <div className={className}>{children}</div>
}
