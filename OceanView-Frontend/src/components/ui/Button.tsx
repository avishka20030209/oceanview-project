import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Button({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center rounded-md font-medium transition-all focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]';

  // Tropical Green-Teal Variants
  const variants = {
    primary:
      'bg-teal-600 text-white hover:bg-teal-700 shadow-md hover:shadow-lg border border-teal-700',
    secondary:
      'bg-emerald-50 text-teal-800 hover:bg-emerald-100 border border-emerald-200',
    outline:
      'border-2 border-teal-600 text-teal-600 hover:bg-teal-50 hover:text-teal-700',
    ghost:
      'text-teal-700 hover:bg-teal-50/50 hover:text-teal-800',
    danger:
      'bg-rose-500 text-white hover:bg-rose-600 focus:ring-rose-400'
  };

  const sizes = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 py-2 text-sm',
    lg: 'h-12 px-6 text-base'
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
}
