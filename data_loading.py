import pandas as pd
from sqlalchemy import create_engine, text
from tqdm import tqdm

# Load CSV
csv_file = "books.csv"
df = pd.read_csv(csv_file)

# Check for duplicates in the 'book_id' column
duplicates = df[df.duplicated(subset='book_id', keep=False)]
print(f"Found {len(duplicates)} duplicate rows:")
print(duplicates)

# Drop duplicates based on 'book_id' column
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

# Insert data with duplicate check using chunks
print("Uploading data to Azure SQL...")

try:
    # Use chunksize for batch uploading
    df.to_sql('Books', engine, if_exists='append', index=False, chunksize=1000)

    print("Data upload completed successfully!")
except Exception as e:
    print(f"Error occurred: {e}")
