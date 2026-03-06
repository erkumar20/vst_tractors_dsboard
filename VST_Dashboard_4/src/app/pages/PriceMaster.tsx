import { useState } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Plus, Pencil, Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { toast } from "sonner";
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

interface PriceEntry {
  id: string;
  commodityCode: string;
  commodityName: string;
  price: number;
  date: string;
}

// Mock price data
const initialPriceData: PriceEntry[] = [
  {
    id: "1",
    commodityCode: "ACA11C00210A0",
    commodityName: "AXEL GEAR CT85",
    price: 15250,
    date: "2026-02-24",
  },
  {
    id: "2",
    commodityCode: "ACA01C00440A0",
    commodityName: "FLY WHEEL",
    price: 8450,
    date: "2026-02-24",
  },
  {
    id: "3",
    commodityCode: "ACA11C00230A1",
    commodityName: "Final Drive Gear",
    price: 3275,
    date: "2026-02-24",
  },
  {
    id: "4",
    commodityCode: "ACA01C00430A0",
    commodityName: "GEAR CASE",
    price: 4380,
    date: "2026-02-24",
  },
  {
    id: "5",
    commodityCode: "TRA90C32520A1",
    commodityName: "Shaft Final",
    price: 6925,
    date: "2026-02-24",
  },
];

// Mock historical price data for graph
const priceHistoryData = [
  {
    date: "Feb 17",
    axelGear: 14500,
    flyWheel: 8800,
    finalDriveGear: 3150,
    gearCase: 4650,
    shaftFinal: 6700,
  },
  {
    date: "Feb 18",
    axelGear: 14580,
    flyWheel: 8720,
    finalDriveGear: 3175,
    gearCase: 4610,
    shaftFinal: 6750,
  },
  {
    date: "Feb 19",
    axelGear: 14720,
    flyWheel: 8650,
    finalDriveGear: 3195,
    gearCase: 4560,
    shaftFinal: 6805,
  },
  {
    date: "Feb 20",
    axelGear: 14850,
    flyWheel: 8580,
    finalDriveGear: 3215,
    gearCase: 4515,
    shaftFinal: 6840,
  },
  {
    date: "Feb 21",
    axelGear: 14980,
    flyWheel: 8520,
    finalDriveGear: 3235,
    gearCase: 4470,
    shaftFinal: 6875,
  },
  {
    date: "Feb 22",
    axelGear: 15090,
    flyWheel: 8485,
    finalDriveGear: 3250,
    gearCase: 4425,
    shaftFinal: 6895,
  },
  {
    date: "Feb 23",
    axelGear: 15170,
    flyWheel: 8465,
    finalDriveGear: 3265,
    gearCase: 4395,
    shaftFinal: 6910,
  },
  {
    date: "Feb 24",
    axelGear: 15250,
    flyWheel: 8450,
    finalDriveGear: 3275,
    gearCase: 4380,
    shaftFinal: 6925,
  },
];

export default function PriceMaster() {
  const [priceData, setPriceData] = useState<PriceEntry[]>(initialPriceData);

  const handleEdit = (id: string, commodityName: string) => {
    toast.info(`Edit mode for ${commodityName}`);
  };

  const handleDelete = (id: string, commodityName: string) => {
    setPriceData((prev) => prev.filter((item) => item.id !== id));
    toast.success(`Deleted ${commodityName}`);
  };

  const handleAddPrice = () => {
    toast.info("Add new price entry");
  };

  const formatCurrency = (value: number) => {
    return `₹${value.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Price Master</h1>
          <p className="text-gray-600 mt-1">Manage commodity prices and track price trends</p>
        </div>
        <div className="flex justify-end lg:justify-start">
          <Button
            onClick={handleAddPrice}
            className="gap-2 bg-[#006847] hover:bg-[#005038]"
          >
            <Plus className="w-4 h-4" />
            Add Price
          </Button>
        </div>
      </div>

      {/* Main Layout: Table and Graph side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Price Table */}
        <Card className="shadow-lg">
          <div className="p-6">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Commodity Prices
              </h2>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#006847] hover:bg-[#006847]">
                    <TableHead className="font-semibold text-white text-center">
                      Commodity Code
                    </TableHead>
                    <TableHead className="font-semibold text-white text-center">
                      Commodity Name
                    </TableHead>
                    <TableHead className="font-semibold text-white text-center">
                      Price
                    </TableHead>
                    <TableHead className="font-semibold text-white text-center">
                      Date
                    </TableHead>
                    <TableHead className="font-semibold text-white text-center">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {priceData.map((item) => (
                    <TableRow key={item.id} className="hover:bg-gray-50">
                      <TableCell className="text-center font-semibold text-[#006847]">
                        {item.commodityCode}
                      </TableCell>
                      <TableCell className="text-center font-semibold text-gray-900">
                        {item.commodityName}
                      </TableCell>
                      <TableCell className="text-center font-semibold text-[#006847]">
                        {formatCurrency(item.price)}
                      </TableCell>
                      <TableCell className="text-center text-gray-700">
                        {formatDate(item.date)}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(item.id, item.commodityName)}
                            className="hover:bg-blue-100 hover:text-blue-600"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              handleDelete(item.id, item.commodityName)
                            }
                            className="hover:bg-red-100 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Summary Stats */}
            <div className="mt-6 grid grid-cols-2 gap-4">


            </div>
          </div>
        </Card>

        {/* Price Trend Graph */}
        <Card className="shadow-lg">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Price Trend Analysis
            </h2>

            <ResponsiveContainer width="100%" height={500}>
              <LineChart data={priceHistoryData} margin={{ top: 10, right: 30, left: 20, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  label={{
                    value: "Date",
                    position: "insideBottom",
                    offset: -10,
                  }}
                  height={60}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  label={{
                    value: "Price (₹)",
                    angle: -90,
                    position: "insideLeft",
                    offset: 10,
                  }}
                  width={80}
                />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #ccc",
                  }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: "20px" }}
                  iconType="line"
                />
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

            {/* Trend Info */}
            <div className="mt-4 text-center text-sm text-gray-600">
              Showing <span className="font-semibold text-[#006847]">7-day</span>{" "}
              price trends for selected commodities
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}