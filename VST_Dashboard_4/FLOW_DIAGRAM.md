# VST Tractors Dashboard - Application Flow Diagram

## 1. Application Entry & Authentication

```
┌─────────────────────────────────────────────────────────────────┐
│                         START APPLICATION                        │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                         LOGIN PAGE                               │
│  - Username/Email Input                                          │
│  - Password Input                                                │
│  - Login Button                                                  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                     [Authentication Success]
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      MAIN DASHBOARD LAYOUT                       │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  TOP HEADER                                                 │ │
│  │  - VST Logo                                                 │ │
│  │  - Category Dropdown (SOB - Item 1 / SOB - Item 2)        │ │
│  │  - User Profile                                            │ │
│  └────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  LEFT SIDEBAR NAVIGATION                                    │ │
│  │  - Dashboard (with submenu)                                │ │
│  │  - Email                                                    │ │
│  │  - Notification                                             │ │
│  │  - Suppliers                                                │ │
│  │  - Item Master                                              │ │
│  │  - AI Assistant (menu item)                                │ │
│  └────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  CONTENT AREA (Dynamic based on navigation)                │ │
│  └────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  FLOATING AI ASSISTANT BUTTON (bottom-right)               │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Dashboard Section Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    DASHBOARD (Main Section)                      │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    [Has Two Tabs]
                              ↓
        ┌────────────────────┴────────────────────┐
        ↓                                         ↓
┌──────────────────┐                    ┌──────────────────┐
│   ITEM 1 TAB     │                    │   ITEM 2 TAB     │
│   (Default)      │                    │                  │
└──────────────────┘                    └──────────────────┘
        ↓                                         ↓
┌─────────────────────────────────────────────────────────────────┐
│              SOB DASHBOARD (Supply on Budget)                    │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  SUMMARY CARDS (Top Row)                                   │ │
│  │  - Total Planned Allocation                                │ │
│  │  - Total Actual Allocation                                 │ │
│  │  - Total Variance                                          │ │
│  │  - Alert Count                                             │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  SOB DATA TABLE                                            │ │
│  │  ┌──────────────────────────────────────────────────────┐  │ │
│  │  │ Columns:                                             │  │ │
│  │  │ - Supplier                                           │  │ │
│  │  │ - Planned Allocation                                 │  │ │
│  │  │ - Planned Quantity                                   │  │ │
│  │  │ - Actual Allocation [$]                              │  │ │
│  │  │ - Actual Quantity [CLICKABLE] ←────────┐             │  │ │
│  │  │ - Variance (%)                         │             │  │ │
│  │  │ - Status Badge (Alert/Warning/Healthy) │             │  │ │
│  │  └──────────────────────────────────────────────────────┘  │ │
│  │                                            │                │ │
│  │  VARIANCE CALCULATION LOGIC:               │                │ │
│  │  • Alert: Actual > Planned (Red Badge)     │                │ │
│  │  • Warning: Actual 90-100% of Planned      │                │ │
│  │  • Healthy: Actual < 90% of Planned        │                │ │
│  └────────────────────────────────────────────┼────────────────┘ │
│                                               │                  │
│  ┌────────────────────────────────────────────┼────────────────┐ │
│  │  CHARTS & VISUALIZATIONS                   │                │ │
│  │  - Trend Analysis Chart                    │                │ │
│  │  - Comparison Charts                       │                │ │
│  │  - Alert Indicators                        │                │ │
│  └────────────────────────────────────────────┼────────────────┘ │
└───────────────────────────────────────────────┼──────────────────┘
                                                │
                                                ↓
                                    [User Clicks Actual Quantity]
                                                ↓
┌─────────────────────────────────────────────────────────────────┐
│                     INVOICE RECORDS PAGE                         │
│  (Detailed Invoice Screen)                                       │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  COMPACT CALENDAR BAR                                      │ │
│  │  - Shows days with received items highlighted              │ │
│  │  - Visual indicator of delivery pattern                    │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  INVOICE RECORDS TABLE                                     │ │
│  │  ┌──────────────────────────────────────────────────────┐  │ │
│  │  │ Columns:                                             │  │ │
│  │  │ - Invoice Number (Auto-generated: INV-YYYYMMDD-XXX)  │  │ │
│  │  │ - Date                                               │  │ │
│  │  │ - Supplier Name                                      │  │ │
│  │  │ - Item Description                                   │  │ │
│  │  │ - Quantity Received                                  │  │ │
│  │  │ - Unit Price                                         │  │ │
│  │  │ - Total Amount                                       │  │ │
│  │  │ - Status (Verified/Pending/Error)                    │  │ │
│  │  └──────────────────────────────────────────────────────┘  │ │
│  │                                                            │ │
│  │  ERROR STATUS LOGIC:                                       │ │
│  │  • Shows "Error" badge for problematic invoices            │ │
│  │  • Visual indicator (red) for issues                       │ │
│  │                                                            │ │
│  │  ┌──────────────────────────────────────────────────────┐  │ │
│  │  │ TOTAL ROW (Bottom of table)                          │  │ │
│  │  │ - Summation of all quantities and amounts            │  │ │
│  │  └──────────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  TREND ANALYSIS CHART (Below Table)                        │ │
│  │  - Line chart showing daily items received vs expected     │ │
│  │  - Uses Recharts library                                   │ │
│  │  - Visual trend analysis over time                         │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Suppliers Page Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        SUPPLIERS PAGE                            │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  PAGE HEADER                                               │ │
│  │  - Title: "Suppliers"                                      │ │
│  │  - Description                                             │ │
│  │  - [+ Add Supplier] Button (VST Green)                     │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  SUPPLIERS TABLE                                           │ │
│  │  ┌──────────────────────────────────────────────────────┐  │ │
│  │  │ Columns:                                             │  │ │
│  │  │ - [✓] Checkbox (Select All in Header)                │  │ │
│  │  │ - Supplier Name                                      │  │ │
│  │  │ - Contact Person                                     │  │ │
│  │  │ - Email                                              │  │ │
│  │  │ - Phone                                              │  │ │
│  │  │ - Status (Active/Inactive Badge)                     │  │ │
│  │  │ - Actions (Edit/Delete Icons)                        │  │ │
│  │  └──────────────────────────────────────────────────────┘  │ │
│  │                                                            │ │
│  │  INTERACTIONS:                                             │ │
│  │  • Header Checkbox → Select/Deselect All                  │ │
│  │  • Row Checkbox → Select Individual Supplier              │ │
│  │  • Edit Button → Opens edit modal/form                    │ │
│  │  • Delete Button → Confirmation & deletion                │ │
│  │  • Add Supplier Button → Opens add form                   │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. Item Master Page Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                       ITEM MASTER PAGE                           │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  PAGE HEADER                                               │ │
│  │  - Title: "Item Master"                                    │ │
│  │  - Description                                             │ │
│  │  - [+ Add Item] Button (VST Green)                         │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  ITEMS TABLE                                               │ │
│  │  ┌──────────────────────────────────────────────────────┐  │ │
│  │  │ Columns:                                             │  │ │
│  │  │ - [✓] Checkbox (Select All in Header)                │  │ │
│  │  │ - Item Code (e.g., ITM-001)                          │  │ │
│  │  │ - Item Name                                          │  │ │
│  │  │ - Category                                           │  │ │
│  │  │ - Unit (PCS)                                         │  │ │
│  │  │ - Reorder Level                                      │  │ │
│  │  │ - Current Stock                                      │  │ │
│  │  │ - Status (Available/Low Stock/Critical Badge)        │  │ │
│  │  │ - Actions (Edit/Delete Icons)                        │  │ │
│  │  └──────────────────────────────────────────────────────┘  │ │
│  │                                                            │ │
│  │  INTERACTIONS:                                             │ │
│  │  • Header Checkbox → Select/Deselect All                  │ │
│  │  • Row Checkbox → Select Individual Item                  │ │
│  │  • Edit Button → Opens edit modal/form                    │ │
│  │  • Delete Button → Confirmation & deletion                │ │
│  │  • Add Item Button → Opens add form                       │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5. AI Assistant Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      AI ASSISTANT ACCESS                         │
│                                                                  │
│         Two ways to access AI Assistant:                         │
│                                                                  │
│  ┌──────────────────────┐       ┌──────────────────────┐        │
│  │  NAVIGATION MENU     │       │  FLOATING BUTTON     │        │
│  │  - Left Sidebar      │  OR   │  - Bottom-right      │        │
│  │  - "AI Assistant"    │       │  - Always visible    │        │
│  │    menu item         │       │  - Sticky position   │        │
│  └──────────────────────┘       └──────────────────────┘        │
│              ↓                            ↓                      │
│              └────────────┬───────────────┘                      │
│                           ↓                                      │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              AI ASSISTANT MODAL/PANEL                      │ │
│  │  ┌──────────────────────────────────────────────────────┐  │ │
│  │  │  - Chat Interface                                    │  │ │
│  │  │  - Input Field                                       │  │ │
│  │  │  - Send Button                                       │  │ │
│  │  │  - Suggested Queries                                 │  │ │
│  │  │  - Close Button                                      │  │ │
│  │  └──────────────────────────────────────────────────────┘  │ │
│  │                                                            │ │
│  │  CAPABILITIES:                                             │ │
│  │  • Answer questions about dashboard data                  │ │
│  │  • Navigate to different sections                         │ │
│  │  • Provide insights and recommendations                   │ │
│  │  • Help with supplier/item queries                        │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## 6. Header Category Dropdown Synchronization

```
┌─────────────────────────────────────────────────────────────────┐
│                  CATEGORY DROPDOWN SYNC FLOW                     │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  TOP HEADER - CATEGORY DROPDOWN                            │ │
│  │  - SOB - Item 1 (default)                                  │ │
│  │  - SOB - Item 2                                            │ │
│  └────────────────────────────────────────────────────────────┘ │
│                           ↓                                      │
│              [User selects different item]                       │
│                           ↓                                      │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  SYNCHRONIZATION HAPPENS:                                  │ │
│  │  1. Header dropdown updates to selected item               │ │
│  │  2. Dashboard active tab changes                           │ │
│  │  3. SOB table data refreshes for selected item             │ │
│  │  4. Charts update with new item data                       │ │
│  │  5. All metrics recalculate                                │ │
│  └────────────────────────────────────────────────────────────┘ │
│                           ↓                                      │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  UPDATED DASHBOARD VIEW                                    │ │
│  │  - Shows data for newly selected item                      │ │
│  │  - All components in sync                                  │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## 7. Navigation Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                     MAIN NAVIGATION TREE                         │
│                                                                  │
│  VST Tractors Dashboard                                          │
│  │                                                               │
│  ├─ 🏠 Dashboard (Expandable)                                    │
│  │   ├─ Item 1 (Default Tab)                                    │
│  │   │   └─ SOB Dashboard                                       │
│  │   │       └─ Invoice Records (via Actual Quantity click)     │
│  │   └─ Item 2 (Second Tab)                                     │
│  │       └─ SOB Dashboard                                       │
│  │           └─ Invoice Records (via Actual Quantity click)     │
│  │                                                               │
│  ├─ 📧 Email                                                     │
│  │   └─ (Email management interface)                            │
│  │                                                               │
│  ├─ 🔔 Notification                                              │
│  │   └─ (Notification center)                                   │
│  │                                                               │
│  ├─ 🏢 Suppliers                                                 │
│  │   └─ Supplier Management Table                               │
│  │       ├─ Add Supplier                                        │
│  │       ├─ Edit Supplier                                       │
│  │       └─ Delete Supplier                                     │
│  │                                                               │
│  ├─ 📦 Item Master                                               │
│  │   └─ Item Management Table                                   │
│  │       ├─ Add Item                                            │
│  │       ├─ Edit Item                                           │
│  │       └─ Delete Item                                         │
│  │                                                               │
│  └─ 🤖 AI Assistant                                              │
│      └─ Chat Interface & Help                                   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 8. Data Flow & State Management

