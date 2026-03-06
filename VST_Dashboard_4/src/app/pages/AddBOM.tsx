import { useState } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import { useNavigate, useSearchParams } from "react-router";

export default function AddBOM() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const itemName = searchParams.get("item") || "Item 1";

  const [formData, setFormData] = useState({
    componentName: "",
    quantity: "",
    unit: "PCS",
    unitCost: "",
    deviatedPrice: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.componentName.trim()) {
      newErrors.componentName = "Component Name is required";
    }
    if (!formData.quantity || parseFloat(formData.quantity) <= 0) {
      newErrors.quantity = "Valid quantity is required";
    }
    if (!formData.unitCost || parseFloat(formData.unitCost) <= 0) {
      newErrors.unitCost = "Valid unit cost is required";
    }
    if (!formData.deviatedPrice || parseFloat(formData.deviatedPrice) <= 0) {
      newErrors.deviatedPrice = "Valid deviated price is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    const totalCost = parseFloat(formData.quantity) * parseFloat(formData.unitCost);

    toast.success(
      `Component "${formData.componentName}" added to ${itemName} (Total: ₹${totalCost.toLocaleString()})`
    );
    navigate("/bom-master");
  };

  const handleCancel = () => {
    navigate("/bom-master");
  };

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-start gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCancel}
            className="hover:bg-gray-100 mt-1 shrink-0 px-0 h-9 w-9"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Add Component to {itemName}</h1>
            <p className="text-gray-600 mt-1">Add a new component to the Bill of Materials</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="shadow-lg">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Component Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="componentName">
                  Component Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="componentName"
                  placeholder="e.g., Engine Block"
                  value={formData.componentName}
                  onChange={(e) =>
                    handleInputChange("componentName", e.target.value)
                  }
                  className={errors.componentName ? "border-red-500" : ""}
                />
                {errors.componentName && (
                  <p className="text-sm text-red-500">{errors.componentName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">
                  Quantity <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="e.g., 1"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange("quantity", e.target.value)}
                  className={errors.quantity ? "border-red-500" : ""}
                />
                {errors.quantity && (
                  <p className="text-sm text-red-500">{errors.quantity}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <Select
                  value={formData.unit}
                  onValueChange={(value) => handleInputChange("unit", value)}
                >
                  <SelectTrigger id="unit">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PCS">PCS</SelectItem>
                    <SelectItem value="SET">SET</SelectItem>
                    <SelectItem value="KG">KG</SelectItem>
                    <SelectItem value="L">L</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="unitCost">
                  Unit Cost (₹) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="unitCost"
                  type="number"
                  placeholder="e.g., 15000"
                  value={formData.unitCost}
                  onChange={(e) => handleInputChange("unitCost", e.target.value)}
                  className={errors.unitCost ? "border-red-500" : ""}
                />
                {errors.unitCost && (
                  <p className="text-sm text-red-500">{errors.unitCost}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="deviatedPrice">
                  Deviated Price (₹) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="deviatedPrice"
                  type="number"
                  placeholder="e.g., 15000"
                  value={formData.deviatedPrice}
                  onChange={(e) =>
                    handleInputChange("deviatedPrice", e.target.value)
                  }
                  className={errors.deviatedPrice ? "border-red-500" : ""}
                />
                {errors.deviatedPrice && (
                  <p className="text-sm text-red-500">{errors.deviatedPrice}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Total Cost</Label>
                <div className="text-2xl font-bold text-[#006847] bg-gray-50 p-3 rounded-lg">
                  ₹
                  {formData.quantity && formData.unitCost
                    ? (
                      parseFloat(formData.quantity) *
                      parseFloat(formData.unitCost)
                    ).toLocaleString()
                    : "0"}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="px-6"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="gap-2 bg-[#006847] hover:bg-[#005038] px-6"
          >
            <Save className="w-4 h-4" />
            Add Component
          </Button>
        </div>
      </form>
    </div>
  );
}