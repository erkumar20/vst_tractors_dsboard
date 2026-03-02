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
    
    rejected = row.get('RECEIVED QTY', 0) - row.get('ACCEPTED QTY', 0)
    pdf.set_font("Arial", 'B', 12)
    pdf.set_text_color(200, 0, 0)
    pdf.cell(0, 8, f"Rejected / Shortfall Quantity: {rejected}", ln=True)

    # Make alerts directory if not exists
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
