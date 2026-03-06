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
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { useState } from "react";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

// Simplified BOM Component structure
interface BOMComponent {
  id: string;
  componentCode: string;
  componentName: string;
  quantity: number;
  unit: string;
  unitCost: number;
  deviatedPrice: number;
}

interface ItemBOM {
  itemName: string;
  components: BOMComponent[];
}

// Mock BOM data - simplified to just Item 1 and Item 2
// Mock BOM data - populated for all 5 materials
const initialBOMData: ItemBOM[] = [
  {
    itemName: "AXEL GEAR CT85",
    components: [
      {
        id: "1",
        componentCode: "COMP-AG-001",
        componentName: "Spur Gear",
        quantity: 1,
        unit: "PCS",
        unitCost: 1500,
        deviatedPrice: 1550,
      },
      {
        id: "2",
        componentCode: "COMP-AG-002",
        componentName: "Pinion Shaft",
        quantity: 1,
        unit: "PCS",
        unitCost: 1200,
        deviatedPrice: 1200,
      },
    ],
  },
  {
    itemName: "FLY WHEEL",
    components: [
      {
        id: "1",
        componentCode: "COMP-FW-001",
        componentName: "Flywheel Ring",
        quantity: 1,
        unit: "PCS",
        unitCost: 2500,
        deviatedPrice: 2594,
      },
      {
        id: "2",
        componentCode: "COMP-FW-002",
        componentName: "Flywheel Hub",
        quantity: 1,
        unit: "PCS",
        unitCost: 1200,
        deviatedPrice: 1200,
      },
    ],
  },
  {
    itemName: "Final Drive Gear",
    components: [
      {
        id: "1",
        componentCode: "COMP-FD-001",
        componentName: "Drive Plate",
        quantity: 1,
        unit: "PCS",
        unitCost: 3200,
        deviatedPrice: 3200,
      },
      {
        id: "2",
        componentCode: "COMP-FD-002",
        componentName: "Drive Coupler",
        quantity: 1,
        unit: "PCS",
        unitCost: 1100,
        deviatedPrice: 1150,
      },
    ],
  },
  {
    itemName: "GEAR CASE",
    components: [
      {
        id: "1",
        componentCode: "COMP-GC-001",
        componentName: "Casing Upper",
        quantity: 1,
        unit: "PCS",
        unitCost: 4500,
        deviatedPrice: 4600,
      },
      {
        id: "2",
        componentCode: "COMP-GC-002",
        componentName: "Casing Lower",
        quantity: 1,
        unit: "PCS",
        unitCost: 4200,
        deviatedPrice: 4200,
      },
    ],
  },
  {
    itemName: "Shaft Final",
    components: [
      {
        id: "1",
        componentCode: "COMP-SF-001",
        componentName: "Shaft Core",
        quantity: 1,
        unit: "PCS",
        unitCost: 6800,
        deviatedPrice: 6925,
      },
      {
        id: "2",
        componentCode: "COMP-SF-002",
        componentName: "Shaft Sleeve",
        quantity: 1,
        unit: "PCS",
        unitCost: 1500,
        deviatedPrice: 1500,
      },
    ],
  },
];

export default function BOMMaster() {
  const navigate = useNavigate();
  const [bomData, setBomData] = useState<ItemBOM[]>(initialBOMData);
  const [editingComponent, setEditingComponent] = useState<{
    itemName: string;
    componentId: string;
  } | null>(null);

  const calculateTotalCost = (components: BOMComponent[]) => {
    return components.reduce(
      (sum, component) => sum + component.quantity * component.unitCost,
      0
    );
  };

  const handleAddComponent = (itemName: string) => {
    navigate(`/add-bom?item=${itemName}`);
  };

  const handleEdit = (itemName: string, componentId: string) => {
    setEditingComponent({ itemName, componentId });
    toast.info(`Edit mode enabled for component`);
  };

  const handleDelete = (
    itemName: string,
    componentId: string,
    componentName: string
  ) => {
    setBomData((prev) =>
      prev.map((item) =>
        item.itemName === itemName
          ? {
            ...item,
            components: item.components.filter((c) => c.id !== componentId),
          }
          : item
      )
    );
    toast.success(`Deleted ${componentName}`);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">BOM Master</h1>
          <p className="text-gray-600 mt-1">Manage Bill of Materials for each item</p>
        </div>
        <div className="flex justify-end lg:justify-start">
          <Button
            onClick={() => handleAddComponent("")}
            className="gap-2 bg-[#006847] hover:bg-[#005038]"
          >
            <Plus className="w-4 h-4" />
            Add BOM
          </Button>
        </div>
      </div>

      {/* BOM Tables for each item */}
      <div className="space-y-6">
        {bomData.map((item) => (
          <Card key={item.itemName} className="shadow-lg">
            <div className="p-6">
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {item.itemName}
                </h2>
                <p className="text-sm text-gray-600">
                  {item.components.length} Components • Total Cost: ₹
                  {calculateTotalCost(item.components).toLocaleString()}
                </p>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[#006847] hover:bg-[#006847]">
                      <TableHead className="font-semibold text-white text-center">
                        Component Code
                      </TableHead>
                      <TableHead className="font-semibold text-white text-center">
                        Component Name
                      </TableHead>
                      <TableHead className="font-semibold text-white text-center">
                        Quantity
                      </TableHead>
                      <TableHead className="font-semibold text-white text-center">
                        Unit Cost
                      </TableHead>
                      <TableHead className="font-semibold text-white text-center">
                        Total Cost
                      </TableHead>
                      <TableHead className="font-semibold text-white text-center">
                        Current Unit Price
                      </TableHead>
                      <TableHead className="font-semibold text-white text-center">
                        Variance
                      </TableHead>
                      <TableHead className="font-semibold text-white text-center">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {item.components.map((component) => (
                      <TableRow key={component.id} className="hover:bg-gray-50">
                        <TableCell className="text-center font-semibold text-[#006847]">
                          {component.componentCode}
                        </TableCell>
                        <TableCell className="text-center font-semibold">
                          {component.componentName}
                        </TableCell>
                        <TableCell className="text-center">
                          {component.quantity} {component.unit}
                        </TableCell>
                        <TableCell className="text-center">
                          ₹{component.unitCost.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-center font-semibold text-[#006847]">
                          ₹
                          {(
                            component.quantity * component.unitCost
                          ).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-center">
                          ₹{(component.deviatedPrice || 0).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-center">
                          {(() => {
                            const variance =
                              component.deviatedPrice - component.unitCost;
                            const isPositive = variance > 0;
                            const isNegative = variance < 0;
                            return (
                              <span
                                className={`font-semibold ${isPositive
                                  ? "text-red-600"
                                  : isNegative
                                    ? "text-green-600"
                                    : "text-gray-600"
                                  }`}
                              >
                                {isPositive ? "+" : ""}
                                ₹{Math.abs(variance).toLocaleString()}
                              </span>
                            );
                          })()}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                handleEdit(item.itemName, component.id)
                              }
                              className="hover:bg-blue-100 hover:text-blue-600"
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                handleDelete(
                                  item.itemName,
                                  component.id,
                                  component.componentName
                                )
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
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}