import smtplib
from email.message import EmailMessage
import os
from fpdf import FPDF
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

SENDER_EMAIL = os.getenv("SENDER_EMAIL", "your_sender_email@gmail.com")
SENDER_PASSWORD = os.getenv("SENDER_PASSWORD", "your_app_password")
RECIPIENT_EMAIL = os.getenv("RECIPIENT_EMAIL", "your_recipient_email@gmail.com")
SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))

def create_allocation_breach_pdf(row, pdf_path):
    """
    Creates a PDF report for an allocation breach.
    """
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", 'B', 16)
    
    # Header
    pdf.set_text_color(200, 0, 0) # Red color for alert
    pdf.cell(0, 10, "ALLOCATION BREACH ALERT", ln=True, align="C")
    pdf.ln(10)

    pdf.set_text_color(0, 0, 0) # Reset to black
    pdf.set_font("Arial", '', 12)
    
    # Details
    pdf.cell(0, 8, f"Date Checked: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", ln=True)
    pdf.ln(5)
    
    pdf.set_font("Arial", 'B', 12)
    pdf.cell(0, 8, "Supplier Information:", ln=True)
    pdf.set_font("Arial", '', 12)
    pdf.cell(0, 8, f"Supplier Code: {row.get('SUPPLIER CODE', 'N/A')}", ln=True)
    pdf.cell(0, 8, f"Supplier Name: {row.get('SUPPLIER NAME', 'N/A')}", ln=True)
    
    pdf.ln(5)
    pdf.set_font("Arial", 'B', 12)
    pdf.cell(0, 8, "Material Details:", ln=True)
    pdf.set_font("Arial", '', 12)
    pdf.cell(0, 8, f"Material No: {row.get('MATERIAL NO', 'N/A')}", ln=True)
    pdf.cell(0, 8, f"Material Desc: {row.get('MATERIAL DESC', 'N/A')}", ln=True)
    
    pdf.ln(5)
    pdf.set_font("Arial", 'B', 12)
    pdf.cell(0, 8, "Breach Details:", ln=True)
    pdf.set_font("Arial", '', 12)
    
    # We must properly parse to str just in case it's a timestamp
    grn_str = str(row.get('GRN DATE', 'N/A'))[:10]
    
    pdf.cell(0, 8, f"GRN Date: {grn_str}", ln=True)
    pdf.cell(0, 8, f"Received Quantity: {row.get('RECEIVED QTY', 0)}", ln=True)
    pdf.cell(0, 8, f"Accepted Quantity: {row.get('ACCEPTED QTY', 0)}", ln=True)
    
    exceeded = int(row.get('ACCEPTED QTY', 0) - row.get('RECEIVED QTY', 0))
    pdf.set_font("Arial", 'B', 12)
    pdf.set_text_color(200, 0, 0)
    pdf.cell(0, 8, f"Exceeded Quantity: +{exceeded}", ln=True)

    # Make alerts directory if not exists
    os.makedirs(os.path.dirname(pdf_path), exist_ok=True)
    
    pdf.output(pdf_path)
    return pdf_path


