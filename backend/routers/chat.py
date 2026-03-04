from fastapi import APIRouter
from pydantic import BaseModel
import re, os
import pandas as pd
from data_loader import get_grn_df, get_sob_df
from utils.email_utils import create_supplier_report_pdf
router = APIRouter()
class ChatRequest(BaseModel):
    query: str
# Maps natural language phrases -> actual GRN column names
COLUMN_ALIASES = {
    "total invoice amount w/o tax": "TOTAL INVOICE AMOUNT W/O TAX",
    "total invoice amount without tax": "TOTAL INVOICE AMOUNT W/O TAX",
    "invoice amount": "TOTAL INVOICE AMOUNT W/O TAX",
    "invoice value": "TOTAL INVOICE AMOUNT W/O TAX",
    "invoice": "TOTAL INVOICE AMOUNT W/O TAX",
    "po price": "PO PRICE",
    "price": "PO PRICE",
    "quantity": "QUANTITY",
    "received qty": "RECEIVED QTY",
    "received quantity": "RECEIVED QTY",
    "accepted qty": "ACCEPTED QTY",
    "accepted quantity": "ACCEPTED QTY",
    "rejected qty": "REJECTED QTY",
    "rejected quantity": "REJECTED QTY",
    "rejection reason": "REASON FOR REJECTION",
    "reason for rejection": "REASON FOR REJECTION",
    "grn number": "GRN NUMBER",
    "grn date": "GRN DATE",
    "plant name": "PLANT NAME",
    "plant": "PLANT",
    "supplier name": "SUPPLIER NAME",
    "supplier code": "SUPPLIER CODE",
    "supplier invoice number": "SUPPLIER INVOICE NUMBER",
    "supplier invoice date": "SUPPLIER INVOICE DATE",
    "purchase order": "PURCHASE ORDER",
    "po number": "PURCHASE ORDER",
    "material no": "MATERIAL NO",
    "material number": "MATERIAL NO",
    "material desc": "MATERIAL DESC",
    "material description": "MATERIAL DESC",
    "material": "MATERIAL DESC",
    "buyer": "Buyer Name",
    "buyer name": "Buyer Name",
    "gate entry": "GATE ENTRY",
    "accounting document": "ACCOUNTING DOCUMENT NUMBER",
    "ud code date": "UD CODE DATE",
    "lot": "FULL/PARTIAL LOT",
    "po sno": "PO SNO",
}

# Maps natural language filter phrases -> actual GRN column names (for row selection)
FILTER_ALIASES = {
    "purchase order": "PURCHASE ORDER",
    "po": "PURCHASE ORDER",
    "grn number": "GRN NUMBER",
    "grn": "GRN NUMBER",
    "supplier invoice": "SUPPLIER INVOICE NUMBER",
    "invoice number": "SUPPLIER INVOICE NUMBER",
    "supplier": "SUPPLIER NAME",
    "material": "MATERIAL DESC",
    "gate entry": "GATE ENTRY",
    "accounting document": "ACCOUNTING DOCUMENT NUMBER",
    "grn_date": "GRN DATE",
    "grn date": "GRN DATE",
    "date": "GRN DATE",
}

def detect_intent(query):
    q = query.lower()
    if "compare" in q:
        return "compare"
    if "excel" in q or "spreadsheet" in q or "download" in q or "export" in q:
        return "excel"
    if "trend" in q or "over time" in q or "moving average" in q or "rolling average" in q:
        return "trend"
    if "top" in q or "most" in q or "highest" in q or "lowest" in q:
        return "top_n"
    if "mom" in q or "month over month" in q or "month-over-month" in q or "vs last month" in q or "change this month" in q:
        return "mom"
    if ("summary" in q or "summarize" in q) and "report" not in q and "pdf" not in q:
        return "summary"
    if "report" in q or "pdf" in q:
        return "report"
    if "quota" in q or "allocate" in q or "percentage" in q:
        return "quota"
    if "allocation" in q or "breach" in q:
        return "allocation"
    # Lookup should be checked before 'reject' so that 'reason for rejection' is correctly handled
    for alias in sorted(COLUMN_ALIASES.keys(), key=len, reverse=True):
        if alias in q:
            return "lookup"
    if "reject" in q or "rejection" in q:
        return "reject"
    return "general"
