from fastapi import APIRouter
from pydantic import BaseModel
import re
import pandas as pd
from data_loader import get_grn_df, get_sob_df
from routers.kpis import get_merged_allocation_data
router = APIRouter()
class ChatRequest(BaseModel):
    query: str
# --- Intent Detection Helpers ---
def detect_intent(query):
    q = query.lower()
    if "compare" in q:
        return "compare"
    if "invoice" in q or "amount" in q or "tax" in q:
        return "invoice"
    if "trend" in q or "over time" in q:
        return "trend"
    if "summary" in q or "summarize" in q or "report" in q:
        return "summary"
    if "quota" in q or "allocate" in q or "percentage" in q:
        return "quota"
    if "allocation" in q or "breach" in q:
        return "allocation"
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
    Tries to find material descriptions mentioned in the query.
    """
    materials_found = []
    unique_materials = df['MATERIAL DESC'].dropna().unique()
    
    q_lower = query.lower()
    for material in unique_materials:
        # Check if the material name (e.g., "FLY WHEEL") is in the query
        if str(material).lower() in q_lower:
            materials_found.append(material)
            
    return list(set(materials_found))
# --- Intent Handlers ---
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
def handle_compare(df, suppliers):
    if len(suppliers) < 2:
        return {"response": "Please mention at least two suppliers to compare."}
    
    s1 = suppliers[0]
    s2 = suppliers[1]
    
    df1 = df[df['SUPPLIER NAME'] == s1]
    df2 = df[df['SUPPLIER NAME'] == s2]
    
    if df1.empty or df2.empty:
        return {"response": f"I couldn't find enough data to compare {s1} and {s2}."}
        
    s1_acc = df1['ACCEPTED QTY'].sum()
    s2_acc = df2['ACCEPTED QTY'].sum()
    
    better = s1 if s1_acc > s2_acc else s2
    
    response = (
        f"⚖️ **Comparison Report**\n\n"
        f"**{s1}**\n- Accepted Quantity: {int(s1_acc):,}\n\n"
        f"**{s2}**\n- Accepted Quantity: {int(s2_acc):,}\n\n"
        f"🏆 {better} has a higher overall accepted quantity."
    )
    return {"response": response, "data": {s1: int(s1_acc), s2: int(s2_acc)}}
def handle_trend(df):
    """
    Returns data formatted for a frontend line chart showing accepted vs rejected over time.
    """
    # Group by GRN DATE
    trend_df = df.groupby(df['GRN DATE'].dt.date).agg({
        'ACCEPTED QTY': 'sum',
        'REJECTED QTY': 'sum'
    }).reset_index()
    
    # Ensure it's sorted by date
    trend_df = trend_df.sort_values(by="GRN DATE")
    
    labels = trend_df['GRN DATE'].astype(str).tolist()
    accepted_values = trend_df['ACCEPTED QTY'].tolist()
    rejected_values = trend_df['REJECTED QTY'].tolist()
    
    response = "📈 Here is the trend of Accepted vs Rejected quantities over time."
    
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
        # Match supplier name (case insensitive)
        filtered_sob = filtered_sob[filtered_sob['Vendor Name'].str.lower().isin([s.lower() for s in suppliers])]
        
    if materials:
        # Match material desc
        filtered_sob = filtered_sob[filtered_sob['Material Description'].str.lower().isin([m.lower() for m in materials])]
        
    if filtered_sob.empty:
        return {"response": "I couldn't find any quota allocation matching your description in the SOB data."}
        
    response_lines = ["📊 **Quota Allocations Found:**\n"]
    for _, row in filtered_sob.iterrows():
        vendor = row.get("Vendor Name", "Unknown")
        material = row.get("Material Description", "Unknown")
        quota = row.get("Quota", 0)
        response_lines.append(f"- **{vendor}** supplies **{quota}%** of **{material}**")
        
    return {"response": "\n".join(response_lines)}
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
    
    # Filter dataset if a specific supplier is mentioned (and it's not a comparison)
    if suppliers and intent != "compare":
        # Just filter by the first supplier mentioned for simplicity
        df = df[df['SUPPLIER NAME'] == suppliers[0]]
        
    if intent == "summary":
        return handle_summary(df)
        
    elif intent == "compare":
        return handle_compare(get_grn_df(), suppliers) # Use unfiltered df for comparison
        
    elif intent == "trend":
        return handle_trend(df)
        
    elif intent == "invoice":
        return handle_invoice(df, suppliers)
        
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
                        "- **Compare** two suppliers (e.g., 'Compare V.R. Foundries and Damodar Engineering')\n"
                        "- Show the **trend** of accepted goods over time\n"
                        "- Show the **invoice** amount trend for a specific supplier\n"
                        "- Ask about a supplier's **quota** for a material\n"
                        "- Check for **allocation breaches**"
        }