```
┌─────────────────────────────────────────────────────────────────┐
│                        DATA FLOW DIAGRAM                         │
│                                                                  │
│  ┌────────────────┐                                              │
│  │  USER INPUT    │                                              │
│  │  & ACTIONS     │                                              │
│  └────────┬───────┘                                              │
│           ↓                                                      │
│  ┌─────────────────────────────────────────┐                    │
│  │  STATE MANAGEMENT                       │                    │
│  │  - Selected Item (Item 1 / Item 2)      │                    │
│  │  - Active Tab                           │                    │
│  │  - Selected Checkboxes                  │                    │
│  │  - Modal States                         │                    │
│  │  - Form Data                            │                    │
│  └─────────────────┬───────────────────────┘                    │
│                    ↓                                             │
│  ┌─────────────────────────────────────────┐                    │
│  │  DATA PROCESSING                        │                    │
│  │  - Variance Calculation                 │                    │
│  │  - Status Determination                 │                    │
│  │  - Invoice Number Generation            │                    │
│  │  - Totals Calculation                   │                    │
│  └─────────────────┬───────────────────────┘                    │
│                    ↓                                             │
│  ┌─────────────────────────────────────────┐                    │
│  │  UI UPDATES                             │                    │
│  │  - Table Refresh                        │                    │
│  │  - Chart Updates                        │                    │
│  │  - Badge Colors                         │                    │
│  │  - Toast Notifications                  │                    │
│  └─────────────────────────────────────────┘                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 9. Interactive Elements & User Feedback

```
┌─────────────────────────────────────────────────────────────────┐
│                    INTERACTIVE ELEMENTS                          │
│                                                                  │
│  BUTTONS:                                                        │
│  • Add Supplier/Item → Opens form modal → Toast notification     │
│  • Edit → Loads data → Opens edit form → Toast on save          │
│  • Delete → Confirmation dialog → Action → Toast notification    │
│  • Login → Validation → Navigation to dashboard                 │
│                                                                  │
│  LINKS:                                                          │
│  • Navigation menu items → Route change                          │
│  • Actual Quantity cells → Navigate to Invoice Records          │
│  • Logo → Return to dashboard home                              │
│                                                                  │
│  CARDS:                                                          │
│  • Summary cards → Clickable for detailed view                  │
│  • Hover states → Visual feedback (shadow, border)              │
│                                                                  │
│  CHECKBOXES:                                                     │
│  • Header checkbox → Select/deselect all rows                   │
│  • Row checkbox → Individual selection                          │
│  • Visual state changes (checked/unchecked)                     │
│                                                                  │
│  DROPDOWNS:                                                      │
│  • Category dropdown → Item selection → Full sync               │
│  • Hover & active states                                        │
│                                                                  │
│  MODALS:                                                         │
│  • AI Assistant modal → Opens/closes with animation             │
│  • Form modals → Data entry → Submit/Cancel                     │
│  • Confirmation dialogs → Yes/No actions                        │
│                                                                  │
│  FEEDBACK:                                                       │
│  • Toast notifications (Success, Info, Error)                   │
│  • Loading states                                               │
│  • Hover effects on all interactive elements                    │
│  • Badge colors for status indication                           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 10. Complete User Journey Example

