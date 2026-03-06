import { useState } from "react";
import { Button } from "../components/ui/button";
import { Calendar, RefreshCw, Download } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { Calendar as CalendarComponent } from "../components/ui/calendar";
import { toast } from "sonner";
import { format } from "date-fns";
import VarianceTable from "../components/VarianceTable";
import BillOfMaterial from "../components/BillOfMaterial";
import BillOfMaterialsPrice from "../components/BillOfMaterialsPrice";
import {
  varianceDataItem1,
  varianceDataItem2,
  varianceDataItem3,
  varianceDataItem4,
  varianceDataItem5,
} from "../data/mockData";
import { bomDataItem1, bomDataItem2, bomDataItem3, bomDataItem4, bomDataItem5 } from "../data/bomData";
import {
  billOfMaterialsPriceItem1,
  billOfMaterialsPriceItem2,
} from "../data/billOfMaterialsData";
import { useCategory } from "../context/CategoryContext";
import { useData } from "../context/DataContext";
import { useAppData } from "../context/AppDataContext";
import { items } from "../data/items";

export default function Dashboard() {
  const { selectedCategory } = useCategory();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const {
    dateRange,
    setDateRange,
    item1Variance,
    item2Variance,
    item3Variance,
    item4Variance,
    item5Variance,
    item1Bom,
    item2Bom,
    item3Bom,
    item4Bom,
    item5Bom,
    item1Price,
    item2Price,
    item3Price,
    item4Price,
    item5Price,
    updateVarianceData
  } = useAppData();

  const {
    customDataMap,
    exportData,
    clearData,
    updateCustomDataMapForCategory
  } = useData();

  const currentItemCode = (() => {
    switch (selectedCategory) {
      case 'axel-gear': return "ACA11C00210A0";
      case 'fly-wheel': return "ACA01C00440A0";
      case 'final-drive': return "ACA11C00230A1";
      case 'gear-case': return "ACA01C00430A0";
      case 'shaft-final': return "TRA90C32520A1";
      default: return "ACA11C00210A0";
    }
  })();

  const getDashboardData = () => {
    // We prioritize using the context-synced data which is reactive to dateRange.
    // customDataMap is now handled globally via importSystemData in AppDataContext.

    switch (selectedCategory) {
      case 'axel-gear':
        return {
          name: "Axel Gear CT85",
          variance: item1Variance,
          bom: item1Bom,
          price: item1Price
        };
      case 'fly-wheel':
        return {
          name: "FLY WHEEL",
          variance: item2Variance,
          bom: item2Bom,
          price: item2Price
        };
      case 'final-drive':
        return {
          name: "Final Drive Gear",
          variance: item3Variance,
          bom: item3Bom,
          price: item3Price
        };
      case 'gear-case':
        return {
          name: "GEAR CASE",
          variance: item4Variance,
          bom: item4Bom,
          price: item4Price
        };
      case 'shaft-final':
        return {
          name: "Shaft Final Drive",
          variance: item5Variance,
          bom: item5Bom,
          price: item5Price
        };
      default:
        return {
          name: "Axel Gear CT85",
          variance: item1Variance,
          bom: item1Bom,
          price: item1Price
        };
    }
  };

  const currentData = getDashboardData();

  const handleRefresh = () => {
    setIsRefreshing(true);
    clearData();
    toast.loading("Refreshing dashboard data...");

    setTimeout(() => {
      setIsRefreshing(false);
      toast.dismiss();
      toast.success("Dashboard refreshed successfully!");
    }, 1500);
  };

  const handleExport = () => {
    exportData(currentData.variance, currentData.name);
  };

  const formatDateRange = () => {
    if (!dateRange?.from) return "Select date range";
    if (!dateRange.to) return format(dateRange.from, 'MMM d, yyyy');
    return `${format(dateRange.from, 'MMM d, yyyy')} - ${format(dateRange.to, 'MMM d, yyyy')}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1 uppercase text-xs tracking-widest font-bold">
            <span className="text-[#006847]">{currentData.name}</span> • SOB Metrics
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            className="gap-2 border-gray-200 hover:bg-gray-50 text-gray-700"
            onClick={handleExport}
          >
            <Download className="w-4 h-4 text-blue-600" />
            Export
          </Button>

          <div className="w-px h-8 bg-gray-200 mx-1 hidden sm:block"></div>

          <Popover>
            <PopoverTrigger asChild>
              <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 justify-start flex-1 sm:flex-none">
                <Calendar className="w-4 h-4 text-gray-500" />
                {formatDateRange()}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <CalendarComponent
                mode="range"
                selected={dateRange}
                onSelect={(range) => {
                  setDateRange(range);
                  if (range?.from && range?.to) {
                    toast.success(`Date range updated: ${format(range.from, 'MMM d')} - ${format(range.to, 'MMM d')}`);
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 text-gray-500 hover:text-[#006847] hover:bg-green-50"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <VarianceTable
          data={currentData.variance}
          onDataUpdate={(updated) => {
            if (customDataMap && customDataMap[currentItemCode]) {
              updateCustomDataMapForCategory(currentItemCode, updated);
            } else {
              updateVarianceData(currentItemCode, updated);
            }
          }}
          itemName={currentData.name}
        />
        <BillOfMaterial data={currentData.bom} onDataUpdate={() => { }} itemName={currentData.name} />
        <BillOfMaterialsPrice
          data={currentData.price}
          onDataUpdate={() => { }}
          itemName={currentData.name}
        />
      </div>
    </div>
  );
}