def create_supplier_report_pdf(supplier_name: str, df, pdf_path: str):
    """
    Creates a full PDF report for a supplier covering all materials they supplied.
    df should already be filtered to just that supplier's rows from the GRN sheet.
    """
    pdf = FPDF(orientation="L", unit="mm", format="A4")  # Landscape for wide table
    pdf.add_page()

    # ── Header ────────────────────────────────────────────────────────────────
    pdf.set_font("Arial", "B", 18)
    pdf.set_text_color(30, 80, 160)
    pdf.cell(0, 12, "Supplier Performance Report", ln=True, align="C")

    pdf.set_font("Arial", "", 11)
    pdf.set_text_color(0, 0, 0)
    pdf.cell(0, 7, f"Supplier: {supplier_name}", ln=True, align="C")
    pdf.cell(0, 7, f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", ln=True, align="C")
    pdf.ln(6)

    # ── Summary KPIs ───────────────────────────────────────────────────────────
    total_received = int(df["RECEIVED QTY"].sum())
    total_accepted = int(df["ACCEPTED QTY"].sum())
    total_rejected = int(df["REJECTED QTY"].sum())
    rejection_rate = round((total_rejected / total_received * 100), 2) if total_received > 0 else 0
    total_invoice  = round(df["TOTAL INVOICE AMOUNT W/O TAX"].sum(), 2) if "TOTAL INVOICE AMOUNT W/O TAX" in df.columns else 0

    pdf.set_font("Arial", "B", 12)
    pdf.set_fill_color(30, 80, 160)
    pdf.set_text_color(255, 255, 255)
    pdf.cell(0, 9, " Summary", ln=True, fill=True)
    pdf.set_text_color(0, 0, 0)
    pdf.set_font("Arial", "", 11)

    kpis = [
        ("Total Received Qty",  f"{total_received:,}"),
        ("Total Accepted Qty",  f"{total_accepted:,}"),
        ("Total Rejected Qty",  f"{total_rejected:,}"),
        ("Rejection Rate",      f"{rejection_rate}%"),
        ("Total Invoice (W/O Tax)", f"Rs {total_invoice:,.2f}"),
    ]
    col_w = [90, 80]
    for label, value in kpis:
        pdf.set_font("Arial", "B", 11)
        pdf.cell(col_w[0], 8, f"  {label}", border=1)
        pdf.set_font("Arial", "", 11)
        pdf.cell(col_w[1], 8, f"  {value}", border=1, ln=True)
    pdf.ln(6)

    # ── Material-wise Breakdown ────────────────────────────────────────────────
    pdf.set_font("Arial", "B", 12)
    pdf.set_fill_color(30, 80, 160)
    pdf.set_text_color(255, 255, 255)
    pdf.cell(0, 9, " Material-wise Breakdown", ln=True, fill=True)
    pdf.set_text_color(0, 0, 0)

    mat_df = df.groupby(["MATERIAL NO", "MATERIAL DESC"], as_index=False).agg(
        RECEIVED_QTY=("RECEIVED QTY", "sum"),
        ACCEPTED_QTY=("ACCEPTED QTY", "sum"),
        REJECTED_QTY=("REJECTED QTY", "sum"),
    )
    mat_df["ACC_RATE"] = mat_df.apply(
        lambda r: round(r["ACCEPTED_QTY"] / r["RECEIVED_QTY"] * 100, 1) if r["RECEIVED_QTY"] > 0 else 0,
        axis=1,
    )

    headers = ["Material No", "Description", "Received", "Accepted", "Rejected", "Acc. Rate"]
    widths  = [40, 80, 30, 30, 30, 28]

    # Table header row
    pdf.set_font("Arial", "B", 10)
    pdf.set_fill_color(200, 215, 240)
    for h, w in zip(headers, widths):
        pdf.cell(w, 8, h, border=1, fill=True, align="C")
    pdf.ln()

    # Table data rows
    pdf.set_font("Arial", "", 10)
    fill = False
    for _, row in mat_df.iterrows():
        pdf.set_fill_color(240, 245, 255) if fill else pdf.set_fill_color(255, 255, 255)
        values = [
            str(row["MATERIAL NO"]),
            str(row["MATERIAL DESC"])[:35],
            str(int(row["RECEIVED_QTY"])),
            str(int(row["ACCEPTED_QTY"])),
            str(int(row["REJECTED_QTY"])),
            f"{row['ACC_RATE']}%",
        ]
        for val, w in zip(values, widths):
            pdf.cell(w, 7, val, border=1, fill=True)
        pdf.ln()
        fill = not fill
    pdf.ln(6)

    # ── GRN Date-wise Delivery Log ────────────────────────────────────────────
    pdf.set_font("Arial", "B", 12)
    pdf.set_fill_color(30, 80, 160)
    pdf.set_text_color(255, 255, 255)
    pdf.cell(0, 9, " Delivery Log (by GRN Date)", ln=True, fill=True)
    pdf.set_text_color(0, 0, 0)

    log_headers = ["GRN Date", "Material Desc", "Received", "Accepted", "Rejected", "Reason for Rejection"]
    log_widths  = [28, 90, 28, 28, 28, 68]

    pdf.set_font("Arial", "B", 10)
    pdf.set_fill_color(200, 215, 240)
    for h, w in zip(log_headers, log_widths):
        pdf.cell(w, 8, h, border=1, fill=True, align="C")
    pdf.ln()

    pdf.set_font("Arial", "", 9)
    fill = False
    for _, row in df.sort_values("GRN DATE").iterrows():
        pdf.set_fill_color(240, 245, 255) if fill else pdf.set_fill_color(255, 255, 255)
        grn_str = str(row.get("GRN DATE", ""))[:10]
        reason  = str(row.get("REASON FOR REJECTION", ""))[:40] if row.get("REJECTED QTY", 0) > 0 else "-"
        values = [
            grn_str,
            str(row.get("MATERIAL DESC", ""))[:42],
            str(int(row.get("RECEIVED QTY", 0))),
            str(int(row.get("ACCEPTED QTY", 0))),
            str(int(row.get("REJECTED QTY", 0))),
            reason,
        ]
        for val, w in zip(values, log_widths):
            pdf.cell(w, 6, val, border=1, fill=True)
        pdf.ln()
        fill = not fill

    os.makedirs(os.path.dirname(pdf_path), exist_ok=True)
    pdf.output(pdf_path)
    return pdf_path


def send_breach_email(subject, body, pdf_path):
    """
    Sends an email with the attached PDF report.
    """
    try:
        msg = EmailMessage()
        msg["Subject"] = subject
        msg["From"] = SENDER_EMAIL
        msg["To"] = RECIPIENT_EMAIL
        msg.set_content(body)

        with open(pdf_path, "rb") as f:
            msg.add_attachment(
                f.read(),
                maintype="application",
                subtype="pdf",
                filename=os.path.basename(pdf_path),
            )

        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            server.send_message(msg)
            
        print(f"Email successfully sent to {RECIPIENT_EMAIL} for {os.path.basename(pdf_path)}")
        return True
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False