```
┌─────────────────────────────────────────────────────────────────┐
│              EXAMPLE: Complete User Journey                      │
│                                                                  │
│  1. User visits application                                      │
│     ↓                                                            │
│  2. Login Page → Enter credentials → Click Login                │
│     ↓                                                            │
│  3. Dashboard loads (Item 1 - SOB Dashboard by default)         │
│     ↓                                                            │
│  4. User views summary cards & SOB table                        │
│     ↓                                                            │
│  5. User notices high variance for "ABC Components Ltd"         │
│     ↓                                                            │
│  6. User clicks on Actual Quantity cell (120)                   │
│     ↓                                                            │
│  7. Navigation to Invoice Records page                          │
│     ↓                                                            │
│  8. User sees detailed invoices with:                           │
│     - Compact calendar showing delivery dates                   │
│     - Invoice table with all records                            │
│     - Total row showing summations                              │
│     - Trend analysis chart                                      │
│     ↓                                                            │
│  9. User identifies an error status invoice                     │
│     ↓                                                            │
│  10. User clicks back to Dashboard                              │
│     ↓                                                            │
│  11. User switches category dropdown to "SOB - Item 2"          │
│     ↓                                                            │
│  12. Dashboard updates:                                          │
│     - Tab switches to Item 2                                    │
│     - Data refreshes for Item 2                                 │
│     - Charts update                                             │
│     ↓                                                            │
│  13. User navigates to Suppliers page                           │
│     ↓                                                            │
│  14. User selects multiple suppliers using checkboxes           │
│     ↓                                                            │
│  15. User clicks Edit on "ABC Components Ltd"                   │
│     ↓                                                            │
│  16. Edit form opens → User updates contact info → Saves        │
│     ↓                                                            │
│  17. Toast notification: "ABC Components Ltd updated"           │
│     ↓                                                            │
│  18. User clicks floating AI Assistant button                   │
│     ↓                                                            │
│  19. AI Assistant modal opens                                   │
│     ↓                                                            │
│  20. User asks: "Show me items with critical stock"             │
│     ↓                                                            │
│  21. AI Assistant responds & navigates to Item Master           │
│     ↓                                                            │
│  22. Item Master page shows filtered view                       │
│     ↓                                                            │
│  23. User completes tasks and logs out                          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 11. Color & Design System

```
┌─────────────────────────────────────────────────────────────────┐
│                    VST BRAND COLOR PALETTE                       │
│                                                                  │
│  PRIMARY COLORS:                                                 │
│  • Deep Green/Dark Teal (#006847) - Navigation, buttons, CTA    │
│  • White (#FFFFFF) - Cards, backgrounds, contrast               │
│  • Charcoal/Dark Gray (#1F2937) - Text, headings                │
│                                                                  │
│  ACCENT COLORS:                                                  │
│  • Yellow/Gold (#f59e0b) - Highlights, warnings, accents        │
│  • Green (#10b981) - Success, healthy status                    │
│  • Red (#ef4444) - Alerts, errors, critical status              │
│  • Gray Shades - Secondary text, borders, disabled states       │
│                                                                  │
│  TYPOGRAPHY:                                                     │
│  • Sans-serif font family                                       │
│  • Clear hierarchy (headings, body, captions)                   │
│  • Professional, clean, readable                                │
│                                                                  │
│  STATUS BADGE COLORS:                                            │
│  • Alert - Red background (#fee2e2), Red text (#991b1b)         │
│  • Warning - Yellow background (#fef3c7), Yellow text (#92400e) │
│  • Healthy - Green background (#d1fae5), Green text (#065f46)   │
│  • Active - Green background (#d1fae5), Green text (#15803d)    │
│  • Inactive - Gray background (#f3f4f6), Gray text (#374151)    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 12. Technical Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                   TECHNICAL STACK & STRUCTURE                    │
│                                                                  │
│  FRONTEND FRAMEWORK:                                             │
│  • React (with TypeScript)                                       │
│  • React Router (for navigation)                                │
│  • Tailwind CSS v4 (styling)                                    │
│                                                                  │
│  LIBRARIES:                                                      │
│  • Recharts (data visualization)                                │
│  • Lucide React (icons)                                         │
│  • Sonner (toast notifications)                                 │
│  • Radix UI (UI components)                                     │
│                                                                  │
│  FILE STRUCTURE:                                                 │
│  /src/app/                                                       │
│  ├── App.tsx (Main entry point)                                 │
│  ├── routes.ts (Route configuration)                            │
│  ├── components/                                                │
│  │   ├── ui/ (Reusable UI components)                           │
│  │   └── layout/ (Layout components)                            │
│  ├── pages/                                                     │
│  │   ├── Login.tsx                                              │
│  │   ├── Dashboard.tsx                                          │
│  │   ├── InvoiceRecords.tsx                                     │
│  │   ├── Suppliers.tsx                                          │
│  │   └── ItemMaster.tsx                                         │
│  └── styles/ (CSS/Theme files)                                  │
│                                                                  │
│  KEY FEATURES:                                                   │
│  • Responsive design                                            │
│  • Component-based architecture                                │
│  • State management with React hooks                           │
│  • Client-side routing                                         │
│  • Mock data for demonstration                                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Summary

This comprehensive flow diagram illustrates the complete VST Tractors Dashboard application architecture, covering:

✅ **Authentication & Entry Points**
✅ **Navigation Structure**
✅ **Dashboard with Item Tabs**
✅ **SOB Dashboard & Metrics**
✅ **Invoice Records Detailed View**
✅ **Suppliers Management**
✅ **Item Master Management**
✅ **AI Assistant Integration**
✅ **Category Dropdown Synchronization**
✅ **Interactive Elements & Feedback**
✅ **Complete User Journeys**
✅ **Design System & Branding**
✅ **Technical Architecture**

The application provides a professional, industrial-grade dashboard experience with full interactivity, comprehensive data visualization, and seamless navigation aligned with VST Tractors' brand identity.