def extract_suppliers(query, df):
    """
    Tries to find supplier names mentioned in the query.
    """
    suppliers_found = []
    # Get unique supplier names from our dataset
    unique_suppliers = df['SUPPLIER NAME'].dropna().unique()
    
    q_lower = query.lower()
    for supplier in unique_suppliers:
        if str(supplier).lower() in q_lower:
            suppliers_found.append(supplier)
    
    # If explicitly asking for supplier codes (sXXXX)
    codes = re.findall(r"s(\d+)", q_lower)
    
    return list(set(suppliers_found)), codes
def extract_materials(query, df):
    """
    Tries to find material descriptions mentioned in the query using SOB 'Material Number' column.
    """
    materials_found = []
    sob_df = get_sob_df()
    unique_materials = sob_df["Material Number"].dropna().unique()
    
    q_lower = query.lower()
    for material in unique_materials:
        # Check if material name (e.g., "FLY WHEEL") appears in user query
        if str(material).lower() in q_lower:
            materials_found.append(material)
            
    return list(set(materials_found))
# --- Intent Handlers ---

def handle_lookup(df, query):
    q = query.lower()
    
    # ── Step 1: Find which column the user is asking about ─────────────
    target_col = None
    # Sort aliases by length descending so more specific phrases match first
    for alias in sorted(COLUMN_ALIASES.keys(), key=len, reverse=True):
        if alias in q:
            target_col = COLUMN_ALIASES[alias]
            break
    
    if not target_col:
        return {"response": "I couldn't identify which column you're asking about. Try mentioning the column name like 'total invoice amount', 'received qty', 'rejection reason', etc."}
    
    # ── Step 2: Find filters (what rows to look at) ────────────────────
    filtered_df = df.copy()
    filters_applied = []
    matched_spans = [] # Keep track of chars already used for a filter
    
    # Extract all filters present in the query
    for alias in sorted(FILTER_ALIASES.keys(), key=len, reverse=True):
        if alias in q:
            filter_col = FILTER_ALIASES[alias]
            # Pattern to extract value after alias (e.g., "po-123", "date 10/1/2026")
            pattern = re.compile(
                re.escape(alias) + r'[-:\s]+([\w/]+)',
                re.IGNORECASE
            )
            for match in re.finditer(pattern, query):
                start, end = match.span()
                # Check if this span overlaps with any already matched span
                if any(start < e and end > s for s, e in matched_spans):
                    continue
                
                match_val = match.group(1).strip()
                temp_df = pd.DataFrame()
                
                # Special handling for dates
                if filter_col == "GRN DATE":
                    try:
                        search_date = pd.to_datetime(match_val, dayfirst=True)
                        temp_df = filtered_df[filtered_df[filter_col].dt.date == search_date.date()]
                    except:
                        continue
                else:
                    # Generic matching
                    try:
                        num_val = int(match_val)
                        temp_df = filtered_df[filtered_df[filter_col].astype(str).str.strip() == str(num_val)]
                        if temp_df.empty:
                            temp_df = filtered_df[filtered_df[filter_col] == num_val]
                    except ValueError:
                        temp_df = filtered_df[filtered_df[filter_col].astype(str).str.lower().str.strip() == match_val.lower()]
                
                if not temp_df.empty:
                    filtered_df = temp_df
                    filters_applied.append(f"{filter_col} = {match_val}")
                    matched_spans.append((start, end))
    
    # If no aliases matched, try bare numbers as fallback
    if not filters_applied:
        numbers = re.findall(r'\b[sS]?(\d{7,})\b', query)
        if numbers:
            for num in numbers:
                for col in ["PURCHASE ORDER", "GRN NUMBER", "GATE ENTRY",
                            "ACCOUNTING DOCUMENT NUMBER", "SUPPLIER INVOICE NUMBER", "SUPPLIER CODE"]:
                    match_df = filtered_df[filtered_df[col].astype(str).str.strip() == str(num)]
                    if not match_df.empty:
                        filtered_df = match_df
                        filters_applied.append(f"{col} = {num}")
                        break
    
    if filtered_df.empty:
        return {"response": f"⚠️ No rows found matching your criteria ({', '.join(filters_applied) if filters_applied else 'no filters detected'})."}
    
    if target_col not in filtered_df.columns:
        return {"response": f"⚠️ Column '{target_col}' not found in the dataset."}
    
    # ── Step 3: Aggregate or return the value ─────────────────────────
    values = filtered_df[target_col].dropna()
    rows_found = len(filtered_df)
    filter_desc = f" for **{', '.join(filters_applied)}**" if filters_applied else ""
    
    # Numeric columns: sum them
    numeric_cols = ["TOTAL INVOICE AMOUNT W/O TAX", "PO PRICE", "QUANTITY",
                    "RECEIVED QTY", "ACCEPTED QTY", "REJECTED QTY"]
    
    if target_col in numeric_cols:
        total = values.sum()
        return {
            "response": (
                f"📋 **{target_col}**{filter_desc}\n\n"
                f"- **Total:** {total:,.2f}\n"
                f"- Across **{rows_found}** record(s)"
            )
        }
    else:
        # Non-numeric: list unique values
        unique_vals = values.unique().tolist()
        val_list = "\n".join([f"  - {v}" for v in unique_vals[:10]])  # cap at 10
        return {
            "response": (
                f"📋 **{target_col}**{filter_desc}\n\n"
                f"{val_list}\n"
                f"\n_(From **{rows_found}** record(s))_"
            )
        }


