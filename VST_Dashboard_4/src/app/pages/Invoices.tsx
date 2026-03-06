import { useSearchParams, Link } from "react-router";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { invoiceData } from "../data/mockData";
import { ChevronRight, TrendingUp } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function Invoices() {
  const [searchParams] = useSearchParams();
  const supplierName = searchParams.get("supplier");

  if (!supplierName) {
    return (
      <div className="p-8">
        <Card className="p-6">
          <p className="text-gray-600">No supplier selected</p>
        </Card>
      </div>
    );
  }

  const supplierInvoices = invoiceData.filter(
    (inv) => inv.supplierName === supplierName
  );

  // Calculate totals
  const totalExpectedQuantity = supplierInvoices.reduce(
    (sum, invoice) => sum + invoice.expectedQuantity,
    0
  );
  const totalQuantityReceived = supplierInvoices.reduce(
    (sum, invoice) => sum + invoice.quantityReceived,
    0
  );
  const totalPlannedPrice = supplierInvoices.reduce(
    (sum, invoice) => sum + invoice.plannedPrice,
    0
  );
  const totalActualPrice = supplierInvoices.reduce(
    (sum, invoice) => sum + invoice.actualPrice,
    0
  );
  const grandTotalPlannedPrice = supplierInvoices.reduce(
    (sum, invoice) => sum + (invoice.plannedPrice * invoice.expectedQuantity),
    0
  );
  const grandTotalActualPrice = supplierInvoices.reduce(
    (sum, invoice) => sum + (invoice.actualPrice * invoice.quantityReceived),
    0
  );

  // Determine dynamic status based on quantity comparison
  const getDynamicStatus = (quantityReceived: number, expectedQuantity: number): 'received' | 'pending' | 'partial' | 'error' => {
    if (quantityReceived > expectedQuantity) {
      return 'error';
    } else if (quantityReceived === expectedQuantity) {
      return 'received';
    } else if (quantityReceived === 0) {
      return 'pending';
    } else {
      return 'partial';
    }
  };

  const getStatusBadge = (quantityReceived: number, expectedQuantity: number) => {
    const status = getDynamicStatus(quantityReceived, expectedQuantity);

    switch (status) {
      case "received":
        return (
          <Badge className="bg-green-100 text-green-700 border-green-300">
            Received
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300">
            Pending
          </Badge>
        );
      case "partial":
        return (
          <Badge className="bg-orange-100 text-orange-700 border-orange-300">
            Partial
          </Badge>
        );
      case "error":
        return (
          <Badge className="bg-red-100 text-red-700 border-red-300">
            Error
          </Badge>
        );
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  // Prepare trend data - group by date and sum quantities
  const trendData = supplierInvoices.reduce((acc: any[], invoice) => {
    const dateStr = new Date(invoice.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    const existingEntry = acc.find(entry => entry.date === dateStr);
    if (existingEntry) {
      existingEntry.received += invoice.quantityReceived;
      existingEntry.expected += invoice.expectedQuantity;
    } else {
      acc.push({
        date: dateStr,
        received: invoice.quantityReceived,
        expected: invoice.expectedQuantity,
      });
    }
    return acc;
  }, []).sort((a, b) => {
    const dateA = supplierInvoices.find(inv =>
      new Date(inv.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) === a.date
    )?.date || "";
    const dateB = supplierInvoices.find(inv =>
      new Date(inv.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) === b.date
    )?.date || "";
    return new Date(dateA).getTime() - new Date(dateB).getTime();
  });

  // Prepare price trend data - group by date and sum prices
  const priceTrendData = supplierInvoices.reduce((acc: any[], invoice) => {
    const dateStr = new Date(invoice.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    const existingEntry = acc.find(entry => entry.date === dateStr);
    if (existingEntry) {
      existingEntry.plannedPrice += invoice.plannedPrice;
      existingEntry.actualPrice += invoice.actualPrice;
    } else {
      acc.push({
        date: dateStr,
        plannedPrice: invoice.plannedPrice,
        actualPrice: invoice.actualPrice,
      });
    }
    return acc;
  }, []).sort((a, b) => {
    const dateA = supplierInvoices.find(inv =>
      new Date(inv.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) === a.date
    )?.date || "";
    const dateB = supplierInvoices.find(inv =>
      new Date(inv.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) === b.date
    )?.date || "";
    return new Date(dateA).getTime() - new Date(dateB).getTime();
  });

  return (
    <div>
      {/* Breadcrumb */}
      <div className="mb-6 overflow-x-auto">
        <nav className="flex items-center space-x-2 text-sm text-gray-600 whitespace-nowrap">
          <Link
            to="/"
            className="hover:text-[#006847] transition-colors font-medium"
          >
            Dashboard
          </Link>
          <ChevronRight className="w-4 h-4 flex-shrink-0" />
          <span className="text-gray-900 font-semibold">Invoices</span>
          <ChevronRight className="w-4 h-4 flex-shrink-0" />
          <span className="text-gray-900 font-semibold">{supplierName}</span>
        </nav>
      </div>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Invoice Records</h1>
          <p className="text-gray-600 mt-1">Invoice list for {supplierName}</p>
        </div>
      </div>

      {/* Invoice List Table */}
      <Card className="shadow-lg">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#006847] hover:bg-[#006847]">
                <TableHead className="font-semibold text-white text-center">Invoice Number</TableHead>
                <TableHead className="font-semibold text-white text-center">Date</TableHead>
                <TableHead className="font-semibold text-white text-center">Batch Number</TableHead>
                <TableHead className="font-semibold text-white text-center">Expected Quantity</TableHead>
                <TableHead className="font-semibold text-white text-center">Planned Price</TableHead>
                <TableHead className="font-semibold text-white text-center">Quantity Received</TableHead>
                <TableHead className="font-semibold text-white text-center">Actual Price</TableHead>
                <TableHead className="font-semibold text-white text-center">Received By</TableHead>
                <TableHead className="font-semibold text-white text-center">Total Price</TableHead>
                <TableHead className="font-semibold text-white text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {supplierInvoices.map((invoice) => (
                <TableRow key={invoice.id} className="hover:bg-gray-50">
                  <TableCell className="text-center font-mono font-semibold text-gray-900">
                    {invoice.invoiceNumber}
                  </TableCell>
                  <TableCell className="text-center text-gray-700">
                    {new Date(invoice.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="text-center text-gray-700">
                    {invoice.batchNumber}
                  </TableCell>
                  <TableCell className="text-center text-gray-700">
                    {invoice.expectedQuantity}
                  </TableCell>
                  <TableCell className="text-center text-gray-700">
                    ₹{invoice.plannedPrice}
                  </TableCell>
                  <TableCell className="text-center font-semibold text-[#006847]">
                    {invoice.quantityReceived}
                  </TableCell>
                  <TableCell className="text-center text-gray-700">
                    ₹{invoice.actualPrice}
                  </TableCell>
                  <TableCell className="text-center text-gray-700">
                    {invoice.receivedBy}
                  </TableCell>
                  <TableCell className="text-center text-gray-700">
                    ₹{invoice.actualPrice * invoice.quantityReceived}
                  </TableCell>
                  <TableCell className="text-center">
                    {getStatusBadge(invoice.quantityReceived, invoice.expectedQuantity)}
                  </TableCell>
                </TableRow>
              ))}
              {/* Total Row */}
              <TableRow className="bg-[#f59e0b]/10 hover:bg-[#f59e0b]/10 border-t-2 border-[#f59e0b]">
                <TableCell className="text-center font-bold text-gray-900" colSpan={3}>
                  TOTAL
                </TableCell>
                <TableCell className="text-center font-bold text-gray-900">
                  {totalExpectedQuantity}
                </TableCell>
                <TableCell className="text-center font-bold text-gray-900">
                  ₹{totalPlannedPrice.toFixed(2)}
                </TableCell>
                <TableCell className="text-center font-bold text-[#006847]">
                  {totalQuantityReceived}
                </TableCell>
                <TableCell className="text-center font-bold text-gray-900">
                  ₹{totalActualPrice.toFixed(2)}
                </TableCell>
                <TableCell></TableCell>
                <TableCell className="text-center font-bold text-gray-900">
                  ₹{grandTotalActualPrice.toFixed(2)}
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Trend Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Quantity Trend Chart */}
        <Card className="shadow-lg">
          <div className="p-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quantity Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={trendData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="received" stroke="#006847" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="expected" stroke="#f59e0b" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Price Trend Chart */}
        <Card className="shadow-lg">
          <div className="p-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Price Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={priceTrendData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="plannedPrice" stroke="#006847" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="actualPrice" stroke="#f59e0b" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}