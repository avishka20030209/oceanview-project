import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
}
interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
  pagination?: boolean;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}
export function Table<
  T extends {
    id: string | number;
  }>(
{
  data,
  columns,
  onRowClick,
  pagination,
  currentPage = 1,
  totalPages = 1,
  onPageChange
}: TableProps<T>) {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
            <tr>
              {columns.map((col, index) =>
              <th key={index} className={`px-6 py-4 ${col.className || ''}`}>
                  {col.header}
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.length > 0 ?
            data.map((item) =>
            <tr
              key={item.id}
              onClick={() => onRowClick && onRowClick(item)}
              className={`
                    group transition-colors hover:bg-ocean-50/50
                    ${onRowClick ? 'cursor-pointer' : ''}
                  `}>

                  {columns.map((col, index) =>
              <td
                key={index}
                className={`px-6 py-4 ${col.className || ''}`}>

                      {typeof col.accessor === 'function' ?
                col.accessor(item) :
                item[col.accessor] as React.ReactNode}
                    </td>
              )}
                </tr>
            ) :

            <tr>
                <td
                colSpan={columns.length}
                className="px-6 py-12 text-center text-gray-500">

                  No data available
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      {pagination && totalPages > 1 &&
      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
          <span className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
            onClick={() => onPageChange?.(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-1 rounded hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-transparent">

              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
            onClick={() =>
            onPageChange?.(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
            className="p-1 rounded hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-transparent">

              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      }
    </div>);

}