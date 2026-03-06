export interface Item {
  id: string;
  itemCode: string;
  itemName: string;
  category: string;
  unit: string;
  reorderLevel: number;
  currentStock: number;
  itemUsed: number;
  remaining: number;
  status: string;
}

export const items: Item[] = [
  {
    id: "1",
    itemCode: "ACA11C00210A0",
    itemName: "AXEL GEAR CT85",
    category: "Transmission Parts",
    unit: "PCS",
    reorderLevel: 50,
    currentStock: 235,
    itemUsed: 15,
    remaining: 220,
    status: "available",
  },
  {
    id: "2",
    itemCode: "ACA01C00440A0",
    itemName: "FLY WHEEL",
    category: "Engine Parts",
    unit: "PCS",
    reorderLevel: 30,
    currentStock: 196,
    itemUsed: 14,
    remaining: 182,
    status: "available",
  },
  {
    id: "3",
    itemCode: "ACA11C00230A1",
    itemName: "Final Drive Gear",
    category: "Transmission Parts",
    unit: "PCS",
    reorderLevel: 40,
    currentStock: 35,
    itemUsed: 15,
    remaining: 20,
    status: "low",
  },
  {
    id: "4",
    itemCode: "ACA01C00430A0",
    itemName: "GEAR CASE",
    category: "Engine Parts",
    unit: "PCS",
    reorderLevel: 25,
    currentStock: 15,
    itemUsed: 8,
    remaining: 7,
    status: "critical",
  },
  {
    id: "5",
    itemCode: "TRA90C32520A1",
    itemName: "Shaft Final",
    category: "Transmission Parts",
    unit: "PCS",
    reorderLevel: 20,
    currentStock: 55,
    itemUsed: 40,
    remaining: 15,
    status: "available",
  },
];