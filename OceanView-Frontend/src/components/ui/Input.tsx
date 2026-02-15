import React, { useId } from 'react';
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}
export function Input({
  label,
  error,
  helperText,
  className = '',
  id,
  ...props
}: InputProps) {
  const inputId = id || useId();
  return (
    <div className="w-full">
      {label &&
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-gray-700 mb-1">

          {label}
        </label>
      }
      <input
        id={inputId}
        className={`
          flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm placeholder:text-gray-400 
          focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all
          ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-ocean-light focus:ring-ocean-100 hover:border-ocean-light'}
          ${className}
        `}
        {...props} />

      {error &&
      <p className="mt-1 text-xs text-red-500 font-medium animate-slide-up">
          {error}
        </p>
      }
      {helperText && !error &&
      <p className="mt-1 text-xs text-gray-500">{helperText}</p>
      }
    </div>);

}