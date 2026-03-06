import * as XLSX from 'xlsx';
import type { VarianceData } from '../data/mockData';
import { calculateVarianceAndStatus } from './varianceCalculations';

export const SOB_MAPPING = {
    supplier: "Vendor's account number",
    plannedAllocation: "Quota",
    itemCode: "Material",
    itemName: "Material Number",
};

export const GRN_MAPPING = {
    supplier: "SUPPLIER NAME",
    actualQuantity: "RECEIVED QTY",
    plannedPrice: "PO PRICE",
    itemCode: "MATERIAL NO",
    itemName: "MATERIAL DESC",
    invoiceNumber: "SUPPLIER INVOICE NUMBER",
    date: "GRN DATE",
    grnNumber: "GRN NUMBER",
};

/**
 * Convert Excel serial date to ISO string (YYYY-MM-DD)
 */
export const excelDateToISO = (serial: any): string => {
    if (!serial || isNaN(Number(serial))) return new Date().toISOString().split('T')[0];
    const date = new Date((Number(serial) - 25569) * 86400 * 1000);
    return date.toISOString().split('T')[0];
};

/**
 * Export data to Excel
 */
export const exportToExcel = (data: VarianceData[], fileName: string) => {
    if (!data || data.length === 0) return;

    // 1. Transform data for display
    const formattedData = data.map(row => ({
        'Supplier': row.supplier,
        'Planned Allocation (%)': row.plannedAllocation,
        'Planned Quantity': row.plannedQuantity,
        'Planned Price': row.plannedPrice,
        'Actual Allocation (%)': row.actualAllocation,
        'Actual Quantity': row.actualQuantity,
        'Actual Price': row.actualPrice,
        'Variance (%)': row.variance,
        'Status': row.status === 'low' ? 'Healthy' : row.status === 'medium' ? 'Warning' : 'Critical'
    }));

    // 2. Calculate Totals
    const totalPlannedAllocation = data.reduce((sum, r) => sum + (r.plannedAllocation || 0), 0);
    const totalActualAllocation = data.reduce((sum, r) => sum + (r.actualAllocation || 0), 0);
    const totalVariance = totalPlannedAllocation - totalActualAllocation;

    const totals = {
        'Supplier': 'Total',
        'Planned Allocation (%)': Number(totalPlannedAllocation.toFixed(2)),
        'Planned Quantity': data.reduce((sum, r) => sum + (r.plannedQuantity || 0), 0),
        'Planned Price': Number(data.reduce((sum, r) => sum + (r.plannedPrice || 0), 0).toFixed(2)),
        'Actual Allocation (%)': Number(totalActualAllocation.toFixed(2)),
        'Actual Quantity': data.reduce((sum, r) => sum + (r.actualQuantity || 0), 0),
        'Actual Price': Number(data.reduce((sum, r) => sum + (r.actualPrice || 0), 0).toFixed(2)),
        'Variance (%)': Number(totalVariance.toFixed(2)),
        'Status': ''
    };

    // 3. Combine data and totals
    const finalData = [...formattedData, totals];

    const worksheet = XLSX.utils.json_to_sheet(finalData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

/**
 * Parse Excel file and map to internal data structure
 */
export const parseExcelAndMap = async (file: File): Promise<{
    sob: any[];
    grn: any[];
}> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });

                const result: { sob: any[], grn: any[] } = { sob: [], grn: [] };

                workbook.SheetNames.forEach(name => {
                    const lowerName = name.toLowerCase().trim();
                    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[name]);

                    if (lowerName.includes('sob')) {
                        result.sob = sheetData;
                    } else if (lowerName.includes('grn')) {
                        result.grn = sheetData;
                    }
                });

                // Fallback: If sheets not found by name, try detecting by columns in all sheets
                if (result.sob.length === 0 || result.grn.length === 0) {
                    workbook.SheetNames.forEach(name => {
                        const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[name]);
                        if (sheetData.length > 0) {
                            const firstRow: any = sheetData[0];
                            if (!result.sob.length && (firstRow[SOB_MAPPING.itemCode] || firstRow["Quota"])) {
                                result.sob = sheetData;
                            } else if (!result.grn.length && (firstRow[GRN_MAPPING.itemCode] || firstRow["RECEIVED QTY"])) {
                                result.grn = sheetData;
                            }
                        }
                    });
                }

                resolve(result);
            } catch (error) {
                reject(error);
            }
        };
        reader.onerror = (error) => reject(error);
        reader.readAsArrayBuffer(file);
    });
};

/**
 * Process raw sheet data into a map grouped by Material Code
 */
export const mapToVarianceDataGroups = (sobData: any[], grnData: any[]): Record<string, VarianceData[]> => {
    const result: Record<string, VarianceData[]> = {};

    // Find all unique material codes in the SOB sheet
    const materialCodes = Array.from(new Set(sobData.map(row => row[SOB_MAPPING.itemCode]?.toString().trim())));

    materialCodes.forEach(materialCode => {
        if (!materialCode) return;

        // Filter SOB rows for this specific material
        const materialSobRows = sobData.filter(row => row[SOB_MAPPING.itemCode]?.toString().trim() === materialCode);

        // Filter GRN rows for this specific material
        const materialGrnRows = grnData.filter(row => row[GRN_MAPPING.itemCode]?.toString().trim() === materialCode);

        // Group GRN data for this material by supplier
        const actualsMap = materialGrnRows.reduce((acc: any, row: any) => {
            const supplier = row[GRN_MAPPING.supplier];
            if (!acc[supplier]) {
                acc[supplier] = { quantity: 0, price: 0, count: 0 };
            }
            acc[supplier].quantity += Number(row[GRN_MAPPING.actualQuantity]) || 0;
            acc[supplier].price += Number(row[GRN_MAPPING.plannedPrice]) || 0;
            acc[supplier].count += 1;
            return acc;
        }, {});

        // Calculate total quantity received for this material to determine actual %
        const totalActualQuantity = Object.values(actualsMap).reduce((sum: number, s: any) => sum + s.quantity, 0);

        // Map SOB rows to VarianceData
        result[materialCode] = materialSobRows.map((row: any, index: number) => {
            const supplier = row[SOB_MAPPING.supplier];
            const plannedAllocation = Number(row[SOB_MAPPING.plannedAllocation]) || 0;
            const actual = actualsMap[supplier] || { quantity: 0, price: 0, count: 0 };

            const actualQuantity = actual.quantity;
            const actualAllocation = totalActualQuantity > 0
                ? Math.round((actualQuantity / totalActualQuantity) * 100)
                : 0;

            const avgPrice = actual.count > 0 ? (actual.price / actual.count) : (Number(row[GRN_MAPPING.plannedPrice]) || 0);

            const { status } = calculateVarianceAndStatus(plannedAllocation, actualAllocation);

            return {
                id: `${materialCode}-${index + 1}`,
                supplier: supplier,
                plannedAllocation,
                plannedQuantity: 0, // Will be calculated by UI or total expectations
                plannedPrice: Number(avgPrice.toFixed(2)),
                actualAllocation,
                actualQuantity,
                actualPrice: Number(avgPrice.toFixed(2)),
                variance: Number((plannedAllocation - actualAllocation).toFixed(2)),
                status,
            };
        });
    });

    return result;
};
