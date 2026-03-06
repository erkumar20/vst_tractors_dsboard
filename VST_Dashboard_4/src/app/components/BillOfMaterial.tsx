import { Card } from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { BOMItem } from "../data/bomData";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface BillOfMaterialProps {
  data: BOMItem[];
  itemName: string;
  onDataUpdate?: (data: BOMItem[]) => void;
}

export default function BillOfMaterial({ data, itemName }: BillOfMaterialProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return (
          <Badge className="bg-green-100 text-green-700 border-green-300">
            Available
          </Badge>
        );
      case "low":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300">
            Low Stock
          </Badge>
        );
      case "critical":
        return (
          <Badge className="bg-red-100 text-red-700 border-red-300">
            Critical
          </Badge>
        );
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  // Calculate total cost
  const totalBOMCost = data.reduce((sum, item) => sum + item.totalCost, 0);

  // Prepare data for cost breakdown chart
  const costBreakdownData = data.map((item) => ({
    name: item.componentName,
    cost: item.totalCost,
    percentage: ((item.totalCost / totalBOMCost) * 100).toFixed(1),
  }));

  // Prepare data for pie chart
  const COLORS = ["#006847", "#FFB800", "#00A86B", "#FF6B6B", "#4ECDC4"];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* BOM Table */}
        <Card className="shadow-lg">
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Component Breakdown
            </h3>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#006847] hover:bg-[#006847]">
                    <TableHead className="font-semibold text-white text-center">
                      Component
                    </TableHead>
                    <TableHead className="font-semibold text-white text-center">
                      Qty
                    </TableHead>
                    <TableHead className="font-semibold text-white text-center">
                      Cost
                    </TableHead>
                    <TableHead className="font-semibold text-white text-center">
                      Total
                    </TableHead>
                    <TableHead className="font-semibold text-white text-center">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((item) => (
                    <TableRow key={item.id} className="hover:bg-gray-50">
                      <TableCell className="text-center font-semibold text-gray-900">
                        {item.componentName}
                        <p className="text-[10px] text-gray-500 font-mono">
                          {item.componentCode}
                        </p>
                      </TableCell>
                      <TableCell className="text-center">
                        {item.quantity} {item.unit}
                      </TableCell>
                      <TableCell className="text-center">
                        ₹{item.unitCost.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-center font-bold text-[#006847]">
                        ₹{item.totalCost.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-center">
                        {getStatusBadge(item.status)}
                      </TableCell>
                    </TableRow>
                  ))}
                  {/* Total Row */}
                  <TableRow className="bg-gray-50 font-bold">
                    <TableCell colSpan={3} className="text-right">
                      Total BOM Cost:
                    </TableCell>
                    <TableCell className="text-center text-[#006847]">
                      ₹{totalBOMCost.toLocaleString()}
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </Card>

        {/* Cost Analysis Charts */}
        <Card className="shadow-lg">
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">
              Cost Contribution Analysis
            </h3>
            <div className="grid grid-cols-1 gap-8">
              {/* Pie Chart */}
              <div className="h-[250px] relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={costBreakdownData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="cost"
                    >
                      {costBreakdownData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => `₹${value.toLocaleString()}`}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Bar Chart */}
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={costBreakdownData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                    <XAxis type="number" hide />
                    <YAxis
                      dataKey="name"
                      type="category"
                      width={100}
                      fontSize={10}
                    />
                    <Tooltip
                      cursor={{ fill: "transparent" }}
                      formatter={(value: number) => `₹${value.toLocaleString()}`}
                    />
                    <Bar dataKey="cost" fill="#006847" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}