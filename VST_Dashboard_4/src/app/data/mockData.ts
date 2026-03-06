// Mock data for VST Tractors Dashboard

export interface KPIData {
  label: string;
  value: string;
  change?: string;
  status?: 'success' | 'warning' | 'danger';
}

export interface TrendData {
  date: string;
  planned: number;
  actual: number;
}

export interface VarianceData {
  id: string;
  supplier: string;
  plannedAllocation: number;
  plannedQuantity: number;
  plannedPrice: number;
  actualAllocation: number;
  actualQuantity: number;
  actualPrice: number;
  variance: number;
  status: 'high' | 'medium' | 'low';
  isEditing?: boolean;
}

export interface EmailData {
  id: string;
  subject: string;
  recipient: string;
  date: string;
  status: 'sent' | 'pending' | 'failed';
  item: string;
}

export const emailData: EmailData[] = [
  {
    id: '1',
    subject: 'SOB Alert: High Deviation in Axel Gear CT85',
    recipient: 'procurement@vsttractors.com',
    date: '2026-03-05 10:30 AM',
    status: 'sent',
    item: 'Item 1',
  },
  {
    id: '2',
    subject: 'Monthly Performance Summary - February 2026',
    recipient: 'management@vsttractors.com',
    date: '2026-03-01 09:00 AM',
    status: 'sent',
    item: 'Item 2',
  },
  {
    id: '3',
    subject: 'Action Required: Supplier Quota Update',
    recipient: 'logistics@vsttractors.com',
    date: '2026-03-05 11:45 AM',
    status: 'pending',
    item: 'Item 1',
  },
  {
    id: '4',
    subject: 'System Alert: Data Import Failure',
    recipient: 'it-support@vsttractors.com',
    date: '2026-03-04 04:20 PM',
    status: 'failed',
    item: 'Item 2',
  },
];

export interface NotificationData {
  id: '1' | '2' | '3' | '4' | '5';
  message: string;
  severity: 'high' | 'medium' | 'low';
  timestamp: string;
  read: boolean;
}

export const notificationData: NotificationData[] = [
  {
    id: '1',
    message: 'High deviation detected in Axel Gear CT85 allocation for Shimpukade Metallguss.',
    severity: 'high',
    timestamp: '2 hours ago',
    read: false,
  },
  {
    id: '2',
    message: 'New GRN data imported successfully for 45 invoices.',
    severity: 'low',
    timestamp: '5 hours ago',
    read: true,
  },
  {
    id: '3',
    message: 'Pending approval for allocation change in Fly Wheel category.',
    severity: 'medium',
    timestamp: 'Yesterday',
    read: false,
  },
  {
    id: '4',
    message: 'Price variance alert: Damodar Engineering Works exceeds 5% threshold.',
    severity: 'high',
    timestamp: '2 days ago',
    read: true,
  },
  {
    id: '5',
    message: 'System maintenance scheduled for Sunday at 10:00 PM.',
    severity: 'low',
    timestamp: '3 days ago',
    read: true,
  },
];

export interface SupplierDetailData {
  name: string;
  stockoutDays: number;
  onTimeDelivery: number;
  averageDelay: number;
  currentStock: number;
  supplierPerformance: number;
  allocationCompliance: number;
  status: 'high' | 'medium' | 'low';
  contactPerson: string;
  email: string;
  phone: string;
}

