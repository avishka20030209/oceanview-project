import React from 'react';
import { ArrowUpRight, ArrowDownRight, BoxIcon } from 'lucide-react';
import { Card } from './ui/Card';
interface StatCardProps {
  title: string;
  value: string | number;
  icon: BoxIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
  color?: 'blue' | 'green' | 'orange' | 'purple';
}
export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  description,
  color = 'blue'
}: StatCardProps) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    orange: 'bg-orange-50 text-orange-600',
    purple: 'bg-purple-50 text-purple-600'
  };
  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-2">{value}</h3>

          {(trend || description) &&
          <div className="flex items-center mt-2 gap-2">
              {trend &&
            <span
              className={`
                  flex items-center text-xs font-medium px-1.5 py-0.5 rounded
                  ${trend.isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}
                `}>

                  {trend.isPositive ?
              <ArrowUpRight className="h-3 w-3 mr-1" /> :

              <ArrowDownRight className="h-3 w-3 mr-1" />
              }
                  {trend.value}%
                </span>
            }
              {description &&
            <span className="text-xs text-gray-400">{description}</span>
            }
            </div>
          }
        </div>
        <div className={`p-3 rounded-xl ${colors[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </Card>);

}