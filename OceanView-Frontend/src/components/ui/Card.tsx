import React from 'react';
interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  footer?: React.ReactNode;
  noPadding?: boolean;
}
export function Card({
  children,
  className = '',
  title,
  description,
  footer,
  noPadding = false
}: CardProps) {
  return (
    <div
      className={`bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 ${className}`}>

      {(title || description) &&
      <div className="p-6 border-b border-gray-50">
          {title &&
        <h3 className="text-lg font-serif font-semibold text-gray-900">
              {title}
            </h3>
        }
          {description &&
        <p className="text-sm text-gray-500 mt-1">{description}</p>
        }
        </div>
      }
      <div className={noPadding ? '' : 'p-6'}>{children}</div>
      {footer &&
      <div className="px-6 py-4 bg-gray-50 rounded-b-xl border-t border-gray-100">
          {footer}
        </div>
      }
    </div>);

}