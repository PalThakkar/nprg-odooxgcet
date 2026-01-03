@echo off
echo PostgreSQL Migration Script
echo =========================
echo.
echo Step 1: Find your PostgreSQL installation
echo Common locations:
echo - C:\Program Files\PostgreSQL\16\bin
echo - C:\Program Files\PostgreSQL\15\bin  
echo - C:\Program Files\PostgreSQL\14\bin
echo.
echo Step 2: Navigate to PostgreSQL bin directory
echo Example: cd "C:\Program Files\PostgreSQL\16\bin"
echo.
echo Step 3: Run the migration
echo Replace YOUR_DB_NAME with your actual database name
echo.
echo Common database names to try:
echo - postgres
echo - dayflow_hrms
echo - hrms
echo - test
echo.
echo Command examples:
echo psql -U postgres -d postgres < "c:\ODOOxGCET\NPRG-OdooXGcet\database-migration.sql"
echo psql -U postgres -d dayflow_hrms < "c:\ODOOxGCET\NPRG-OdooXGcet\database-migration.sql"
echo.
echo If you don't know your database name, try "postgres" first
echo.
pause
