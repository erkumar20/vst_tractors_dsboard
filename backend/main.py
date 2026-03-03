from fastapi import FastAPI
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

@app.get("/")
def read_root():
    return {"message": "Welcome to the Supply Chain KPI Intelligence API"}
