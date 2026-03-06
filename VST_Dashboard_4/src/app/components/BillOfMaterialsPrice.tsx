import { useState } from "react";
import { Card } from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Button } from "./ui/button";
import {
  BillOfMaterialsPriceItem,
  PriceHistoryData,
  weeklyPriceData,
  monthlyPriceData,
  yearlyPriceData,
} from "../data/billOfMaterialsData";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";

interface BillOfMaterialsPriceProps {
  data: BillOfMaterialsPriceItem[];
  itemName: string;
  onDataUpdate?: (data: BillOfMaterialsPriceItem[]) => void;
}

export default function BillOfMaterialsPrice({
  data,
  itemName,
  onDataUpdate,
}: BillOfMaterialsPriceProps) {
  const [timePeriod, setTimePeriod] = useState<"weekly" | "monthly" | "yearly">(
    "weekly"
  );

  const getPriceData = (): PriceHistoryData[] => {
    switch (timePeriod) {
      case "weekly":
        return weeklyPriceData;
      case "monthly":
        return monthlyPriceData;
      case "yearly":
        return yearlyPriceData;
      default:
        return weeklyPriceData;
    }
  };

  const formatCurrency = (value: number) => {
    return `₹${value.toLocaleString()}`;
  };

  const getDifferenceColor = (difference: number) => {
    if (difference > 0) return "text-green-600";
    if (difference < 0) return "text-red-600";
    return "text-gray-600";
  };

  const getDifferenceIcon = (difference: number) => {
    if (difference > 0)
      return <TrendingUp className="w-4 h-4 inline-block ml-1" />;
    if (difference < 0)
      return <TrendingDown className="w-4 h-4 inline-block ml-1" />;
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Bill of Material
        </h2>
        <p className="text-gray-600 mt-1">
          Price tracking and trend analysis
        </p>
      </div>

      {/* Table and Graph Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Price Table */}
        <Card className="shadow-lg">
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Price Comparison
            </h3>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#006847] hover:bg-[#006847]">
                    <TableHead className="font-semibold text-white text-center">
                      Item Name
                    </TableHead>
                    <TableHead className="font-semibold text-white text-center">
                      Deviated Price
                    </TableHead>
                    <TableHead className="font-semibold text-white text-center">
                      Previous Date Rate
                    </TableHead>
                    <TableHead className="font-semibold text-white text-center">
                      Difference
                    </TableHead>
                    <TableHead className="font-semibold text-white text-center">
                      % Change
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((item) => (
                    <TableRow key={item.id} className="hover:bg-gray-50">
                      <TableCell className="text-center font-semibold text-gray-900">
                        {item.itemName}
                      </TableCell>
                      <TableCell className="text-center font-semibold text-[#006847]">
                        {formatCurrency(item.todaysRate)}
                      </TableCell>
                      <TableCell className="text-center text-gray-700">
                        {formatCurrency(item.previousRate)}
                      </TableCell>
                      <TableCell
                        className={`text-center font-semibold ${getDifferenceColor(
                          item.difference
                        )}`}
                      >
                        {item.difference > 0 ? "+" : ""}
                        {formatCurrency(Math.abs(item.difference))}
                        {getDifferenceIcon(item.difference)}
                      </TableCell>
                      <TableCell
                        className={`text-center font-semibold ${getDifferenceColor(
                          item.percentChange
                        )}`}
                      >
                        {item.percentChange > 0 ? "+" : ""}
                        {item.percentChange.toFixed(2)}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Summary Stats */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex flex-col justify-between min-h-[100px]">
                <p className="text-sm font-medium text-gray-600 mb-1">Price Increases</p>
                <p className="text-3xl font-bold text-green-600 leading-none">
                  {data.filter((item) => item.difference > 0).length}
                </p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex flex-col justify-between min-h-[100px]">
                <p className="text-sm font-medium text-gray-600 mb-1">Price Decreases</p>
                <p className="text-3xl font-bold text-red-600 leading-none">
                  {data.filter((item) => item.difference < 0).length}
                </p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex flex-col justify-between min-h-[100px]">
                <p className="text-sm font-medium text-gray-600 mb-1">No Change</p>
                <p className="text-xl font-bold text-gray-600 leading-none">
                  {data.filter((item) => item.difference === 0).length}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Price Trend Graph */}
        <Card className="shadow-lg">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Price Trend Analysis
              </h3>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant={timePeriod === "weekly" ? "default" : "outline"}
                  onClick={() => setTimePeriod("weekly")}
                  className={`flex-1 sm:flex-none ${timePeriod === "weekly"
                    ? "bg-[#006847] hover:bg-[#005038]"
                    : ""
                    }`}
                >
                  Weekly
                </Button>
                <Button
                  size="sm"
                  variant={timePeriod === "monthly" ? "default" : "outline"}
                  onClick={() => setTimePeriod("monthly")}
                  className={`flex-1 sm:flex-none ${timePeriod === "monthly"
                    ? "bg-[#006847] hover:bg-[#005038]"
                    : ""
                    }`}
                >
                  Monthly
                </Button>
                <Button
                  size="sm"
                  variant={timePeriod === "yearly" ? "default" : "outline"}
                  onClick={() => setTimePeriod("yearly")}
                  className={`flex-1 sm:flex-none ${timePeriod === "yearly"
                    ? "bg-[#006847] hover:bg-[#005038]"
                    : ""
                    }`}
                >
                  Yearly
                </Button>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={getPriceData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #ccc",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="axelGear"
                  stroke="#006847"
                  strokeWidth={2}
                  name="AXEL GEAR CT85"
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="flyWheel"
                  stroke="#FFB800"
                  strokeWidth={2}
                  name="FLY WHEEL"
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="finalDriveGear"
                  stroke="#00A86B"
                  strokeWidth={2}
                  name="Final Drive Gear"
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="gearCase"
                  stroke="#FF6B6B"
                  strokeWidth={2}
                  name="GEAR CASE"
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="shaftFinal"
                  stroke="#4ECDC4"
                  strokeWidth={2}
                  name="Shaft Final"
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>

            {/* Period Info */}
            <div className="mt-4 text-center text-sm text-gray-600">
              Showing{" "}
              <span className="font-semibold text-[#006847]">{timePeriod}</span>{" "}
              price trends for all components
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}