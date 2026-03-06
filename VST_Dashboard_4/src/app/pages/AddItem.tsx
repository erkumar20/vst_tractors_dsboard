import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { ChevronRight, Save, X } from "lucide-react";
import { toast } from "sonner";

export default function AddItem() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    itemCode: "",
    itemName: "",
    category: "",
    unit: "",
    description: "",
    reorderLevel: "",
    currentStock: "",
    itemUsed: "",
    minStock: "",
    maxStock: "",
    unitPrice: "",
    location: "",
    status: "available",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.itemCode || !formData.itemName || !formData.category || !formData.unit) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Numeric validation
    if (formData.reorderLevel && isNaN(Number(formData.reorderLevel))) {
      toast.error("Reorder level must be a number");
      return;
    }

    if (formData.currentStock && isNaN(Number(formData.currentStock))) {
      toast.error("Current stock must be a number");
      return;
    }

    if (formData.unitPrice && isNaN(Number(formData.unitPrice))) {
      toast.error("Unit price must be a number");
      return;
    }

    // Item Used validation - must be less than Current Stock
    if (formData.itemUsed && formData.currentStock) {
      const itemUsed = Number(formData.itemUsed);
      const currentStock = Number(formData.currentStock);

      if (itemUsed >= currentStock) {
        toast.error("Item Used must be less than Current Stock");
        return;
      }
    }

    // Success
    toast.success("Item added successfully!");
    console.log("Item Data:", formData);

    // Navigate back to item master page
    setTimeout(() => {
      navigate("/item-master");
    }, 1000);
  };

  const handleCancel = () => {
    navigate("/item-master");
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="mb-6">
        <nav className="flex items-center space-x-2 text-sm text-gray-600">
          <Link
            to="/"
            className="hover:text-[#006847] transition-colors font-medium"
          >
            Dashboard
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link
            to="/item-master"
            className="hover:text-[#006847] transition-colors font-medium"
          >
            Material Master
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-semibold">Add Material</span>
        </nav>
      </div>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Add New Material</h1>
          <p className="text-gray-600 mt-1">Enter material details to add them to your inventory</p>
        </div>
      </div>

      {/* Form */}
      <Card className="shadow-lg">
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            {/* Basic Information */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-[#006847]">
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="itemCode" className="text-gray-700 font-semibold">
                    Material Code <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="itemCode"
                    name="itemCode"
                    type="text"
                    value={formData.itemCode}
                    onChange={handleChange}
                    placeholder="MAT-001"
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="itemName" className="text-gray-700 font-semibold">
                    Material <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="itemName"
                    name="itemName"
                    type="text"
                    value={formData.itemName}
                    onChange={handleChange}
                    placeholder="Enter material name"
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="category" className="text-gray-700 font-semibold">
                    Category <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#006847] focus:border-transparent"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Engine Parts">Engine Parts</option>
                    <option value="Hydraulic Parts">Hydraulic Parts</option>
                    <option value="Transmission Parts">Transmission Parts</option>
                    <option value="Electrical Parts">Electrical Parts</option>
                    <option value="Body Parts">Body Parts</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="unit" className="text-gray-700 font-semibold">
                    Unit of Measure <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="unit"
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#006847] focus:border-transparent"
                    required
                  >
                    <option value="">Select Unit</option>
                    <option value="PCS">PCS (Pieces)</option>
                    <option value="KG">KG (Kilograms)</option>
                    <option value="LTR">LTR (Liters)</option>
                    <option value="MTR">MTR (Meters)</option>
                    <option value="BOX">BOX</option>
                    <option value="SET">SET</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="description" className="text-gray-700 font-semibold">
                    Description
                  </Label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter material description"
                    rows={3}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#006847] focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Stock Information */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-[#006847]">
                Stock Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="currentStock" className="text-gray-700 font-semibold">
                    Current Stock
                  </Label>
                  <Input
                    id="currentStock"
                    name="currentStock"
                    type="number"
                    value={formData.currentStock}
                    onChange={handleChange}
                    placeholder="0"
                    className="mt-1"
                    min="0"
                  />
                </div>

                <div>
                  <Label htmlFor="reorderLevel" className="text-gray-700 font-semibold">
                    Reorder Level
                  </Label>
                  <Input
                    id="reorderLevel"
                    name="reorderLevel"
                    type="number"
                    value={formData.reorderLevel}
                    onChange={handleChange}
                    placeholder="0"
                    className="mt-1"
                    min="0"
                  />
                </div>

                <div>
                  <Label htmlFor="itemUsed" className="text-gray-700 font-semibold">
                    Item Used
                  </Label>
                  <Input
                    id="itemUsed"
                    name="itemUsed"
                    type="number"
                    value={formData.itemUsed}
                    onChange={handleChange}
                    placeholder="0"
                    className="mt-1"
                    min="0"
                  />
                </div>

                <div>
                  <Label htmlFor="remaining" className="text-gray-700 font-semibold">
                    Remaining
                  </Label>
                  <Input
                    id="remaining"
                    name="remaining"
                    type="number"
                    value={
                      formData.currentStock && formData.itemUsed
                        ? Number(formData.currentStock) - Number(formData.itemUsed)
                        : formData.currentStock
                          ? Number(formData.currentStock)
                          : ""
                    }
                    placeholder="0"
                    className="mt-1 bg-gray-50"
                    disabled
                    readOnly
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Auto-calculated: Current Stock - Item Used
                  </p>
                </div>

                <div>
                  <Label htmlFor="minStock" className="text-gray-700 font-semibold">
                    Minimum Stock Level
                  </Label>
                  <Input
                    id="minStock"
                    name="minStock"
                    type="number"
                    value={formData.minStock}
                    onChange={handleChange}
                    placeholder="0"
                    className="mt-1"
                    min="0"
                  />
                </div>

                <div>
                  <Label htmlFor="maxStock" className="text-gray-700 font-semibold">
                    Maximum Stock Level
                  </Label>
                  <Input
                    id="maxStock"
                    name="maxStock"
                    type="number"
                    value={formData.maxStock}
                    onChange={handleChange}
                    placeholder="0"
                    className="mt-1"
                    min="0"
                  />
                </div>

                <div>
                  <Label htmlFor="location" className="text-gray-700 font-semibold">
                    Storage Location
                  </Label>
                  <Input
                    id="location"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Warehouse A, Rack 5"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="status" className="text-gray-700 font-semibold">
                    Status
                  </Label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#006847] focus:border-transparent"
                  >
                    <option value="available">Available</option>
                    <option value="low">Low Stock</option>
                    <option value="out">Out of Stock</option>
                    <option value="discontinued">Discontinued</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Pricing Information */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-[#006847]">
                Pricing Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="unitPrice" className="text-gray-700 font-semibold">
                    Unit Price (₹)
                  </Label>
                  <Input
                    id="unitPrice"
                    name="unitPrice"
                    type="number"
                    value={formData.unitPrice}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="mt-1"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#006847] hover:bg-[#005038] text-white flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Material
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}