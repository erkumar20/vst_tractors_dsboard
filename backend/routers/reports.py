from fastapi import APIRouter, Query, HTTPException
from fastapi.responses import FileResponse
import os

router = APIRouter()

# ── PDF Download ────────────────────────────────────────────────────────────

@router.get("/reports/download")
def download_report(path: str = Query(..., description="Absolute path to the PDF file")):
    """Serves a generated PDF report as a file download."""
    reports_dir = os.path.realpath(
        os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "reports")
    )
    # Strip literal quotes that might be accidentally included from Swagger copy/paste
    clean_path = path.strip('"').strip("'")
    real_path = os.path.realpath(clean_path)
    if not real_path.startswith(reports_dir):
        raise HTTPException(status_code=403, detail="Access denied.")
    if not os.path.exists(real_path):
        raise HTTPException(status_code=404, detail="Report not found. Generate it first via the chatbot.")
    return FileResponse(real_path, media_type="application/pdf", filename=os.path.basename(real_path))


@router.get("/reports/list")
def list_reports():
    """Lists all previously generated supplier PDF reports."""
    reports_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "reports")
    os.makedirs(reports_dir, exist_ok=True)
    files = [f for f in os.listdir(reports_dir) if f.endswith(".pdf")]
    return {"reports": files, "count": len(files), "download_base_url": "/api/reports/download?path="}


# ── Excel Download ───────────────────────────────────────────────────────────

@router.get("/reports/download-excel")
def download_excel(path: str = Query(..., description="Absolute path to the Excel file")):
    """Serves a generated Excel export as a file download."""
    exports_dir = os.path.realpath(
        os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "exports")
    )
    # Strip literal quotes that might be accidentally included from Swagger copy/paste
    clean_path = path.strip('"').strip("'")
    real_path = os.path.realpath(clean_path)
    if not real_path.startswith(exports_dir):
        raise HTTPException(status_code=403, detail="Access denied.")
    if not os.path.exists(real_path):
        raise HTTPException(status_code=404, detail="Excel file not found. Generate it first via the chatbot.")
    return FileResponse(
        real_path,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        filename=os.path.basename(real_path)
    )


@router.get("/reports/list-exports")
def list_exports():
    """Lists all previously generated Excel export files."""
    exports_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "exports")
    os.makedirs(exports_dir, exist_ok=True)
    files = [f for f in os.listdir(exports_dir) if f.endswith(".xlsx")]
    return {"exports": files, "count": len(files), "download_base_url": "/api/reports/download-excel?path="}
