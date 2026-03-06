import os
import shutil
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from data_loader import load_data
from routers import kpis, chat, reports

# Initialize FastAPI app
app = FastAPI(title="Supply Chain KPI Intelligence API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load data on startup
@app.on_event("startup")
def startup_event():
    load_data()

# Include routers
app.include_router(kpis.router, prefix="/api", tags=["KPIs"])
app.include_router(chat.router, prefix="/api", tags=["Chat"])
app.include_router(reports.router, prefix="/api", tags=["Reports"])

@app.post("/api/upload-dataset", tags=["Data Management"])
async def upload_dataset(file: UploadFile = File(...)):
    """
    Upload a new Excel dataset (must have GRN and SOB sheets).
    This will overwrite the existing dataset and refresh memory immediately.
    """
    if not file.filename.endswith(".xlsx"):
        return {"error": "Only .xlsx files are supported."}
        
    base_dir = os.path.dirname(os.path.abspath(__file__))
    data_dir = os.path.join(base_dir, "data")
    os.makedirs(data_dir, exist_ok=True)
    
    file_path = os.path.join(data_dir, "sob_deviation.xlsx")
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # Trigger a real-time data reload in the pandas DataFrames
    load_data()
    
    return {"message": "Dataset successfully uploaded and data refreshed!", "filename": file.filename}

@app.get("/")
def read_root():
    return {"message": "Welcome to the Supply Chain KPI Intelligence API"}