def handle_summary(df):
    total_received = df['RECEIVED QTY'].sum()
    total_accepted = df['ACCEPTED QTY'].sum()
    total_rejected = df['REJECTED QTY'].sum()
    
    rejection_rate = round((total_rejected / total_received) * 100, 2) if total_received > 0 else 0
    
    response = (
        f"📊 **Supply Chain Summary Report**\n\n"
        f"- **Total Goods Received:** {int(total_received):,}\n"
        f"- **Total Goods Accepted:** {int(total_accepted):,}\n"
        f"- **Total Goods Rejected:** {int(total_rejected):,}\n"
        f"- **Overall Rejection Rate:** {rejection_rate}%\n"
    )
    return {"response": response}
def handle_compare(df, suppliers, materials, target_col=None):
    # Determine what we are comparing
    if len(suppliers) >= 2:
        item1, item2 = suppliers[0], suppliers[1]
        col_to_filter = 'SUPPLIER NAME'
    elif len(materials) >= 2:
        item1, item2 = materials[0], materials[1]
        col_to_filter = 'MATERIAL DESC'
    else:
        return {"response": "Please mention at least two suppliers or two materials to compare (e.g. 'Compare Fly Wheel and Axel Gear CT85')."}
    
    # Set default target column if none detected
    if not target_col:
        target_col = 'ACCEPTED QTY'
        
    if target_col not in df.columns:
        return {"response": f"⚠️ Column '{target_col}' not found in the dataset for comparison."}
    
    # Filter dataframes for the two items
    if col_to_filter == 'MATERIAL DESC':
        df1 = df[df['MATERIAL DESC'].str.lower().isin([item1.lower()]) | df['MATERIAL NO'].str.lower().isin([item1.lower()])]
        df2 = df[df['MATERIAL DESC'].str.lower().isin([item2.lower()]) | df['MATERIAL NO'].str.lower().isin([item2.lower()])]
    else:
        df1 = df[df[col_to_filter] == item1]
        df2 = df[df[col_to_filter] == item2]
    
    if df1.empty or df2.empty:
        missing = []
        if df1.empty: missing.append(f"**{item1}**")
        if df2.empty: missing.append(f"**{item2}**")
        return {"response": f"I couldn't find enough data to compare {item1} and {item2}. Missing data for: {', '.join(missing)}."}
        
    # Aggregate values
    # For prices average makes more sense; for quantities sum makes more sense
    agg_func = 'mean' if "PRICE" in target_col.upper() else 'sum'
    
    val1 = float(df1[target_col].mean()) if agg_func == 'mean' else float(df1[target_col].sum())
    val2 = float(df2[target_col].mean()) if agg_func == 'mean' else float(df2[target_col].sum())
    
    # Format numbers neatly
    v1_str = f"{val1:,.2f}" if isinstance(val1, float) else f"{int(val1):,}"
    v2_str = f"{val2:,.2f}" if isinstance(val2, float) else f"{int(val2):,}"
    
    better = item1 if val1 > val2 else item2
    if val1 == val2:
        winner_text = f"Both have the same {target_col.lower().title()}."
    else:
        winner_text = f"🏆 **{better}** has a higher overall {target_col.lower().title()}."
    
    response = (
        f"⚖️ **Comparison Report: {target_col}**\n\n"
        f"**{item1}**\n- {target_col}: {v1_str}\n\n"
        f"**{item2}**\n- {target_col}: {v2_str}\n\n"
        f"{winner_text}"
    )
    return {"response": response, "data": {item1: val1, item2: val2}}
