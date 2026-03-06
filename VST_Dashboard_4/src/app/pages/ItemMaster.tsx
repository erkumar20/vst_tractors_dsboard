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
import { Badge } from "../components/ui/badge";
import { Checkbox } from "../components/ui/checkbox";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { useNavigate } from "react-router";
import { items } from "../data/items";

export default function ItemMaster() {
  const navigate = useNavigate();

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

  const handleAddItem = () => {
    navigate("/add-item");
  };

  const handleEdit = (itemName: string) => {
    toast.info(`Editing ${itemName}`);
  };

  const handleDelete = (itemName: string) => {
    toast.error(`Delete ${itemName} functionality will be implemented`);
  };

  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleCheckboxChange = (itemId: string) => {
    setSelectedItems((prevSelectedItems) =>
      prevSelectedItems.includes(itemId)
        ? prevSelectedItems.filter((id) => id !== itemId)
        : [...prevSelectedItems, itemId]
    );
  };

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Material Master</h1>
          <p className="text-gray-600 mt-1">Manage your inventory materials and stock levels</p>
        </div>
        <div className="flex justify-end lg:justify-start">
          <Button
            onClick={handleAddItem}
            className="bg-[#006847] hover:bg-[#005a3c] text-white shrink-0"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Material
          </Button>
        </div>
      </div>

      {/* Items Table */}
      <Card className="shadow-lg">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#006847] hover:bg-[#006847]">
                <TableHead className="font-semibold text-white text-center">
                  <Checkbox
                    checked={selectedItems.length === items.length}
                    onCheckedChange={() =>
                      setSelectedItems(
                        selectedItems.length === items.length
                          ? []
                          : items.map((item) => item.id)
                      )
                    }
                  />
                </TableHead>
                <TableHead className="font-semibold text-white text-center">
                  Material Code
                </TableHead>
                <TableHead className="font-semibold text-white text-center">
                  Material
                </TableHead>
                <TableHead className="font-semibold text-white text-center">
                  Category
                </TableHead>
                <TableHead className="font-semibold text-white text-center">
                  Unit
                </TableHead>
                <TableHead className="font-semibold text-white text-center">
                  Reorder Level
                </TableHead>
                <TableHead className="font-semibold text-white text-center">
                  Current Stock
                </TableHead>
                <TableHead className="font-semibold text-white text-center">
                  Item Used
                </TableHead>
                <TableHead className="font-semibold text-white text-center">
                  Remaining
                </TableHead>
                <TableHead className="font-semibold text-white text-center">
                  Status
                </TableHead>
                <TableHead className="font-semibold text-white text-center">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id} className="hover:bg-gray-50">
                  <TableCell className="text-center font-mono font-semibold text-gray-900">
                    <Checkbox
                      checked={selectedItems.includes(item.id)}
                      onCheckedChange={() => handleCheckboxChange(item.id)}
                    />
                  </TableCell>
                  <TableCell className="text-center font-mono font-semibold text-gray-900">
                    {item.itemCode}
                  </TableCell>
                  <TableCell className="text-center font-semibold text-gray-900">
                    {item.itemName}
                  </TableCell>
                  <TableCell className="text-center text-gray-700">
                    {item.category}
                  </TableCell>
                  <TableCell className="text-center text-gray-700">
                    {item.unit}
                  </TableCell>
                  <TableCell className="text-center text-gray-700">
                    {item.reorderLevel}
                  </TableCell>
                  <TableCell className="text-center font-semibold text-[#006847]">
                    {item.currentStock}
                  </TableCell>
                  <TableCell className="text-center text-gray-700">
                    {item.itemUsed}
                  </TableCell>
                  <TableCell className="text-center text-gray-700">
                    {item.currentStock - item.itemUsed}
                  </TableCell>
                  <TableCell className="text-center">
                    {getStatusBadge(item.status)}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex gap-2 justify-center">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="hover:bg-gray-100"
                        onClick={() => handleEdit(item.itemName)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="hover:bg-red-50 hover:text-red-600"
                        onClick={() => handleDelete(item.itemName)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}