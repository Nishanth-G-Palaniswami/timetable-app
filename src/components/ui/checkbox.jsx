
import React from 'react'
export function Checkbox({ className='', ...props }) {
  // Support both checked and onCheckedChange for controlled usage
  const { checked, onCheckedChange, ...rest } = props;
  return (
    <input
      type='checkbox'
      className={'h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-300 ' + className}
      checked={checked}
      onChange={e => onCheckedChange && onCheckedChange(e.target.checked)}
      {...rest}
    />
  );
}
