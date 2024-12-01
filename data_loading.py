import pandas as pd
from sqlalchemy import create_engine, text
import pyodbc
from tqdm import tqdm

# Load CSV
csv_file = "books.csv"
df = pd.read_csv(csv_file)

# Check for duplicates in the 'book_id' column
duplicates = df[df.duplicated(subset='book_id', keep=False)]
print(f"Found {len(duplicates)} duplicate rows:")
print(duplicates)

df = df.drop_duplicates(subset='book_id', keep='first')

# Azure SQL Connection String
server = 'apiserverik.database.windows.net'
database = 'BookRecommendationsDB'
username = 'tomitimko'
password = 'Timkotomi%'
driver = 'ODBC Driver 18 for SQL Server'
connection_string = f'mssql+pyodbc://{username}:{password}@{server}/{database}?driver={driver}'

# Create SQLAlchemy engine
engine = create_engine(connection_string)

# Insert data with duplicate check
print("Uploading data to Azure SQL...")
try:
    with engine.connect() as conn:
        for _, row in tqdm(df.iterrows(), total=len(df), desc="Uploading rows"):
            # Parameterized query to check for duplicates
            check_query = text("SELECT 1 FROM Books WHERE book_id = :book_id")
            result = conn.execute(check_query, {"book_id": row['book_id']}).fetchone()

            # Skip if book_id already exists
            if result:
                continue

            # Insert the row
            row_df = pd.DataFrame([row])  # Convert row to DataFrame
            row_df.to_sql('Books', conn, if_exists='append', index=False)
    print("Data upload completed successfully!")
except Exception as e:
    print(f"Error occurred: {e}")