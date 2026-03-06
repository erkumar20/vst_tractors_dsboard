import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { VarianceData } from "../data/mockData";
import { FileText, CheckCircle2, AlertTriangle } from "lucide-react";

interface ImportReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    fileName: string;
    data: Record<string, VarianceData[]>;
}

export default function ImportReviewModal({
    isOpen,
    onClose,
    onConfirm,
    fileName,
    data,
}: ImportReviewModalProps) {
    const itemCodes = Object.keys(data);
    const totalSuppliers = itemCodes.reduce((acc, code) => acc + data[code].length, 0);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-[#006847]" />
                        Review Imported Data
                    </DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto py-4 space-y-6">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">File Name</p>
                            <p className="text-sm font-semibold truncate mt-1">{fileName}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Items Found</p>
                            <p className="text-xl font-bold text-[#006847] mt-1">{itemCodes.length}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Total Suppliers</p>
                            <p className="text-xl font-bold text-[#006847] mt-1">{totalSuppliers}</p>
                        </div>
                    </div>

                    {/* Detailed Preview */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-gray-900 border-l-4 border-[#006847] pl-3">Mapped Data Preview</h3>

                        <div className="space-y-6">
                            {itemCodes.map((code) => (
                                <div key={code} className="border border-gray-200 rounded-lg overflow-hidden">
                                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex justify-between items-center">
                                        <span className="font-bold text-sm text-gray-700">{code}</span>
                                        <Badge variant="outline" className="bg-white">{data[code].length} Suppliers</Badge>
                                    </div>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="text-xs">Supplier</TableHead>
                                                <TableHead className="text-xs text-center">Planned %</TableHead>
                                                <TableHead className="text-xs text-center">Actual %</TableHead>
                                                <TableHead className="text-xs text-center">Qty</TableHead>
                                                <TableHead className="text-xs text-center">Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {data[code].slice(0, 3).map((row, i) => (
                                                <TableRow key={i}>
                                                    <TableCell className="text-xs font-medium py-2">{row.supplier}</TableCell>
                                                    <TableCell className="text-xs text-center py-2">{row.plannedAllocation}%</TableCell>
                                                    <TableCell className="text-xs text-center py-2">{row.actualAllocation}%</TableCell>
                                                    <TableCell className="text-xs text-center py-2">{row.actualQuantity}</TableCell>
                                                    <TableCell className="text-xs text-center py-2">
                                                        <span className={`inline-block w-2 h-2 rounded-full mr-2 ${row.status === 'high' ? 'bg-red-500' : row.status === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                                                            }`}></span>
                                                        {row.status}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                            {data[code].length > 3 && (
                                                <TableRow>
                                                    <TableCell colSpan={5} className="text-[10px] text-center text-gray-400 italic">
                                                        + {data[code].length - 3} more suppliers...
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex gap-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0" />
                        <p className="text-xs text-yellow-700 leading-relaxed">
                            Applying this data will override the current dashboard view for the listed items.
                            Items not present in the Excel file will retain their current/mock data.
                        </p>
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="outline" onClick={onClose} className="border-gray-300">
                        Cancel
                    </Button>
                    <Button onClick={onConfirm} className="bg-[#006847] hover:bg-[#005038] gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Apply & Update Dashboard
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