def handle_trend(df, target_col=None, supplier_wise=False, rolling_window=None):
    """
    Returns data formatted for a frontend line chart.
    If target_col is provided, shows that metric.
    Otherwise defaults to accepted vs rejected over time.
    If rolling_window is an integer, applies a moving average over that many days.
    Otherwise defaults to accepted vs rejected over time.
    """
    if df.empty:
        return {"response": "Not enough data to generate a trend chart."}
        
    if supplier_wise:
        target_col = target_col or 'ACCEPTED QTY'
        agg_func = 'mean' if "PRICE" in target_col.upper() else 'sum'
        
        trend_df = df.groupby([df['GRN DATE'].dt.date, 'SUPPLIER NAME']).agg({
            target_col: agg_func
        }).reset_index()
        
        all_dates = sorted(trend_df['GRN DATE'].unique())
        labels = [str(d) for d in all_dates]
        
        datasets = []
        for supplier in trend_df['SUPPLIER NAME'].unique():
            # Get only the target column series for this supplier and reindex to explicitly zero missing dates
            sup_series = trend_df[trend_df['SUPPLIER NAME'] == supplier].set_index('GRN DATE')[target_col].reindex(all_dates, fill_value=0)
            sup_df = sup_series.to_frame()
            
            if rolling_window:
                sup_df[target_col] = sup_df[target_col].rolling(window=rolling_window, min_periods=1).mean()
                
            data = sup_df[target_col].tolist()
            label_suffix = f"({rolling_window}-Day Avg {target_col})" if rolling_window else f"({target_col})"
            datasets.append({"label": f"{supplier} {label_suffix}", "data": data})
            
        avg_text = f"{rolling_window}-day moving average of " if rolling_window else ""
        response = f"📈 Here is the supplier-wise trend for the **{avg_text}{target_col}** over time."
        chart_data = {
            "type": "line",
            "labels": labels,
            "datasets": datasets
        }
    else:
        # Group by GRN DATE
        if target_col and target_col in df.columns:
            # For prices, we usually want the average per day if multiple records exist,
            # but for quantities we want the sum.
            agg_func = 'mean' if "PRICE" in target_col.upper() else 'sum'
            
            trend_df = df.groupby(df['GRN DATE'].dt.date).agg({
                target_col: agg_func
            }).reset_index()
            
            # Ensure it's sorted by date
            trend_df = trend_df.sort_values(by="GRN DATE")
            
            # Apply rolling moving average if requested
            if rolling_window:
                trend_df[target_col] = trend_df[target_col].rolling(window=rolling_window, min_periods=1).mean()
            
            labels = trend_df['GRN DATE'].astype(str).tolist()
            values = trend_df[target_col].tolist()
            
            avg_text = f"{rolling_window}-day moving average of " if rolling_window else ""
            response = f"📈 Here is the trend for the **{avg_text}{target_col}** over time."
            
            chart_data = {
                "type": "line",
                "labels": labels,
                "datasets": [
                    {"label": target_col, "data": values}
                ]
            }
        else:
            trend_df = df.groupby(df['GRN DATE'].dt.date).agg({
                'ACCEPTED QTY': 'sum',
                'REJECTED QTY': 'sum'
            }).reset_index()
            
            # Ensure it's sorted by date
            trend_df = trend_df.sort_values(by="GRN DATE")
            
            if rolling_window:
                trend_df['ACCEPTED QTY'] = trend_df['ACCEPTED QTY'].rolling(window=rolling_window, min_periods=1).mean()
                trend_df['REJECTED QTY'] = trend_df['REJECTED QTY'].rolling(window=rolling_window, min_periods=1).mean()
            
            labels = trend_df['GRN DATE'].astype(str).tolist()
            accepted_values = trend_df['ACCEPTED QTY'].tolist()
            rejected_values = trend_df['REJECTED QTY'].tolist()
            
            avg_text = f"{rolling_window}-day moving average for " if rolling_window else ""
            response = f"📈 Here is the trend of the **{avg_text}Accepted vs Rejected quantities** over time."
            
            chart_data = {
                "type": "line",
                "labels": labels,
                "datasets": [
                    {"label": "Accepted QTY", "data": accepted_values},
                    {"label": "Rejected QTY", "data": rejected_values}
                ]
            }
    
    return {"response": response, "chart": chart_data}
