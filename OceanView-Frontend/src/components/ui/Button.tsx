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
  // Fixed contrast issues in hover states
  const variants = {
    primary:
    'bg-ocean-DEFAULT text-black hover:bg-ocean-deep shadow-md hover:shadow-lg hover:text-white border border-ocean-deep',
    secondary:
    'bg-sand text-ocean-deep hover:bg-sand-dark focus:ring-sand-dark',
    outline:
    'border-2 border-ocean-DEFAULT text-ocean-DEFAULT hover:bg-ocean-50 focus:ring-ocean-light',
    ghost: 'text-ocean-deep hover:bg-ocean-50/50 hover:text-ocean-deep',
    danger: 'bg-coral text-red hover:bg-coral-hover focus:ring-coral'
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
      {...props}>

      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>);

}