import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
import { DateRange } from "react-day-picker";
import { isWithinInterval, parseISO } from "date-fns";
import { calculateVarianceAndStatus } from "../utils/varianceCalculations";
import {
    invoiceData,
    InvoiceData,
    varianceDataItem1,
    varianceDataItem2,
    varianceDataItem3,
    varianceDataItem4,
    varianceDataItem5,
    VarianceData
} from "../data/mockData";
import { items as initialItems, Item } from "../data/items";
import { bomDataItem1, bomDataItem2, bomDataItem3, bomDataItem4, bomDataItem5, BOMItem } from "../data/bomData";
import {
    billOfMaterialsPriceItem1,
    billOfMaterialsPriceItem2,
    billOfMaterialsPriceItem3,
    billOfMaterialsPriceItem4,
    billOfMaterialsPriceItem5,
    BillOfMaterialsPriceItem
} from "../data/billOfMaterialsData";
import { toast } from "sonner";

export interface Supplier {
    id: string;
    name: string;
    itemName: string;
    contact: string;
    email: string;
    phone: string;
    status: 'active' | 'inactive';
}

const initialSuppliers: Supplier[] = [
    { id: "1", name: "ABC Components Ltd", itemName: "Item 1", contact: "John Smith", email: "john@abccomponents.com", phone: "+91 98765 43210", status: "active" },
    { id: "2", name: "XYZ Parts Co", itemName: "Item 1", contact: "Sarah Johnson", email: "sarah@xyzparts.com", phone: "+91 98765 43211", status: "active" },
    { id: "3", name: "DEF Manufacturing", itemName: "Item 1", contact: "Mike Wilson", email: "mike@defmfg.com", phone: "+91 98765 43212", status: "active" },
    { id: "4", name: "GHI Suppliers", itemName: "Item 2", contact: "Emily Brown", email: "emily@ghisuppliers.com", phone: "+91 98765 43213", status: "active" },
    { id: "5", name: "JKL Industries", itemName: "Item 2", contact: "David Lee", email: "david@jklindustries.com", phone: "+91 98765 43214", status: "inactive" },
];

interface AppDataContextType {
    invoices: InvoiceData[];
    setInvoices: (data: InvoiceData[]) => void;
    items: Item[];
    setItems: (data: Item[]) => void;
    suppliers: Supplier[];
    setSuppliers: (data: Supplier[]) => void;

    item1Variance: VarianceData[];
    setItem1Variance: (data: VarianceData[]) => void;
    item2Variance: VarianceData[];
    setItem2Variance: (data: VarianceData[]) => void;
    item3Variance: VarianceData[];
    setItem3Variance: (data: VarianceData[]) => void;
    item4Variance: VarianceData[];
    setItem4Variance: (data: VarianceData[]) => void;
    item5Variance: VarianceData[];
    setItem5Variance: (data: VarianceData[]) => void;

    item1Bom: BOMItem[];
    setItem1Bom: (data: BOMItem[]) => void;
    item2Bom: BOMItem[];
    setItem2Bom: (data: BOMItem[]) => void;
    item3Bom: BOMItem[];
    setItem3Bom: (data: BOMItem[]) => void;
    item4Bom: BOMItem[];
    setItem4Bom: (data: BOMItem[]) => void;
    item5Bom: BOMItem[];
    setItem5Bom: (data: BOMItem[]) => void;

    item1Price: BillOfMaterialsPriceItem[];
    setItem1Price: (data: BillOfMaterialsPriceItem[]) => void;
    item2Price: BillOfMaterialsPriceItem[];
    setItem2Price: (data: BillOfMaterialsPriceItem[]) => void;
    item3Price: BillOfMaterialsPriceItem[];
    setItem3Price: (data: BillOfMaterialsPriceItem[]) => void;
    item4Price: BillOfMaterialsPriceItem[];
    setItem4Price: (data: BillOfMaterialsPriceItem[]) => void;
    item5Price: BillOfMaterialsPriceItem[];
    setItem5Price: (data: BillOfMaterialsPriceItem[]) => void;

    dateRange: DateRange | undefined;
    setDateRange: (range: DateRange | undefined) => void;

    updateVarianceData: (materialNo: string, updatedData: VarianceData[]) => void;

