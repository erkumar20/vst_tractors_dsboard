import pandas as pd
import os

# Global variables to hold our DataFrames
grn_df = None
sob_df = None

def load_data():
    global grn_df, sob_df
    
    # Path to the data file. The file was moved inside the backend/data directory.
    base_dir = os.path.dirname(os.path.abspath(__file__))
    excel_path = os.path.join(base_dir, "data", "sob_deviation.xlsx")
    
    if not os.path.exists(excel_path):
        print(f"Warning: Excel file not found at {excel_path}. Creating empty DataFrames.")
        grn_df = pd.DataFrame()
        sob_df = pd.DataFrame()
        return

    try:
        # Load GRN Data
        grn_df = pd.read_excel(excel_path, sheet_name="GRN ")
        
        # Strip whitespace from column names for easier access
        grn_df.columns = grn_df.columns.str.strip()
        
        # Ensure date columns are datetime
        grn_df["GRN DATE"] = pd.to_datetime(grn_df["GRN DATE"], errors='coerce')
        grn_df["SUPPLIER INVOICE DATE"] = pd.to_datetime(grn_df["SUPPLIER INVOICE DATE"], errors='coerce')
        
    except Exception as e:
        print(f"Error loading GRN sheet: {e}")
        grn_df = pd.DataFrame()

    try:
        # Load SOB (Schedule of Business / Allocations) Data
        sob_df = pd.read_excel(excel_path, sheet_name="SOB ")
        
        # Strip whitespace from column names
        sob_df.columns = sob_df.columns.str.strip()
        
        # Ensure date columns are datetime
        sob_df["Valid from"] = pd.to_datetime(sob_df["Valid from"], errors='coerce')
        sob_df["Valid to"] = pd.to_datetime(sob_df["Valid to"], errors='coerce')
        
    except Exception as e:
        print(f"Error loading SOB sheet: {e}")
        sob_df = pd.DataFrame()

    print(f"Data Loaded Successfully. GRN rows: {len(grn_df)}, SOB rows: {len(sob_df)}")

def get_grn_df():
    global grn_df
    if grn_df is None or grn_df.empty:
        load_data()
    return grn_df.copy() if grn_df is not None else pd.DataFrame()

def get_sob_df():
    global sob_df
    if sob_df is None or sob_df.empty:
        load_data()
    return sob_df.copy() if sob_df is not None else pd.DataFrame()
