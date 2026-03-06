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
import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { useCategory } from "../context/CategoryContext";
import {
  varianceDataItem1,
  varianceDataItem2,
  varianceDataItem3,
  varianceDataItem4,
  varianceDataItem5,
  supplierDetailData
} from "../data/mockData";

export default function Suppliers() {
  const navigate = useNavigate();
  const { selectedCategory } = useCategory();

  // Helper to get data based on category
  const getSuppliersForCategory = () => {
    let varianceData;
    let categoryName;

    switch (selectedCategory) {
      case 'fly-wheel':
        varianceData = varianceDataItem2;
        categoryName = "FLY WHEEL";
        break;
      case 'final-drive':
        varianceData = varianceDataItem3;
        categoryName = "Final Drive Gear";
        break;
      case 'gear-case':
        varianceData = varianceDataItem4;
        categoryName = "GEAR CASE";
        break;
      case 'shaft-final':
        varianceData = varianceDataItem5;
        categoryName = "Shaft Final";
        break;
      case 'axel-gear':
      default:
        varianceData = varianceDataItem1;
        categoryName = "AXEL GEAR CT85";
        break;
    }

    // Map variance suppliers to more detailed supplier info
    return varianceData.map((v, index) => {
      // Try to find more details from supplierDetailData
      const details = supplierDetailData.find(s => s.name === v.supplier);
      return {
        id: v.id || String(index + 1),
        name: v.supplier,
        itemName: categoryName,
        contact: details?.contactPerson || "Point of Contact",
        email: details?.email || `${v.supplier.toLowerCase().replace(/\s+/g, '.')}@example.com`,
        phone: details?.phone || "+91 98765 00000",
        status: details?.status === 'high' ? 'inactive' : 'active',
      };
    });
  };

  const suppliers = useMemo(() => getSuppliersForCategory(), [selectedCategory]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-700 border-green-300">
            Active
          </Badge>
        );
      case "inactive":
        return (
          <Badge className="bg-gray-100 text-gray-700 border-gray-300">
            Inactive
          </Badge>
        );
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const handleAddSupplier = () => {
    navigate("/add-supplier");
  };

  const handleEdit = (supplierName: string) => {
    toast.info(`Editing ${supplierName}`);
  };

  const handleDelete = (supplierName: string) => {
    toast.error(`Delete ${supplierName} functionality will be implemented`);
  };

  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([]);

  const handleCheckboxChange = (supplierId: string) => {
    setSelectedSuppliers((prev) =>
      prev.includes(supplierId)
        ? prev.filter((id) => id !== supplierId)
        : [...prev, supplierId]
    );
  };

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Supplier Master</h1>
          <p className="text-gray-600 mt-1">Manage your supplier information and relationships</p>
        </div>
        <div className="flex justify-end lg:justify-start">
          <Button
            onClick={handleAddSupplier}
            className="bg-[#006847] hover:bg-[#005a3c] text-white shrink-0"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Supplier
          </Button>
        </div>
      </div>

      {/* Suppliers Table */}
      <Card className="shadow-lg">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#006847] hover:bg-[#006847]">
                <TableHead className="font-semibold text-white text-center">
                  <Checkbox
                    checked={selectedSuppliers.length === suppliers.length}
                    onCheckedChange={() =>
                      setSelectedSuppliers(
                        selectedSuppliers.length === suppliers.length
                          ? []
                          : suppliers.map((supplier) => supplier.id)
                      )
                    }
                  />
                </TableHead>
                <TableHead className="font-semibold text-white text-center">
                  Supplier
                </TableHead>
                <TableHead className="font-semibold text-white text-center">
                  Item Name
                </TableHead>
                <TableHead className="font-semibold text-white text-center">
                  Contact Person
                </TableHead>
                <TableHead className="font-semibold text-white text-center">
                  Email
                </TableHead>
                <TableHead className="font-semibold text-white text-center">
                  Phone
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
              {suppliers.map((supplier) => (
                <TableRow key={supplier.id} className="hover:bg-gray-50">
                  <TableCell className="text-center font-semibold text-gray-900">
                    <Checkbox
                      checked={selectedSuppliers.includes(supplier.id)}
                      onCheckedChange={() => handleCheckboxChange(supplier.id)}
                    />
                  </TableCell>
                  <TableCell className="text-center font-semibold text-gray-900">
                    {supplier.name}
                  </TableCell>
                  <TableCell className="text-center text-gray-700">
                    {supplier.itemName}
                  </TableCell>
                  <TableCell className="text-center text-gray-700">
                    {supplier.contact}
                  </TableCell>
                  <TableCell className="text-center text-gray-700">
                    {supplier.email}
                  </TableCell>
                  <TableCell className="text-center text-gray-700">
                    {supplier.phone}
                  </TableCell>
                  <TableCell className="text-center">
                    {getStatusBadge(supplier.status)}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex gap-2 justify-center">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="hover:bg-gray-100"
                        onClick={() => handleEdit(supplier.name)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="hover:bg-red-50 hover:text-red-600"
                        onClick={() => handleDelete(supplier.name)}
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