def handle_invoice(df, suppliers):
    if not suppliers:
        return {"response": "Please specify a supplier to see their invoice trend."}
        
    # Group by GRN DATE
    trend_df = df.groupby(df['GRN DATE'].dt.date).agg({
        'TOTAL INVOICE AMOUNT W/O TAX': 'sum'
    }).reset_index()
    
    # Ensure it's sorted by date
    trend_df = trend_df.sort_values(by="GRN DATE")
    
    labels = trend_df['GRN DATE'].astype(str).tolist()
    invoice_values = trend_df['TOTAL INVOICE AMOUNT W/O TAX'].tolist()
    
    response = f"📈 Here is the trend of the Total Invoice Amount W/O Tax for {suppliers[0]}."
    
    chart_data = {
        "type": "line",
        "labels": labels,
        "datasets": [
            {"label": "Total Invoice Amount W/O Tax", "data": invoice_values}
        ]
    }
    
    return {"response": response, "chart": chart_data}
def handle_allocation(df):
    breaches = df[df['ACCEPTED QTY'] > df['RECEIVED QTY']]
    
    if breaches.empty:
        return {"response": "✅ Great news! No supplier has an Accepted Quantity greater than their Received Quantity."}
    
    total_breaches = len(breaches)
    
    # Calculate the differences to find the worst offender
    worst_offender_idx = (breaches['ACCEPTED QTY'] - breaches['RECEIVED QTY']).idxmax()
    worst_name = breaches.loc[worst_offender_idx, 'SUPPLIER NAME']
    
    response = (
        f"⚠️ **Quantity Breaches Detected**\n\n"
        f"I found **{total_breaches}** instances where the Accepted Quantity exceeded the Received Quantity.\n"
        f"The most significant breach was by **{worst_name}**."
    )
    return {"response": response}
def handle_quota(sob_df, suppliers, materials):
    if not suppliers and not materials:
        return {"response": "Please specify a supplier and/or a material to check their quota."}
        
    filtered_sob = sob_df
    
    if suppliers:
        # Match on the 'Vendor's account number' column (supplier name in SOB)
        filtered_sob = filtered_sob[
            filtered_sob["Vendor's account number"].str.lower().isin([s.lower() for s in suppliers])
        ]
        
    if materials:
        # Match on the 'Material Number' column (material description in SOB)
        filtered_sob = filtered_sob[
            filtered_sob["Material Number"].str.lower().isin([m.lower() for m in materials])
        ]
        
    if filtered_sob.empty:
        return {"response": "I couldn't find any quota allocation matching your description in the SOB data."}
        
    response_lines = ["📊 **Quota Allocations Found:**\n"]
    for _, row in filtered_sob.iterrows():
        vendor = row.get("Vendor's account number", "Unknown")
        material = row.get("Material Number", "Unknown")
        quota = row.get("Quota", 0)
        response_lines.append(f"- **{vendor}** supplies **{quota}%** of **{material}**")
        
    return {"response": "\n".join(response_lines)}

