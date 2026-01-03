@echo off
echo 🧪 Manual Testing Script for Dayflow HRMS Backend
echo ================================================

REM Configuration
set BASE_URL=http://localhost:3000
set ADMIN_EMAIL=admin@test.com
set ADMIN_PASSWORD=admin123
set EMP_EMAIL=employee@test.com
set EMP_PASSWORD=emp123

echo.
echo ⚠️  Make sure your server is running on %BASE_URL%
echo ⚠️  Make sure you've run the database migration
echo.

REM Test 1: Server connectivity
echo 🔍 Step 1: Testing Server Connectivity
curl -s -o nul -w "%%{http_code}" "%BASE_URL%/api/auth/login"
if errorlevel 1 (
    echo ❌ Server not responding
    goto :error
) else (
    echo ✅ Server is responding
)
echo.

REM Test 2: User Registration
echo 🔍 Step 2: Testing User Registration
curl -s -X POST "%BASE_URL%/api/auth/register" ^
  -H "Content-Type: application/json" ^
  -d "{\"email\": \"%ADMIN_EMAIL%\", \"password\": \"%ADMIN_PASSWORD%\", \"name\": \"Admin User\", \"phone\": \"+1234567890\", \"companyName\": \"Test Company\", \"companyInitials\": \"TC\"}" ^
  -o nul -w "%%{http_code}"
if errorlevel 1 (
    echo ❌ Registration failed
) else (
    echo ✅ Registration successful
)
echo.

REM Test 3: User Login
echo 🔍 Step 3: Testing User Login
curl -s -X POST "%BASE_URL%/api/auth/login" ^
  -H "Content-Type: application/json" ^
  -d "{\"email\": \"%ADMIN_EMAIL%\", \"password\": \"%ADMIN_PASSWORD%\"}" ^
  -o temp_response.json
if errorlevel 1 (
    echo ❌ Login failed
    goto :error
) else (
    echo ✅ Login successful
)
echo.

REM Test 4: Get Employee Profile
echo 🔍 Step 4: Testing Employee Profile
curl -s -X GET "%BASE_URL%/api/employee/profile" ^
  -H "x-user-id: test-id" ^
  -H "x-user-role: employee" ^
  -o nul -w "%%{http_code}"
if errorlevel 1 (
    echo ❌ Profile test failed
) else (
    echo ✅ Profile endpoint responding
)
echo.

REM Test 5: Attendance Check-in
echo 🔍 Step 5: Testing Attendance Check-in
curl -s -X POST "%BASE_URL%/api/attendance" ^
  -H "Content-Type: application/json" ^
  -H "x-user-id: test-id" ^
  -H "x-user-role: employee" ^
  -d "{\"action\": \"check-in\"}" ^
  -o nul -w "%%{http_code}"
if errorlevel 1 (
    echo ❌ Check-in failed
) else (
    echo ✅ Check-in endpoint responding
)
echo.

REM Test 6: Leave Balance
echo 🔍 Step 6: Testing Leave Balance
curl -s -X GET "%BASE_URL%/api/leave/balance" ^
  -H "x-user-id: test-id" ^
  -H "x-user-role: employee" ^
  -o nul -w "%%{http_code}"
if errorlevel 1 (
    echo ❌ Leave balance failed
) else (
    echo ✅ Leave balance endpoint responding
)
echo.

REM Test 7: Dashboard
echo 🔍 Step 7: Testing Dashboard
curl -s -X GET "%BASE_URL%/api/dashboard" ^
  -H "x-user-id: test-id" ^
  -H "x-user-role: employee" ^
  -o nul -w "%%{http_code}"
if errorlevel 1 (
    echo ❌ Dashboard failed
) else (
    echo ✅ Dashboard endpoint responding
)
echo.

REM Cleanup
del temp_response.json 2>nul

echo 🎉 Basic Manual Testing Complete!
echo.
echo 📋 Summary:
echo - If all tests show ✅, your backend endpoints are responding
echo - For detailed testing, use MANUAL_TESTING_GUIDE.md
echo.
echo 🔗 Next Steps:
echo 1. Test with Postman for detailed API validation
echo 2. Connect your frontend application
echo 3. Run comprehensive tests using VERIFICATION_CHECKLIST.md
echo.
goto :end

:error
echo.
echo ❌ Testing failed. Please check:
echo - Server is running on %BASE_URL%
echo - Database migration has been applied
echo - All dependencies are installed
echo.

:end
pause
