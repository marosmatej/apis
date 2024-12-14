import sqlite3

# Connect to the database
conn = sqlite3.connect('books.db')
cursor = conn.cursor()

# List all tables
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = cursor.fetchall()
print("Tables in the database:")
for table in tables:
    print(table[0])

# Describe each table and query data
for table in tables:
    table_name = table[0]
    print(f"\nSchema for table {table_name}:")
    cursor.execute(f"PRAGMA table_info({table_name});")
    schema = cursor.fetchall()
    for column in schema:
        print(column)

    # Print column names
    column_names = [column[1] for column in schema]
    print(f"\nColumn names for table {table_name}: {', '.join(column_names)}")

    print(f"\nData from table {table_name}:")
    cursor.execute(f"SELECT * FROM {table_name} LIMIT 5;")
    rows = cursor.fetchall()
    for row in rows:
        print(row)

# Close the connection
conn.close()