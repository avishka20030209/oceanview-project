import React, { useId } from 'react';
import { ChevronDown } from 'lucide-react';
interface Option {
  value: string;
  label: string;
}
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Option[];
  error?: string;
}
export function Select({
  label,
  options,
  error,
  className = '',
  id,
  ...props
}: SelectProps) {
  const selectId = id || useId();
  return (
    <div className="w-full">
      {label &&
      <label
        htmlFor={selectId}
        className="block text-sm font-medium text-gray-700 mb-1">

          {label}
        </label>
      }
      <div className="relative">
        <select
          id={selectId}
          className={`
            appearance-none flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm 
            focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all pr-8
            ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-ocean-light focus:ring-ocean-100 hover:border-ocean-light'}
            ${className}
          `}
          {...props}>

          {options.map((option) =>
          <option key={option.value} value={option.value}>
              {option.label}
            </option>
          )}
        </select>
        <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
      </div>
      {error &&
      <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>
      }
    </div>);

}