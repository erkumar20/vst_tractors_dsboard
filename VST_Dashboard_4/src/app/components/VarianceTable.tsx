import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import type { VarianceData } from "../data/mockData";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Pencil, Check, X } from "lucide-react";
import { calculateVarianceAndStatus } from "../utils/varianceCalculations";
import { toast } from "sonner";

interface VarianceTableProps {
  data: VarianceData[];
  onDataUpdate?: (updatedData: VarianceData[]) => void;
  itemName?: string;
}

export default function VarianceTable({ data, onDataUpdate, itemName }: VarianceTableProps) {
  const navigate = useNavigate();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'high':
        return <Badge className="bg-red-100 text-red-700 border-red-300">Critical</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300">Warning</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-700 border-green-300">Healthy</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getVarianceColor = (status: 'high' | 'medium' | 'low') => {
    switch (status) {
      case 'high':
        return 'text-red-600 font-semibold';
      case 'medium':
        return 'text-orange-600 font-semibold';
      case 'low':
        return 'text-green-600 font-semibold';
      default:
        return 'text-gray-600 font-semibold';
    }
  };

  // Calculate totals
  const totalPlannedAllocation = data.reduce((sum, row) => sum + (row.plannedAllocation || 0), 0);
  const totalPlannedQuantity = data.reduce((sum, row) => sum + (row.plannedQuantity || 0), 0);
  const totalPlannedPrice = data.reduce((sum, row) => sum + (row.plannedPrice || 0), 0);
  const totalActualAllocation = data.reduce((sum, row) => sum + (row.actualAllocation || 0), 0);
  const totalActualQuantity = data.reduce((sum, row) => sum + (row.actualQuantity || 0), 0);
  const totalActualPrice = data.reduce((sum, row) => sum + (row.actualPrice || 0), 0);
  const totalVariance = totalPlannedAllocation - totalActualAllocation;

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{
    plannedAllocation: number;
    plannedPrice: number;
  }>({ plannedAllocation: 0, plannedPrice: 0 });

  const [isEditingTotal, setIsEditingTotal] = useState(false);
  const [editTotalValue, setEditTotalValue] = useState<number>(0);

  const handleActualQuantityClick = (supplierName: string) => {
    navigate(`/invoices?supplier=${encodeURIComponent(supplierName)}`);
  };

  const handleEditClick = (row: VarianceData) => {
    setEditingId(row.id);
    setEditValues({ plannedAllocation: row.plannedAllocation ?? 0, plannedPrice: row.plannedPrice ?? 0 });
    const updatedData = data.map(d => d.id === row.id ? { ...d, isEditing: true } : d);
    onDataUpdate?.(updatedData);
  };

  const handleSaveClick = (row: VarianceData) => {
    // When saving a supplier's modified allocation, automatically calculate their plannedQuantity using the global total
    const newQuantity = Math.round(totalPlannedQuantity * (editValues.plannedAllocation / 100));

    const updatedData = data.map(d => d.id === row.id ? {
      ...d,
      isEditing: false,
      plannedAllocation: editValues.plannedAllocation,
      plannedQuantity: newQuantity,
      plannedPrice: editValues.plannedPrice
    } : d);
    onDataUpdate?.(updatedData);
    setEditingId(null);
  };

  const handleCancelClick = (row: VarianceData) => {
    const updatedData = data.map(d => d.id === row.id ? { ...d, isEditing: false } : d);
    onDataUpdate?.(updatedData);
    setEditingId(null);
  };

  const handleEditTotalClick = () => {
    setEditTotalValue(totalPlannedQuantity);
    setIsEditingTotal(true);
  };

  const handleSaveTotalClick = () => {
    // Distribute the new Total out to all suppliers based on their allocation %
    const updatedData = data.map(d => ({
      ...d,
      plannedQuantity: Math.round(editTotalValue * ((d.plannedAllocation || 0) / 100))
    }));
    onDataUpdate?.(updatedData);
    setIsEditingTotal(false);
    toast.success("Total Planned Quantity distributed across suppliers.");
  };

  const handleCancelTotalClick = () => {
    setIsEditingTotal(false);
  };

  return (
    <Card className="shadow-md">
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">SOB - {itemName ?? "Item 1"}</h3>
          <p className="text-sm text-gray-600 mt-1">Real-time tracking of supplier performance (Planned allocation totals 100%)</p>
        </div>

      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#006847] hover:bg-[#006847]">
              <TableHead className="font-semibold text-white text-center">Supplier</TableHead>
              <TableHead className="font-semibold text-white text-center">Planned Allocation</TableHead>
              <TableHead className="font-semibold text-white text-center">Planned Quantity</TableHead>
              <TableHead className="font-semibold text-white text-center">Planned Price</TableHead>
              <TableHead className="font-semibold text-white text-center">Actual Allocation</TableHead>
              <TableHead className="font-semibold text-white text-center">Actual Quantity</TableHead>
              <TableHead className="font-semibold text-white text-center">Actual Price</TableHead>
              <TableHead className="font-semibold text-white text-center">Variance</TableHead>
              <TableHead className="font-semibold text-white text-center">Status</TableHead>
              <TableHead className="font-semibold text-white text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => {
              const { variance, status } = calculateVarianceAndStatus(
                row.plannedAllocation,
                row.actualAllocation
              );
              return (
                <TableRow key={row.id} className="hover:bg-gray-50">
                  <TableCell className="font-semibold text-gray-900 text-center">
                    {row.supplier}
                  </TableCell>
                  <TableCell className="text-center text-gray-700">
                    {editingId === row.id ? (
                      <input
                        type="number"
                        value={editValues.plannedAllocation}
                        onChange={(e) => setEditValues({ ...editValues, plannedAllocation: Number(e.target.value) })}
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-[#006847]"
                      />
                    ) : (
                      `${(row.plannedAllocation ?? 0).toFixed(2)}%`
                    )}
                  </TableCell>
                  <TableCell className="text-center text-gray-700">
                    <span title="Quantity is auto-calculated from Allocation %">
                      {row.plannedQuantity ?? 0}
                    </span>
                  </TableCell>
                  <TableCell className="text-center text-gray-700">
                    {editingId === row.id ? (
                      <input
                        type="number"
                        value={editValues.plannedPrice}
                        onChange={(e) => setEditValues({ ...editValues, plannedPrice: Number(e.target.value) })}
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-[#006847]"
                      />
                    ) : (
                      row.plannedPrice ?? 0
                    )}
                  </TableCell>
                  <TableCell className="text-center text-gray-700">{(row.actualAllocation ?? 0).toFixed(2)}%</TableCell>
                  <TableCell
                    className="text-center text-gray-700 cursor-pointer hover:text-[#006847] hover:underline transition-colors"
                    onClick={() => handleActualQuantityClick(row.supplier)}
                  >
                    {row.actualQuantity ?? 0}
                  </TableCell>
                  <TableCell className="text-center text-gray-700">{row.actualPrice ?? 0}</TableCell>
                  <TableCell className={`text-center ${getVarianceColor(status as 'high' | 'medium' | 'low')}`}>
                    {variance > 0 ? '+' : ''}{variance.toFixed(2)}%
                  </TableCell>
                  <TableCell className="text-center">
                    {getStatusBadge(status)}
                  </TableCell>
                  <TableCell className="text-center">
                    {editingId === row.id ? (
                      <div className="flex gap-2 justify-center">
                        <Button
                          size="sm"
                          variant="default"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleSaveClick(row)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCancelClick(row)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="hover:bg-gray-100"
                        onClick={() => handleEditClick(row)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
            <TableRow className="bg-gray-100 font-bold border-t-2 border-gray-300">
              <TableCell className="text-gray-900 text-center text-base">Total</TableCell>
              <TableCell className="text-center text-gray-900 text-base">{totalPlannedAllocation.toFixed(2)}%</TableCell>
              <TableCell className="text-center text-gray-900 text-base">
                {isEditingTotal ? (
                  <div className="flex items-center justify-center gap-2">
                    <input
                      type="number"
                      value={editTotalValue}
                      onChange={(e) => setEditTotalValue(Number(e.target.value))}
                      className="w-24 px-2 py-1 border border-[#006847] rounded text-center focus:outline-none focus:ring-2 focus:ring-[#006847]"
                      autoFocus
                    />
                    <Button size="sm" variant="default" className="h-7 w-7 p-0 bg-green-600 hover:bg-green-700" onClick={handleSaveTotalClick}>
                      <Check className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline" className="h-7 w-7 p-0" onClick={handleCancelTotalClick}>
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 group cursor-pointer" onClick={handleEditTotalClick} title="Click to edit Total Quantity">
                    <span className="border-b border-dashed border-gray-400 group-hover:border-[#006847] group-hover:text-[#006847] transition-colors">
                      {totalPlannedQuantity}
                    </span>
                    <Pencil className="h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                )}
              </TableCell>
              <TableCell className="text-center text-gray-900 text-base">{totalPlannedPrice.toFixed(2)}</TableCell>
              <TableCell className="text-center text-gray-900 text-base">{totalActualAllocation.toFixed(2)}%</TableCell>
              <TableCell className="text-center text-gray-900 text-base">{totalActualQuantity}</TableCell>
              <TableCell className="text-center text-gray-900 text-base">{totalActualPrice.toFixed(2)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}