import React, { createContext, useContext, useState } from 'react';
import { toast } from 'sonner';
import { type VarianceData } from '../data/mockData';
import { parseExcelAndMap, mapToVarianceDataGroups, exportToExcel } from '../utils/excelUtils';
import { format } from 'date-fns';
import { useAppData } from './AppDataContext';

interface DataContextType {
    customDataMap: Record<string, VarianceData[]> | null;
    pendingDataMap: Record<string, VarianceData[]> | null;
    pendingRaw: { sob: any[], grn: any[] } | null;
    importFileName: string;
    isReviewOpen: boolean;
    setIsReviewOpen: (open: boolean) => void;
    handleImport: (file: File) => Promise<void>;
    confirmImport: () => void;
    clearData: () => void;
    exportData: (data: VarianceData[], name: string) => void;
    updateCustomDataMapForCategory: (category: string, data: VarianceData[]) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { importSystemData, resetAllData } = useAppData();
    const [customDataMap, setCustomDataMap] = useState<Record<string, VarianceData[]> | null>(null);
    const [pendingDataMap, setPendingDataMap] = useState<Record<string, VarianceData[]> | null>(null);
    const [pendingRaw, setPendingRaw] = useState<{ sob: any[], grn: any[] } | null>(null);
    const [importFileName, setImportFileName] = useState("");
    const [isReviewOpen, setIsReviewOpen] = useState(false);

    const handleImport = async (file: File) => {
        try {
            toast.loading("Reading excel file...");
            const { sob, grn } = await parseExcelAndMap(file);
            const mappedGroups = mapToVarianceDataGroups(sob, grn);

            setPendingDataMap(mappedGroups);
            setPendingRaw({ sob, grn });
            setImportFileName(file.name);
            setIsReviewOpen(true);

            toast.dismiss();
            toast.success("File parsed successfully. Review your data.");
        } catch (error) {
            toast.dismiss();
            toast.error("Failed to parse excel file.");
            console.error(error);
        }
    };

    const confirmImport = () => {
        if (pendingRaw) {
            importSystemData(pendingRaw.sob, pendingRaw.grn);
            setCustomDataMap(pendingDataMap);
            setIsReviewOpen(false);
            setPendingRaw(null);
            toast.success("Data integrated into system storage!");
        }
    };

    const clearData = () => {
        resetAllData();
        setCustomDataMap(null);
        setPendingDataMap(null);
        setImportFileName("");
    };

    const exportData = (data: VarianceData[], name: string) => {
        exportToExcel(data, `SOB_Deviation_${name}_${format(new Date(), 'yyyy-MM-dd')}`);
        toast.success("Export started...");
    };

    const updateCustomDataMapForCategory = (category: string, data: VarianceData[]) => {
        if (customDataMap) {
            setCustomDataMap({ ...customDataMap, [category]: data });
        }
    };

    return (
        <DataContext.Provider value={{
            customDataMap,
            pendingDataMap,
            pendingRaw,
            importFileName,
            isReviewOpen,
            setIsReviewOpen,
            handleImport,
            confirmImport,
            clearData,
            exportData,
            updateCustomDataMapForCategory
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
