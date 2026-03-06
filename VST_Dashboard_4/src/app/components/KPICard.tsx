import { Card } from "./ui/card";
import { TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import type { KPIData } from "../data/mockData";
import { toast } from "sonner";

interface KPICardProps {
  data: KPIData;
}

export default function KPICard({ data }: KPICardProps) {
  const getStatusColor = () => {
    switch (data.status) {
      case 'success':
        return 'text-green-600 bg-green-50';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50';
      case 'danger':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getAccentColor = () => {
    switch (data.status) {
      case 'success':
        return 'border-l-green-500';
      case 'warning':
        return 'border-l-yellow-500';
      case 'danger':
        return 'border-l-red-500';
      default:
        return 'border-l-gray-500';
    }
  };

  const handleClick = () => {
    toast.info(`Viewing details for: ${data.label}`);
  };

  return (
    <Card 
      className={`p-6 border-l-4 ${getAccentColor()} shadow-md hover:shadow-lg transition-all cursor-pointer hover:scale-105`}
      onClick={handleClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">{data.label}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-gray-900">{data.value}</p>
            {data.change && (
              <span className={`flex items-center gap-1 text-sm font-medium ${getStatusColor()}`}>
                {parseFloat(data.change) > 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                {data.change}
              </span>
            )}
          </div>
        </div>
        {data.status === 'danger' || data.status === 'warning' ? (
          <div className={`p-2 rounded-full ${getStatusColor()}`}>
            <AlertCircle className="w-5 h-5" />
          </div>
        ) : null}
      </div>
    </Card>
  );
}