export const supplierDetailData: SupplierDetailData[] = [
  {
    name: "Shimpukade Metallguss Pvt Ltd.",
    stockoutDays: 2,
    onTimeDelivery: 95,
    averageDelay: 1.5,
    currentStock: 450,
    supplierPerformance: 88,
    allocationCompliance: 92,
    status: 'low',
    contactPerson: "Mr. Rajeev Shimpukade",
    email: "rajeev@shimpukade.com",
    phone: "+91 98220 12345",
  },
  {
    name: "V.R. Foundries",
    stockoutDays: 5,
    onTimeDelivery: 82,
    averageDelay: 3.2,
    currentStock: 120,
    supplierPerformance: 74,
    allocationCompliance: 85,
    status: 'medium',
    contactPerson: "Mr. Venkatesh Rao",
    email: "contact@vrfoundries.com",
    phone: "+91 98450 54321",
  },
  {
    name: "Synnova Gears & Transmissions",
    stockoutDays: 0,
    onTimeDelivery: 98,
    averageDelay: 0.5,
    currentStock: 800,
    supplierPerformance: 96,
    allocationCompliance: 98,
    status: 'low',
    contactPerson: "Ms. Anita Desai",
    email: "anita.desai@synnova.com",
    phone: "+91 99000 11223",
  },
  {
    name: "Damodar Engineering Works",
    stockoutDays: 8,
    onTimeDelivery: 70,
    averageDelay: 5.8,
    currentStock: 50,
    supplierPerformance: 62,
    allocationCompliance: 75,
    status: 'high',
    contactPerson: "Mr. Suresh Damodar",
    email: "suresh@damodareng.com",
    phone: "+91 91234 56789",
  },
  {
    name: "GNA AXLES LIMITED",
    stockoutDays: 1,
    onTimeDelivery: 99,
    averageDelay: 0.2,
    currentStock: 1200,
    supplierPerformance: 94,
    allocationCompliance: 96,
    status: 'low',
    contactPerson: "Mr. Jaswinder Singh",
    email: "jsingh@gnaaxles.com",
    phone: "+91 98765 43210",
  },
];

export interface InvoiceData {
  id: string;
  invoiceNumber: string;
  supplierName: string;
  date: string;
  quantityReceived: number;
  expectedQuantity: number;
  plannedPrice: number;
  actualPrice: number;
  status: 'received' | 'pending' | 'partial' | 'error';
  batchNumber: string;
  receivedBy: string;
  notes?: string;
  materialNo: string;
  materialDesc?: string;
}

export const kpiDataItem1: KPIData[] = [
  { label: 'Actual SOB %', value: '78%', change: '-7%', status: 'warning' },
  { label: 'Variance %', value: '-7%', status: 'danger' },
  { label: 'Alerts Active', value: '3', status: 'warning' },
];

export const kpiDataItem2: KPIData[] = [
  { label: 'Actual SOB %', value: '92%', change: '+2%', status: 'success' },
  { label: 'Variance %', value: '+2%', status: 'success' },
  { label: 'Alerts Active', value: '0', status: 'success' },
];

export const trendDataItem1: TrendData[] = [
  { date: '2026-02-16', planned: 85, actual: 72 },
  { date: '2026-02-17', planned: 85, actual: 74 },
  { date: '2026-02-18', planned: 85, actual: 76 },
  { date: '2026-02-19', planned: 85, actual: 75 },
  { date: '2026-02-20', planned: 85, actual: 77 },
  { date: '2026-02-21', planned: 85, actual: 78 },
  { date: '2026-02-22', planned: 85, actual: 78 },
  { date: '2026-02-23', planned: 85, actual: 78 },
];

export const trendDataItem2: TrendData[] = [
  { date: '2026-02-16', planned: 90, actual: 88 },
  { date: '2026-02-17', planned: 90, actual: 89 },
  { date: '2026-02-18', planned: 90, actual: 90 },
  { date: '2026-02-19', planned: 90, actual: 91 },
  { date: '2026-02-20', planned: 90, actual: 92 },
  { date: '2026-02-21', planned: 90, actual: 92 },
  { date: '2026-02-22', planned: 90, actual: 92 },
  { date: '2026-02-23', planned: 90, actual: 92 },
];

import { invoiceData as realInvoiceData, varianceDataMap as realVarianceDataMap } from './clientData';

export const invoiceData: InvoiceData[] = realInvoiceData.map(inv => ({
  ...inv,
  status: (inv.quantityReceived === inv.expectedQuantity) ? 'received' :
    (inv.quantityReceived === 0) ? 'pending' :
      (inv.quantityReceived > inv.expectedQuantity) ? 'error' : 'partial'
})) as InvoiceData[];

export const varianceDataItem1: VarianceData[] = (realVarianceDataMap['ACA11C00210A0'] || []) as VarianceData[];
export const varianceDataItem2: VarianceData[] = (realVarianceDataMap['ACA01C00440A0'] || []) as VarianceData[];
export const varianceDataItem3: VarianceData[] = (realVarianceDataMap['ACA11C00230A1'] || []) as VarianceData[];
export const varianceDataItem4: VarianceData[] = (realVarianceDataMap['ACA01C00430A0'] || []) as VarianceData[];
export const varianceDataItem5: VarianceData[] = (realVarianceDataMap['TRA90C32520A1'] || []) as VarianceData[];