def handle_top_n(df, query, target_col=None):
    q_lower = query.lower()
    
    # 1. Extract N (default to 5)
    n_match = re.search(r'\b(?:top|bottom|highest|lowest|most|least)\s+(\d+)\b', q_lower)
    n = int(n_match.group(1)) if n_match else 5
    
    # 2. Determine Grouping (Supplier or Material)
    if "material" in q_lower or "item" in q_lower or "product" in q_lower:
        group_col = "MATERIAL DESC"
        entity_name = "Materials"
    else:
        group_col = "SUPPLIER NAME"
        entity_name = "Suppliers"
        
    # 3. Determine Ordering (Highest or Lowest)
    ascending = True if "lowest" in q_lower or "bottom" in q_lower or "least" in q_lower else False
    order_word = "Bottom" if ascending else "Top"
    
    # 4. Determine Metric
    if not target_col:
        # Default to Invoice Amount if nothing specific is asked
        target_col = "TOTAL INVOICE AMOUNT W/O TAX"
        
    if target_col not in df.columns:
        return {"response": f"⚠️ Column '{target_col}' not found for analysis."}
        
    # 5. Aggregate and Sort
    agg_func = 'mean' if "PRICE" in target_col.upper() else 'sum'
    
    grouped = df.groupby(group_col).agg({target_col: agg_func}).reset_index()
    
    # Handle NaNs
    grouped = grouped.dropna(subset=[target_col])
    
    sorted_df = grouped.sort_values(by=target_col, ascending=ascending).head(n)
    
    if sorted_df.empty:
        return {"response": f"No data available to calculate Top {n} {entity_name}."}
        
    # 6. Format Output
    response_lines = [f"🏆 **{order_word} {n} {entity_name} by {target_col.title()}**\n"]
    
    for i, row in sorted_df.iterrows():
        entity = row[group_col]
        val = row[target_col]
        # Format metric
        val_str = f"{val:,.2f}" if isinstance(val, float) else f"{int(val):,}"
        response_lines.append(f"{len(response_lines)}. **{entity}**: {val_str}")
        
    return {"response": "\n".join(response_lines)}

def handle_mom(df, query, target_col=None):
    if df.empty:
        return {"response": "No data available."}
        
    if not target_col:
        target_col = "TOTAL INVOICE AMOUNT W/O TAX"
        
    if target_col not in df.columns:
        return {"response": f"⚠️ Column '{target_col}' not found for analysis."}
        
    # Find the latest month and the month before it
    # We do this dynamically based on the dataset's dates
    dates = df['GRN DATE'].dropna()
    if dates.empty:
        return {"response": "No date information available for Month-over-Month analysis."}
        
    latest_date = dates.max()
    current_month = latest_date.month
    current_year = latest_date.year
    
    # Calculate previous month/year
    if current_month == 1:
        prev_month = 12
        prev_year = current_year - 1
    else:
        prev_month = current_month - 1
        prev_year = current_year
        
    # Filter dataframes
    curr_df = df[(df['GRN DATE'].dt.month == current_month) & (df['GRN DATE'].dt.year == current_year)]
    prev_df = df[(df['GRN DATE'].dt.month == prev_month) & (df['GRN DATE'].dt.year == prev_year)]
    
    agg_func = 'mean' if "PRICE" in target_col.upper() else 'sum'
    
    curr_val = curr_df[target_col].mean() if agg_func == 'mean' else curr_df[target_col].sum()
    prev_val = prev_df[target_col].mean() if agg_func == 'mean' else prev_df[target_col].sum()
    
    # Format strings
    curr_str = f"{curr_val:,.2f}" if isinstance(curr_val, float) else f"{int(curr_val):,}"
    prev_str = f"{prev_val:,.2f}" if isinstance(prev_val, float) else f"{int(prev_val):,}"
    
    # Get month names
    curr_month_name = latest_date.strftime("%B %Y")
    
    import datetime
    prev_month_name = datetime.date(prev_year, prev_month, 1).strftime("%B %Y")
    
    # Check if there is enough data
    if prev_df.empty and not curr_df.empty:
        return {
            "response": (
                f"📅 **Month-over-Month: {target_col.title()}**\n\n"
                f"- **{curr_month_name}:** {curr_str}\n"
                f"- **{prev_month_name}:** No data available.\n\n"
                f"I only have data for {curr_month_name}, so I cannot calculate a comparison percentage."
            )
        }
    
    diff = curr_val - prev_val
    if prev_val == 0:
        pct_change = 100 if curr_val > 0 else 0
    else:
        pct_change = (diff / prev_val) * 100
        
    direction = "up 📈" if diff > 0 else "down 📉" if diff < 0 else "unchanged ➖"
    
    response = (
        f"📅 **Month-over-Month: {target_col.title()}**\n\n"
        f"- **{curr_month_name} (Current):** {curr_str}\n"
        f"- **{prev_month_name} (Previous):** {prev_str}\n\n"
        f"**Conclusion:** The {target_col.lower()} is **{direction} by {abs(pct_change):.1f}%** compared to last month."
    )
    
    return {"response": response}

