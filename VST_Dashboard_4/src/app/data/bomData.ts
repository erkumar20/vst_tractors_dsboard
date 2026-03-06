export interface BOMItem {
  id: string;
  componentCode: string;
  componentName: string;
  quantity: number;
  unit: string;
  unitCost: number;
  totalCost: number;
  supplier: string;
  leadTime: number;
  status: string;
}

export const bomDataItem1: BOMItem[] = [
  {
    id: "1",
    componentCode: "COMP-AG-001",
    componentName: "Spur Gear",
    quantity: 1,
    unit: "PCS",
    unitCost: 1500,
    totalCost: 1500,
    supplier: "Synnova Gears & Transmissions",
    leadTime: 7,
    status: "available",
  },
  {
    id: "2",
    componentCode: "COMP-AG-002",
    componentName: "Pinion Shaft",
    quantity: 2,
    unit: "PCS",
    unitCost: 850,
    totalCost: 1700,
    supplier: "SANGKAJ TECHNOLOGIES PRIVATE L",
    leadTime: 5,
    status: "available",
  },
];

export const bomDataItem2: BOMItem[] = [
  {
    id: "1",
    componentCode: "COMP-FW-001",
    componentName: "Flywheel Ring",
    quantity: 1,
    unit: "PCS",
    unitCost: 2500,
    totalCost: 2500,
    supplier: "Shimpukade Metallguss Pvt Ltd.",
    leadTime: 5,
    status: "available",
  },
  {
    id: "2",
    componentCode: "COMP-FW-002",
    componentName: "Flywheel Hub",
    quantity: 1,
    unit: "PCS",
    unitCost: 1200,
    totalCost: 1200,
    supplier: "V.R. Foundries",
    leadTime: 4,
    status: "available",
  },
];

export const bomDataItem3: BOMItem[] = [
  {
    id: "1",
    componentCode: "COMP-FD-001",
    componentName: "Drive Plate",
    quantity: 1,
    unit: "PCS",
    unitCost: 3200,
    totalCost: 3200,
    supplier: "Sree Ganesh Gears Private Ltd",
    leadTime: 10,
    status: "low",
  },
  {
    id: "2",
    componentCode: "COMP-FD-002",
    componentName: "Drive Coupler",
    quantity: 1,
    unit: "PCS",
    unitCost: 1100,
    totalCost: 1100,
    supplier: "Synnova Gears & Transmissions",
    leadTime: 8,
    status: "available",
  },
];

export const bomDataItem4: BOMItem[] = [
  {
    id: "1",
    componentCode: "COMP-GC-001",
    componentName: "Casing Upper",
    quantity: 1,
    unit: "PCS",
    unitCost: 4500,
    totalCost: 4500,
    supplier: "K.K.R.Metal Components",
    leadTime: 14,
    status: "critical",
  },
  {
    id: "2",
    componentCode: "COMP-GC-002",
    componentName: "Casing Lower",
    quantity: 1,
    unit: "PCS",
    unitCost: 4200,
    totalCost: 4200,
    supplier: "RANE (MADRAS) LIMITED",
    leadTime: 12,
    status: "available",
  },
];

export const bomDataItem5: BOMItem[] = [
  {
    id: "1",
    componentCode: "COMP-SF-001",
    componentName: "Shaft Core",
    quantity: 1,
    unit: "PCS",
    unitCost: 6800,
    totalCost: 6800,
    supplier: "GNA AXLES LIMITED",
    leadTime: 6,
    status: "available",
  },
  {
    id: "2",
    componentCode: "COMP-SF-002",
    componentName: "Shaft Sleeve",
    quantity: 1,
    unit: "PCS",
    unitCost: 1500,
    totalCost: 1500,
    supplier: "Shareen Auto Pvt Ltd",
    leadTime: 5,
    status: "available",
  },
];
