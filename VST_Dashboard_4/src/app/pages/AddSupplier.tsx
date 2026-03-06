import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { ChevronRight, Save, X } from "lucide-react";
import { toast } from "sonner";
import { items } from "../data/items";
import { Checkbox } from "../components/ui/checkbox";
import { Badge } from "../components/ui/badge";

export default function AddSupplier() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    selectedItems: [] as string[], // Array of item IDs
    contact: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    gst: "",
    collaborationDate: "",
    status: "active",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (itemId: string) => {
    setFormData((prev) => {
      const selectedItems = prev.selectedItems.includes(itemId)
        ? prev.selectedItems.filter((id) => id !== itemId)
        : [...prev.selectedItems, itemId];
      return {
        ...prev,
        selectedItems,
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.selectedItems.length || !formData.contact || !formData.email || !formData.phone) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Phone validation (basic)
    const phoneRegex = /^[+]?[0-9\s-]{10,}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error("Please enter a valid phone number");
      return;
    }

    // Success
    toast.success("Supplier added successfully!");
    console.log("Supplier Data:", formData);

    // Navigate back to suppliers page
    setTimeout(() => {
      navigate("/suppliers");
    }, 1000);
  };

  const handleCancel = () => {
    navigate("/suppliers");
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
            to="/suppliers"
            className="hover:text-[#006847] transition-colors font-medium"
          >
            Suppliers
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-semibold">Add Supplier</span>
        </nav>
      </div>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Add New Supplier</h1>
          <p className="text-gray-600 mt-1">Enter supplier details to add them to your system</p>
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
                  <Label htmlFor="name" className="text-gray-700 font-semibold">
                    Supplier Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter supplier name"
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="contact" className="text-gray-700 font-semibold">
                    Contact Person <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="contact"
                    name="contact"
                    type="text"
                    value={formData.contact}
                    onChange={handleChange}
                    placeholder="Enter contact person name"
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-gray-700 font-semibold">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="supplier@example.com"
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-gray-700 font-semibold">
                    Phone Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="gst" className="text-gray-700 font-semibold">
                    GST Number
                  </Label>
                  <Input
                    id="gst"
                    name="gst"
                    type="text"
                    value={formData.gst}
                    onChange={handleChange}
                    placeholder="22AAAAA0000A1Z5"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="collaborationDate" className="text-gray-700 font-semibold">
                    Collaboration Date with VST
                  </Label>
                  <Input
                    id="collaborationDate"
                    name="collaborationDate"
                    type="date"
                    value={formData.collaborationDate}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Items Selection from Item Master */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-[#006847]">
                Select Items from Item Master <span className="text-red-500">*</span>
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Select the items that this supplier will provide
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Checkbox
                      id={`item-${item.id}`}
                      checked={formData.selectedItems.includes(item.id)}
                      onCheckedChange={() => handleCheckboxChange(item.id)}
                    />
                    <div className="flex-1">
                      <label
                        htmlFor={`item-${item.id}`}
                        className="text-sm font-semibold text-gray-900 cursor-pointer block"
                      >
                        {item.itemName}
                      </label>
                      <p className="text-xs text-gray-600">{item.itemCode}</p>
                      <p className="text-xs text-gray-500">{item.category}</p>
                    </div>
                  </div>
                ))}
              </div>
              {formData.selectedItems.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-semibold text-[#006847]">
                    Selected {formData.selectedItems.length} item(s)
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.selectedItems.map((itemId) => {
                      const item = items.find((i) => i.id === itemId);
                      return item ? (
                        <Badge
                          key={itemId}
                          className="bg-[#006847] text-white hover:bg-[#005038]"
                        >
                          {item.itemName}
                        </Badge>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Address Information */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-[#006847]">
                Address Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Label htmlFor="address" className="text-gray-700 font-semibold">
                    Street Address
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter street address"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="city" className="text-gray-700 font-semibold">
                    City
                  </Label>
                  <Input
                    id="city"
                    name="city"
                    type="text"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter city"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="state" className="text-gray-700 font-semibold">
                    State
                  </Label>
                  <Input
                    id="state"
                    name="state"
                    type="text"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Enter state"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="pincode" className="text-gray-700 font-semibold">
                    Pincode
                  </Label>
                  <Input
                    id="pincode"
                    name="pincode"
                    type="text"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="Enter pincode"
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
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
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
                Save Supplier
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}