def handle_excel(df, suppliers, materials):
    # Filter by supplier and/or material
    if suppliers and materials:
        df_out = df[df["SUPPLIER NAME"].isin(suppliers) | df["MATERIAL DESC"].isin(materials)]
        label = f"{suppliers[0]}_{materials[0]}"
    elif suppliers:
        df_out = df[df["SUPPLIER NAME"].isin(suppliers)]
        label = suppliers[0]
    elif materials:
        df_out = df[df["MATERIAL DESC"].isin(materials)]
        label = materials[0]
    else:
        return {"response": "❌ Please specify a supplier or material. Example: 'give me the excel sheet for V.R. Foundries'"}

    if df_out.empty:
        return {"response": "❌ No data found matching your query."}

    exports_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "exports")
    os.makedirs(exports_dir, exist_ok=True)
    safe_label = label.replace("/", "_").replace(" ", "_").replace(".", "")[:40]
    xlsx_path = os.path.join(exports_dir, f"Export_{safe_label}.xlsx")

    df_out.to_excel(xlsx_path, index=False)

    return {
        "response": f"✅ Excel sheet generated for **{label}** ({len(df_out)} rows)!",
        "xlsx_path": xlsx_path,
        "download_url": f"/api/reports/download-excel?path={xlsx_path}"
    }

def handle_report(df, suppliers):
    if not suppliers:
        return {"response": "❌ Please mention a supplier name so I can generate the report. Example: 'generate report for V.R. Foundries'"}
    
    supplier_name = suppliers[0]
    supplier_df = df[df["SUPPLIER NAME"] == supplier_name]
    
    if supplier_df.empty:
        return {"response": f"❌ No data found for supplier **{supplier_name}**."}
    
    # Save to a reports directory
    reports_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "reports")
    os.makedirs(reports_dir, exist_ok=True)
    safe_name = supplier_name.replace("/", "_").replace(" ", "_").replace(".", "")
    pdf_path = os.path.join(reports_dir, f"Supplier_Report_{safe_name}.pdf")
    
    create_supplier_report_pdf(supplier_name, supplier_df, pdf_path)
    
    return {
        "response": f"✅ PDF report generated for **{supplier_name}**!",
        "pdf_path": pdf_path,
        "download_hint": f"GET /api/reports/download?path={pdf_path}"
    }

