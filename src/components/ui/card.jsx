
import React from 'react'
export function Card({ className='', ...props }) {
  return <div className={'rounded-2xl border bg-white '+className} {...props} />
}
export function CardHeader({ className='', ...props }) {
  return <div className={'px-4 py-3 border-b '+className} {...props} />
}
export function CardContent({ className='', ...props }) {
  return <div className={'px-4 py-3 '+className} {...props} />
}
export function CardTitle({ className='', ...props }) {
  return <h3 className={'font-semibold '+className} {...props} />
}