    /**
     * Merge new invoices and SOB data into the system
     */
    importSystemData: (sob: any[], grn: any[]) => void;
    resetAllData: () => void;
    syncVariancesFromInvoices: () => void;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export function AppDataProvider({ children }: { children: ReactNode }) {
    const getStored = (key: string, fallback: any) => {
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : fallback;
    };

    const [invoices, setInvoices] = useState<InvoiceData[]>(() => getStored("vst_invoices", invoiceData));
    const [items, setItems] = useState<Item[]>(() => getStored("vst_items", initialItems));
    const [suppliers, setSuppliers] = useState<Supplier[]>(() => getStored("vst_suppliers", initialSuppliers));

    const [item1Variance, setItem1Variance] = useState<VarianceData[]>(() => getStored("vst_item1_variance", varianceDataItem1));
    const [item2Variance, setItem2Variance] = useState<VarianceData[]>(() => getStored("vst_item2_variance", varianceDataItem2));
    const [item3Variance, setItem3Variance] = useState<VarianceData[]>(() => getStored("vst_item3_variance", varianceDataItem3));
    const [item4Variance, setItem4Variance] = useState<VarianceData[]>(() => getStored("vst_item4_variance", varianceDataItem4));
    const [item5Variance, setItem5Variance] = useState<VarianceData[]>(() => getStored("vst_item5_variance", varianceDataItem5));

    const [item1Bom, setItem1Bom] = useState<BOMItem[]>(() => getStored("vst_item1_bom", bomDataItem1));
    const [item2Bom, setItem2Bom] = useState<BOMItem[]>(() => getStored("vst_item2_bom", bomDataItem2));
    const [item3Bom, setItem3Bom] = useState<BOMItem[]>(() => getStored("vst_item3_bom", bomDataItem3));
    const [item4Bom, setItem4Bom] = useState<BOMItem[]>(() => getStored("vst_item4_bom", bomDataItem4));
    const [item5Bom, setItem5Bom] = useState<BOMItem[]>(() => getStored("vst_item5_bom", bomDataItem5));

    const [item1Price, setItem1Price] = useState<BillOfMaterialsPriceItem[]>(() => getStored("vst_item1_price", billOfMaterialsPriceItem1));
    const [item2Price, setItem2Price] = useState<BillOfMaterialsPriceItem[]>(() => getStored("vst_item2_price", billOfMaterialsPriceItem2));
    const [item3Price, setItem3Price] = useState<BillOfMaterialsPriceItem[]>(() => getStored("vst_item3_price", billOfMaterialsPriceItem3));
    const [item4Price, setItem4Price] = useState<BillOfMaterialsPriceItem[]>(() => getStored("vst_item4_price", billOfMaterialsPriceItem4));
    const [item5Price, setItem5Price] = useState<BillOfMaterialsPriceItem[]>(() => getStored("vst_item5_price", billOfMaterialsPriceItem5));

    useEffect(() => {
        localStorage.setItem("vst_invoices", JSON.stringify(invoices));
        localStorage.setItem("vst_items", JSON.stringify(items));
        localStorage.setItem("vst_suppliers", JSON.stringify(suppliers));
        localStorage.setItem("vst_item1_variance", JSON.stringify(item1Variance));
        localStorage.setItem("vst_item2_variance", JSON.stringify(item2Variance));
        localStorage.setItem("vst_item3_variance", JSON.stringify(item3Variance));
        localStorage.setItem("vst_item4_variance", JSON.stringify(item4Variance));
        localStorage.setItem("vst_item5_variance", JSON.stringify(item5Variance));
        localStorage.setItem("vst_item1_bom", JSON.stringify(item1Bom));
        localStorage.setItem("vst_item2_bom", JSON.stringify(item2Bom));
        localStorage.setItem("vst_item3_bom", JSON.stringify(item3Bom));
        localStorage.setItem("vst_item4_bom", JSON.stringify(item4Bom));
        localStorage.setItem("vst_item5_bom", JSON.stringify(item5Bom));
        localStorage.setItem("vst_item1_price", JSON.stringify(item1Price));
        localStorage.setItem("vst_item2_price", JSON.stringify(item2Price));
        localStorage.setItem("vst_item3_price", JSON.stringify(item3Price));
        localStorage.setItem("vst_item4_price", JSON.stringify(item4Price));
        localStorage.setItem("vst_item5_price", JSON.stringify(item5Price));
    }, [invoices, items, suppliers, item1Variance, item2Variance, item3Variance, item4Variance, item5Variance, item1Bom, item2Bom, item3Bom, item4Bom, item5Bom, item1Price, item2Price, item3Price, item4Price, item5Price]);

    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: new Date(2026, 0, 1), // Jan 1, 2026
        to: new Date(2026, 11, 31)  // Dec 31, 2026
    });

    const syncVariancesFromInvoices = useCallback(() => {
        const calculateVarianceForMaterial = (materialNo: string, baseVariances: VarianceData[]) => {
            const supplierStats: Record<string, { qty: number, price: number, count: number, plannedQty: number, plannedPrice: number }> = {};

            const filteredInvoices = invoices.filter(inv => {
                if (inv.materialNo !== materialNo) return false;
                if (!dateRange?.from) return true;

                try {
                    const invDate = parseISO(inv.date);
                    if (dateRange.to) {
                        return isWithinInterval(invDate, { start: dateRange.from, end: dateRange.to });
                    }
                    return invDate >= dateRange.from;
                } catch (e) {
                    return true; // If date parsing fails, include it
                }
            });

            filteredInvoices.forEach(inv => {
                const sName = inv.supplierName;
                if (!supplierStats[sName]) {
                    supplierStats[sName] = { qty: 0, price: 0, count: 0, plannedQty: 0, plannedPrice: 0 };
                }
                supplierStats[sName].qty += Number(inv.quantityReceived || 0);
                supplierStats[sName].price += Number(inv.actualPrice || 0);
                supplierStats[sName].plannedQty += Number(inv.expectedQuantity || 0);
                supplierStats[sName].plannedPrice += Number(inv.plannedPrice || 0);
                supplierStats[sName].count += 1;
            });

            const totalMaterialQty = Object.values(supplierStats).reduce((sum, s) => sum + s.qty, 0);

            const updatedVariances = baseVariances.map(v => {
                const stats = supplierStats[v.supplier];

                // If no stats found for this supplier in the date range, reset actuals
                if (!stats) {
                    const actualAllocation = 0;
                    const varianceVal = v.plannedAllocation - actualAllocation;
                    const { status } = calculateVarianceAndStatus(v.plannedAllocation, actualAllocation);

                    return {
                        ...v,
                        actualQuantity: 0,
                        actualAllocation: 0,
                        variance: Number(varianceVal.toFixed(2)),
                        status
                    } as VarianceData;
                }

                const avgActualPrice = stats.price / stats.count;
                const avgPlannedPrice = stats.plannedPrice / stats.count;
                const actualAllocation = totalMaterialQty > 0 ? (stats.qty / totalMaterialQty) * 100 : 0;

                const varianceVal = v.plannedAllocation - actualAllocation;
                const { status } = calculateVarianceAndStatus(v.plannedAllocation, actualAllocation);

                return {
                    ...v,
                    actualQuantity: stats.qty,
                    actualPrice: Math.round(avgActualPrice),
                    plannedPrice: Math.round(avgPlannedPrice),
                    actualAllocation: Number(actualAllocation.toFixed(2)),
                    variance: Number(varianceVal.toFixed(2)),
                    status
                } as VarianceData;
            });

            return updatedVariances;
        };

        setItem1Variance(prev => calculateVarianceForMaterial("ACA11C00210A0", prev));
        setItem2Variance(prev => calculateVarianceForMaterial("ACA01C00440A0", prev));
        setItem3Variance(prev => calculateVarianceForMaterial("ACA11C00230A1", prev));
        setItem4Variance(prev => calculateVarianceForMaterial("ACA01C00430A0", prev));
        setItem5Variance(prev => calculateVarianceForMaterial("TRA90C32520A1", prev));
    }, [invoices, dateRange]);

    useEffect(() => {
        // Auto-sync variances whenever the date range or invoices change
        syncVariancesFromInvoices();
    }, [syncVariancesFromInvoices]);

    const importSystemData = (sob: any[], grn: any[]) => {
        // 1. Merge Invoices (avoid duplicates by invoiceNumber + date + material)
        const newInvoices: InvoiceData[] = grn.map((row, idx) => ({
            id: `imp-${Date.now()}-${idx}`,
            invoiceNumber: row.invoiceNumber || row["SUPPLIER INVOICE NUMBER"] || `INV-${Math.random().toString(36).substr(2, 9)}`,
            supplierName: row.supplierName || row["SUPPLIER NAME"],
            date: row.date || row["GRN DATE"],
            quantityReceived: Number(row.receivedQty || row["RECEIVED QTY"] || 0),
            expectedQuantity: Number(row.quantity || row["QUANTITY"] || 0),
            plannedPrice: Number(row.poPrice || row["PO PRICE"] || 0),
            actualPrice: Number(row.poPrice || row["PO PRICE"] || 0),
            status: 'received',
            batchNumber: row.grnNumber || row["GRN NUMBER"] || 'B-001',
            receivedBy: row["Buyer Name"] || 'System',
            materialNo: row.materialNo || row["MATERIAL NO"],
            materialDesc: row.materialDesc || row["MATERIAL DESC"]
        }));

        setInvoices(prev => {
            const existingKeys = new Set(prev.map(i => `${i.invoiceNumber}-${i.materialNo}`));
            const uniqueNew = newInvoices.filter(i => !existingKeys.has(`${i.invoiceNumber}-${i.materialNo}`));
            return [...prev, ...uniqueNew];
        });

        // 2. Update Quotas (SOB) if present
        if (sob.length > 0) {
            const sobMap = sob.reduce((acc: any, row: any) => {
                const material = row.itemCode || row["Material"];
                if (!acc[material]) acc[material] = [];
                acc[material].push({
                    supplier: row.supplier || row["Vendor's account number"],
                    quota: Number(row.plannedAllocation || row["Quota"] || 0)
                });
                return acc;
            }, {});

            const updateVarianceList = (prev: VarianceData[], materialNo: string) => {
                const quotas = sobMap[materialNo];
                if (!quotas) return prev;

                return prev.map(v => {
                    const match = quotas.find((q: any) => q.supplier === v.supplier);
                    return match ? { ...v, plannedAllocation: match.quota } : v;
                });
            };

            setItem1Variance(prev => updateVarianceList(prev, "ACA11C00210A0"));
            setItem2Variance(prev => updateVarianceList(prev, "ACA01C00440A0"));
            setItem3Variance(prev => updateVarianceList(prev, "ACA11C00230A1"));
            setItem4Variance(prev => updateVarianceList(prev, "ACA01C00430A0"));
            setItem5Variance(prev => updateVarianceList(prev, "TRA90C32520A1"));
        }

        toast.success(`Imported ${newInvoices.length} records. Syncing variances...`);
        // The useEffect will trigger storage, but we should also sync variances
        setTimeout(syncVariancesFromInvoices, 500);
    };

    const updateVarianceData = (materialNo: string, updatedData: VarianceData[]) => {
        switch (materialNo) {
            case "ACA11C00210A0": setItem1Variance(updatedData); break;
            case "ACA01C00440A0": setItem2Variance(updatedData); break;
            case "ACA11C00230A1": setItem3Variance(updatedData); break;
            case "ACA01C00430A0": setItem4Variance(updatedData); break;
            case "TRA90C32520A1": setItem5Variance(updatedData); break;
        }
        toast.success("Changes saved successfully!");
    };

    const resetAllData = () => {
        if (window.confirm("Are you sure you want to reset all data? This will clear all imports.")) {
            localStorage.clear();
            window.location.reload();
        }
    };

    return (
        <AppDataContext.Provider value={{
            invoices, setInvoices,
            items, setItems,
            suppliers, setSuppliers,
            item1Variance, setItem1Variance,
            item2Variance, setItem2Variance,
            item3Variance, setItem3Variance,
            item4Variance, setItem4Variance,
            item5Variance, setItem5Variance,
            item1Bom, setItem1Bom,
            item2Bom, setItem2Bom,
            item3Bom, setItem3Bom,
            item4Bom, setItem4Bom,
            item5Bom, setItem5Bom,
            item1Price, setItem1Price,
            item2Price, setItem2Price,
            item3Price, setItem3Price,
            item4Price, setItem4Price,
            item5Price, setItem5Price,
            dateRange, setDateRange,
            updateVarianceData,
            resetAllData,
            syncVariancesFromInvoices,
            importSystemData
        }}>
            {children}
        </AppDataContext.Provider>
    );
}

export function useAppData() {
    const context = useContext(AppDataContext);
    if (context === undefined) {
        throw new Error("useAppData must be used within an AppDataProvider");
    }
    return context;
}