# --- Main Chat Endpoint ---
@router.post("/chat")
def chat(request: ChatRequest):
    query = request.query
    df = get_grn_df()
    sob_df = get_sob_df()
    
    if df.empty:
        return {"response": "I cannot answer that right now because the dataset is empty or failed to load."}
        
    intent = detect_intent(query)
    suppliers, codes = extract_suppliers(query, df)
    materials = extract_materials(query, df)
    
    # Don't filter df for lookup — lookup does its own filtering
    if suppliers and intent not in ("compare", "report", "quota", "excel", "lookup", "trend"):
        df = df[df['SUPPLIER NAME'] == suppliers[0]]
        
    # Also filter by material for trends if specified
    if materials and intent == "trend":
        # Match against either description or number
        m_list = [m.lower() for m in materials]
        df = df[df['MATERIAL DESC'].str.lower().isin(m_list) | 
                df['MATERIAL NO'].str.lower().isin(m_list)]
        
    if intent == "summary":
        return handle_summary(df)
        
    elif intent == "compare":
        # Identify if they are asking for a specific column compare
        target_col = None
        for alias in sorted(COLUMN_ALIASES.keys(), key=len, reverse=True):
            if alias in query.lower():
                target_col = COLUMN_ALIASES[alias]
                break
        return handle_compare(get_grn_df(), suppliers, materials, target_col)
        
    elif intent == "trend":
        # Identify if they are asking for a specific column trend
        target_col = None
        for alias in sorted(COLUMN_ALIASES.keys(), key=len, reverse=True):
            if alias in query.lower():
                target_col = COLUMN_ALIASES[alias]
                break
                
        q_lower = query.lower()
        supplier_wise = "supplier wise" in q_lower or "by supplier" in q_lower or "each supplier" in q_lower or len(suppliers) > 1
        
        # Extract rolling window if asked (e.g., "7 day moving average")
        rolling_window = None
        rolling_match = re.search(r'(\d+)[-\s]*(?:day)?\s*(?:moving|rolling)\s*average', q_lower)
        if rolling_match:
            rolling_window = int(rolling_match.group(1))
        
        # If supplier_wise but specific suppliers are mentioned, filter to them
        if suppliers and supplier_wise:
            df = df[df['SUPPLIER NAME'].isin(suppliers)]
        elif suppliers and not supplier_wise:
            df = df[df['SUPPLIER NAME'] == suppliers[0]]
            
        return handle_trend(df, target_col, supplier_wise, rolling_window)

    elif intent == "invoice":
        return handle_invoice(df, suppliers)
    
    elif intent == "report":
        return handle_report(get_grn_df(), suppliers)
    
    elif intent == "excel":
        return handle_excel(get_grn_df(), suppliers, materials)
        
    elif intent == "top_n":
        target_col = None
        for alias in sorted(COLUMN_ALIASES.keys(), key=len, reverse=True):
            if alias in query.lower():
                target_col = COLUMN_ALIASES[alias]
                break
        return handle_top_n(df, query, target_col)
        
    elif intent == "mom":
        target_col = None
        for alias in sorted(COLUMN_ALIASES.keys(), key=len, reverse=True):
            if alias in query.lower():
                target_col = COLUMN_ALIASES[alias]
                break
        return handle_mom(df, query, target_col)
    
    elif intent == "lookup":
        return handle_lookup(get_grn_df(), query)
        
    elif intent == "quota":
        return handle_quota(sob_df, suppliers, materials)
        
    elif intent == "allocation":
        return handle_allocation(df)
        
    elif intent == "reject":
        total_rej = df['REJECTED QTY'].sum()
        if suppliers:
            return {"response": f"The total rejected quantity for {suppliers[0]} is {int(total_rej):,}."}
        return {"response": f"The total rejected quantity across all suppliers is {int(total_rej):,}."}
        
    else:
        return {
            "response": "I am a rule-based supply chain assistant. You can ask me to:\n"
                        "- **Summarize** the performance\n"
                        "- **Compare** two suppliers\n"
                        "- Show the **trend** of accepted goods over time\n"
                        "- Show the **invoice** amount trend for a specific supplier\n"
                        "- Generate a **PDF report** for a supplier (e.g., 'generate report for V.R. Foundries')\n"
                        "- Download an **Excel sheet** for a supplier or material (e.g., 'give me the excel sheet for V.R. Foundries')\n"
                        "- Ask about a supplier's **quota** for a material\n"
                        "- Check for **allocation breaches**"
        }
