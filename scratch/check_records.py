import sqlite3

conn = sqlite3.connect('database.db')
cursor = conn.cursor()
cursor.execute("SELECT month, allocation, expenditure FROM pol_monthly_records WHERE fiscal_year = '2025-26' AND unit_name = 'HQ 55 Arty Bde' AND pol_grade = 'Diesel'")
for row in cursor.fetchall():
    print(row)
conn.close()
