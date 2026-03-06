import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { TrendingUp, TrendingDown, AlertTriangle, Package } from "lucide-react";

export interface SupplierDetail {
  name: string;
  stockoutDays: number;
  onTimeDelivery: number;
  averageDelay: number;
  currentStock: number;
  supplierPerformance: number;
  allocationCompliance: number;
  status: 'high' | 'medium' | 'low';
}

interface SupplierDetailSheetProps {
  supplier: SupplierDetail | null;
  open: boolean;
  onClose: () => void;
}

export default function SupplierDetailSheet({
  supplier,
  open,
  onClose,
}: SupplierDetailSheetProps) {
  if (!supplier) return null;

  const getPerformanceBadge = (score: number) => {
    if (score >= 90) return <Badge className="bg-green-100 text-green-700 border-green-300">Excellent</Badge>;
    if (score >= 75) return <Badge className="bg-blue-100 text-blue-700 border-blue-300">Good</Badge>;
    if (score >= 60) return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300">Average</Badge>;
    return <Badge className="bg-red-100 text-red-700 border-red-300">Poor</Badge>;
  };

  const getComplianceBadge = (compliance: number) => {
    if (compliance >= 95) return <Badge className="bg-green-100 text-green-700 border-green-300">Compliant</Badge>;
    if (compliance >= 80) return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300">Moderate</Badge>;
    return <Badge className="bg-red-100 text-red-700 border-red-300">Non-Compliant</Badge>;
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-xl">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl font-bold text-gray-900">
            {supplier.name}
          </SheetTitle>
          <SheetDescription className="text-gray-600">
            Detailed supplier performance metrics and compliance data
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 px-6">
          {/* Stockout Days */}
          <Card className="p-5 shadow-sm border-l-4 border-l-red-500">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold text-gray-900 text-sm mb-1">Stockout Days</h4>
                <p className="text-xs text-gray-600">Days with zero inventory</p>
              </div>
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-gray-900">{supplier.stockoutDays}</span>
              <span className="text-sm text-gray-600 mb-1">days this month</span>
            </div>
            {supplier.stockoutDays > 5 && (
              <div className="mt-2 flex items-center gap-1 text-xs text-red-600">
                <TrendingUp className="w-3 h-3" />
                <span>Above acceptable threshold</span>
              </div>
            )}
          </Card>

          {/* On Time Delivery */}
          <Card className="p-5 shadow-sm border-l-4 border-l-green-500">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold text-gray-900 text-sm mb-1">On Time Delivery</h4>
                <p className="text-xs text-gray-600">Percentage of deliveries on schedule</p>
              </div>
              <Package className="w-5 h-5 text-green-500" />
            </div>
            <div className="flex items-end gap-2 mb-3">
              <span className="text-3xl font-bold text-gray-900">{supplier.onTimeDelivery}%</span>
            </div>
            <Progress value={supplier.onTimeDelivery} className="h-2" />
            {supplier.onTimeDelivery >= 90 && (
              <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
                <TrendingUp className="w-3 h-3" />
                <span>Meeting delivery targets</span>
              </div>
            )}
          </Card>

          {/* Average Delay */}
          <Card className="p-5 shadow-sm border-l-4 border-l-yellow-500">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold text-gray-900 text-sm mb-1">Average Delay</h4>
                <p className="text-xs text-gray-600">Mean delay in days for late deliveries</p>
              </div>
              <TrendingDown className="w-5 h-5 text-yellow-500" />
            </div>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-gray-900">{supplier.averageDelay}</span>
              <span className="text-sm text-gray-600 mb-1">days average</span>
            </div>
            {supplier.averageDelay > 3 && (
              <div className="mt-2 text-xs text-yellow-600">
                <span>⚠ Delays impacting operations</span>
              </div>
            )}
          </Card>

          {/* Current Stock */}
          <Card className="p-5 shadow-sm border-l-4 border-l-blue-500">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold text-gray-900 text-sm mb-1">Current Stock</h4>
                <p className="text-xs text-gray-600">Available inventory units</p>
              </div>
              <Package className="w-5 h-5 text-blue-500" />
            </div>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-gray-900">{supplier.currentStock.toLocaleString()}</span>
              <span className="text-sm text-gray-600 mb-1">units</span>
            </div>
          </Card>

          {/* Supplier Performance */}
          <Card className="p-5 shadow-sm bg-gradient-to-br from-gray-50 to-white">
            <div className="mb-3">
              <h4 className="font-semibold text-gray-900 text-sm mb-1">Supplier Performance</h4>
              <p className="text-xs text-gray-600">Overall performance score</p>
            </div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-3xl font-bold text-gray-900">{supplier.supplierPerformance}%</span>
              {getPerformanceBadge(supplier.supplierPerformance)}
            </div>
            <Progress value={supplier.supplierPerformance} className="h-3" />
          </Card>

          {/* Allocation Compliance */}
          <Card className="p-5 shadow-sm bg-gradient-to-br from-gray-50 to-white">
            <div className="mb-3">
              <h4 className="font-semibold text-gray-900 text-sm mb-1">Allocation Compliance</h4>
              <p className="text-xs text-gray-600">Adherence to planned allocation targets</p>
            </div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-3xl font-bold text-gray-900">{supplier.allocationCompliance}%</span>
              {getComplianceBadge(supplier.allocationCompliance)}
            </div>
            <Progress value={supplier.allocationCompliance} className="h-3" />
          </Card>

          {/* Summary Card */}
          <Card className="p-5 shadow-sm bg-[#006847] text-white">
            <h4 className="font-semibold text-lg mb-3">Performance Summary</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-200 mb-1">Overall Rating</p>
                <p className="font-bold text-xl">{Math.round((supplier.supplierPerformance + supplier.allocationCompliance) / 2)}%</p>
              </div>
              <div>
                <p className="text-gray-200 mb-1">Risk Level</p>
                <p className="font-bold text-xl capitalize">{supplier.status}</p>
              </div>
            </div>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
}