from fastapi import APIRouter, Query, HTTPException, BackgroundTasks
import pandas as pd
from typing import Optional, List, Dict, Any
from data_loader import get_grn_df, get_sob_df
from utils.email_utils import send_breach_email, create_allocation_breach_pdf
import os
from datetime import datetime

router = APIRouter()

# Helper function to merge GRN and SOB for allocation checks
def get_merged_allocation_data():
    grn = get_grn_df()
    sob = get_sob_df()

    if grn.empty or sob.empty:
        return pd.DataFrame()

    # We need to map the Received QTY (GRN) to the Allocated Quota (SOB)
    # The common keys seem to be: 'MATERIAL NO' (GRN) <-> 'Material Value / Material Number' (SOB)
    # And 'SUPPLIER CODE' (GRN) <-> 'Vendor' (SOB)
    
    # We will aggregate GRN by Supplier and Material first
    grn_agg = grn.groupby(['SUPPLIER CODE', 'SUPPLIER NAME', 'MATERIAL NO', 'MATERIAL DESC'], as_index=False).agg({
        'RECEIVED QTY': 'sum',
        'ACCEPTED QTY': 'sum',
        'REJECTED QTY': 'sum'
    })

    # Calculate Total Received Qty for each Material across all suppliers
    material_totals = grn_agg.groupby('MATERIAL NO')['RECEIVED QTY'].sum().reset_index()
    material_totals.rename(columns={'RECEIVED QTY': 'TOTAL_MATERIAL_RECEIVED'}, inplace=True)
    
    # Merge to get the total back into the grn_agg
    grn_agg = pd.merge(grn_agg, material_totals, on='MATERIAL NO', how='left')
    
    # Calculate the Actual Percentage supplied
    grn_agg['ACTUAL_PERCENTAGE'] = (grn_agg['RECEIVED QTY'] / grn_agg['TOTAL_MATERIAL_RECEIVED']) * 100
    grn_agg['ACTUAL_PERCENTAGE'] = grn_agg['ACTUAL_PERCENTAGE'].fillna(0).round(2)

    # Standardize SOB for merging
    sob_renamed = sob.rename(columns={
        'Vendor': 'SUPPLIER CODE',
        'Material': 'MATERIAL NO'
    })

    # Aggregate SOB just in case of duplicates
    sob_agg = sob_renamed.groupby(['SUPPLIER CODE', 'MATERIAL NO'], as_index=False).agg({
        'Quota': 'mean' # It should be the same percentage, use mean or max instead of sum to avoid >100%
    })

    # Merge
    merged = pd.merge(grn_agg, sob_agg, on=['SUPPLIER CODE', 'MATERIAL NO'], how='left')
    
    # Fill NaN quotas with 0
    merged['Quota'] = merged['Quota'].fillna(0)
    
    return merged


@router.get("/kpis/overall-receipts")
def get_overall_receipts():
    """
    Returns total quantity received, accepted, and rejected across all suppliers.
    """
    df = get_grn_df()
    if df.empty:
        return {"error": "NO_DATA"}

    return {
        "total_received": int(df['RECEIVED QTY'].sum()),
        "total_accepted": int(df['ACCEPTED QTY'].sum()),
        "total_rejected": int(df['REJECTED QTY'].sum()),
        "rejection_rate_percent": round((df['REJECTED QTY'].sum() / df['RECEIVED QTY'].sum()) * 100, 2) if df['RECEIVED QTY'].sum() > 0 else 0
    }

@router.get("/kpis/supplier-performance")
def get_supplier_performance(supplier_code: Optional[int] = Query(None, description="Filter by Supplier Code")):
    """
    Returns a summary for a specific supplier (or all), including accepted vs rejected quantities.
    """
    df = get_grn_df()
    if df.empty:
         return {"error": "NO_DATA"}

    if supplier_code:
        df = df[df['SUPPLIER CODE'] == supplier_code]

    summary = df.groupby(['SUPPLIER CODE', 'SUPPLIER NAME']).agg({
        'RECEIVED QTY': 'sum',
        'ACCEPTED QTY': 'sum',
        'REJECTED QTY': 'sum'
    }).reset_index()

    summary['rejection_rate'] = (summary['REJECTED QTY'] / summary['RECEIVED QTY']) * 100
    summary['rejection_rate'] = summary['rejection_rate'].fillna(0).round(2)

    return summary.to_dict(orient="records")

