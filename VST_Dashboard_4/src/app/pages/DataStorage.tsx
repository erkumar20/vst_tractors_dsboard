import { useRef } from "react";
import { Button } from "../components/ui/button";
import {
    Upload,
    Download,
    FileSearch,
    RefreshCcw,
    Database,
    FileText,
    CheckCircle2,
    HardDrive
} from "lucide-react";
import { useData } from "../context/DataContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { toast } from "sonner";
import ImportReviewModal from "../components/ImportReviewModal";

export default function DataStorage() {
    const {
        handleImport,
        clearData,
        pendingDataMap,
        isReviewOpen,
        setIsReviewOpen,
        importFileName,
        confirmImport,
        customDataMap
    } = useData();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const hasImportedData = customDataMap !== null;
    const itemsCount = customDataMap ? Object.keys(customDataMap).length : 0;

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <HardDrive className="w-8 h-8 text-[#006847]" />
                    Data Storage
                </h1>
                <p className="text-gray-500">Manage Excel imports, data persistence, and system exports.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Import Action */}
                <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Upload className="w-5 h-5 text-green-600" />
                            Import Data
                        </CardTitle>
                        <CardDescription>Upload SOB, GRN, or related documents (Excel, CSV, PDF, DOC).</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept=".xlsx, .xls, .csv, .pdf, .doc, .docx"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;

                                const ext = file.name.split('.').pop()?.toLowerCase();
                                if (['pdf', 'doc', 'docx'].includes(ext || '')) {
                                    toast.info(`${file.name} received. This document type will be processed by VarnuevedAI (Backend required).`, {
                                        duration: 5000
                                    });
                                } else {
                                    handleImport(file);
                                }
                            }}
                        />
                        <div className="p-8 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/50 flex flex-col items-center justify-center text-center">
                            <div className="flex gap-2 mb-3">
                                <FileText className="w-8 h-8 text-blue-400" />
                                <Upload className="w-10 h-10 text-gray-300" />
                                <Database className="w-8 h-8 text-green-400" />
                            </div>
                            <p className="text-sm text-gray-500 mb-4">Supported: Excel, CSV, PDF, DOC</p>
                            <Button
                                onClick={() => fileInputRef.current?.click()}
                                className="bg-[#006847] hover:bg-[#005038]"
                            >
                                Choose File
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Status & Review */}
                <Card className="border-gray-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <FileSearch className="w-5 h-5 text-amber-500" />
                            Storage Status
                        </CardTitle>
                        <CardDescription>Current state of your imported material data.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                <span className="text-sm text-gray-600">Imported Data</span>
                                <span className={`text-sm font-bold ${hasImportedData ? 'text-green-600' : 'text-gray-400'}`}>
                                    {hasImportedData ? 'Active' : 'No Data'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                <span className="text-sm text-gray-600">Managed Items</span>
                                <span className="text-sm font-bold text-gray-900">{itemsCount} Items</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                <span className="text-sm text-gray-600">Pending Review</span>
                                <span className={`text-sm font-bold ${pendingDataMap ? 'text-amber-500' : 'text-gray-400'}`}>
                                    {pendingDataMap ? 'Ready' : 'None'}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <Button
                                variant="outline"
                                className="w-full justify-start gap-3 border-gray-200 h-11"
                                disabled={!pendingDataMap}
                                onClick={() => setIsReviewOpen(true)}
                            >
                                <FileSearch className={`w-4 h-4 ${pendingDataMap ? 'text-amber-500' : 'text-gray-300'}`} />
                                Analyze Pending Changes
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full justify-start gap-3 border-gray-200 h-11 text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={clearData}
                            >
                                <RefreshCcw className="w-4 h-4" />
                                Flush Storage & Reset
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Export Section */}
            <Card className="border-gray-200 shadow-sm bg-gradient-to-r from-[#006847]/5 to-transparent">
                <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                            <Download className="w-6 h-6 text-[#006847]" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">System Export</h3>
                            <p className="text-sm text-gray-500">Download the current dashboard state as a processed Excel report.</p>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        className="border-[#006847] text-[#006847] hover:bg-[#006847] hover:text-white transition-all px-8 h-12"
                        onClick={() => toast.info("Go to Dashboard to export specific item data.")}
                    >
                        Go to Export Table
                    </Button>
                </CardContent>
            </Card>

            {/* Review Modal */}
            {pendingDataMap && (
                <ImportReviewModal
                    isOpen={isReviewOpen}
                    onClose={() => setIsReviewOpen(false)}
                    onConfirm={confirmImport}
                    fileName={importFileName}
                    data={pendingDataMap}
                />
            )}
        </div>
    );
}