@router.get("/kpis/rejection-causes")
def get_rejection_causes():
    """
    Groups and counts the REASON FOR REJECTION to identify major quality issues.
    """
    df = get_grn_df()
    if df.empty:
         return {"error": "NO_DATA"}
    
    # Filter rows with rejections
    rejections = df[df['REJECTED QTY'] > 0]
    
    if rejections.empty:
        return {"message": "No rejections found."}

    # Group by Reason
    # We might need to handle NaN in "REASON FOR REJECTION"
    reasons = rejections.groupby('REASON FOR REJECTION', dropna=False)['REJECTED QTY'].sum().reset_index()
    # Replace NaN with 'Unknown'
    reasons['REASON FOR REJECTION'] = reasons['REASON FOR REJECTION'].fillna('Unknown')

    # Sort descending
    reasons = reasons.sort_values(by='REJECTED QTY', ascending=False)
    
    return reasons.to_dict(orient="records")


@router.post("/kpis/check-allocation-breaches")
def check_allocation_breaches(
    background_tasks: BackgroundTasks,
    supplier_name: str = Query(..., description="Required Supplier Name"),
    grn_date: str = Query(..., description="Required GRN Date (YYYY-MM-DD)")
):
    """
    Checks if Accepted Quantity < Received Quantity for a specific Supplier and GRN Date.
    If so, generates a PDF and sends an email alert.
    """
    df = get_grn_df()
    
    if df.empty:
        raise HTTPException(status_code=500, detail="Data unavailable for check.")

    # Filter by Date
    try:
        target_date = pd.to_datetime(grn_date).date()
        df_filtered = df[df['GRN DATE'].dt.date == target_date]
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD.")
        
    # Filter by Supplier Name
    df_filtered = df_filtered[df_filtered['SUPPLIER NAME'].str.lower() == supplier_name.lower()]

    if df_filtered.empty:
        return {"status": "SUCCESS", "message": f"No data found for {supplier_name} on {grn_date}.", "breaches_found": 0}

    # Find Breaches: If Accepted Quantity > Received Quantity
    breaches = df_filtered[df_filtered['ACCEPTED QTY'] > df_filtered['RECEIVED QTY']]

    if breaches.empty:
        return {"status": "SUCCESS", "message": "No breaches detected (Accepted Quantity did not exceed Received Quantity).", "breaches_found": 0}

    # Process Breaches and Send Emails
    alerts_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "alerts")
    os.makedirs(alerts_dir, exist_ok=True)

    breach_records = []
    
    def process_breach_emails(breach_data, directory):
        for index, row in breach_data.iterrows():
            timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
            safe_supplier = str(row['SUPPLIER NAME']).replace("/", "_").replace(" ", "_")
            pdf_filename = f"Breach_{row['SUPPLIER CODE']}_{safe_supplier}_{timestamp}.pdf"
            pdf_path = os.path.join(directory, pdf_filename)
            
            # 1. Create PDF
            create_allocation_breach_pdf(row, pdf_path)
            
            # 2. Send Email
            subject = f"ALERT: Allocation Breach Detected for Supplier {row['SUPPLIER NAME']}"
            body = (
                f"An allocation breach has been detected.\n\n"
                f"Supplier: {row['SUPPLIER NAME']} ({row['SUPPLIER CODE']})\n"
                f"Material: {row['MATERIAL DESC']} ({row['MATERIAL NO']})\n"
                f"Allocated Quota: {row.get('Quota', 'Not specified in GRN')}\n"
                f"Actually Received: {row.get('RECEIVED QTY', 0)}\n\n"
                f"Please find the detailed PDF report attached."
            )
            
            send_breach_email(subject, body, pdf_path)

    # Add email sending to background task so the API responds immediately
    background_tasks.add_task(process_breach_emails, breaches, alerts_dir)

    for _, row in breaches.iterrows():
        breach_records.append({
            "supplier_name": str(row['SUPPLIER NAME']),
            "grn_date": grn_date,
            "material_no": str(row['MATERIAL NO']),
            "received_qty": int(row['RECEIVED QTY']),
            "accepted_qty": int(row['ACCEPTED QTY']),
            "exceeded_qty": int(row['ACCEPTED QTY'] - row['RECEIVED QTY'])
        })

    return {
        "status": "ALERT_TRIGGERED", 
        "message": f"{len(breaches)} allocation breaches discovered. Emails are being dispatched.",
        "breaches_found": len(breaches),
        "details": breach_records
    }
