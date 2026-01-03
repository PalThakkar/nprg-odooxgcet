#!/bin/bash

echo "🧪 Manual Testing Script for Dayflow HRMS Backend"
echo "================================================"

# Configuration
BASE_URL="http://localhost:3000"
ADMIN_EMAIL="admin@test.com"
ADMIN_PASSWORD="admin123"
EMP_EMAIL="employee@test.com"
EMP_PASSWORD="emp123"

echo ""
echo "⚠️  Make sure your server is running on $BASE_URL"
echo "⚠️  Make sure you've run the database migration"
echo ""

# Function to test endpoint
test_endpoint() {
    local method=$1
    local url=$2
    local data=$3
    local headers=$4
    local description=$5
    
    echo "Testing: $description"
    echo "$method $url"
    
    if [ -n "$data" ]; then
        if [ -n "$headers" ]; then
            response=$(curl -s -w "\n%{http_code}" -X $method "$url" -H "Content-Type: application/json" $headers -d "$data")
        else
            response=$(curl -s -w "\n%{http_code}" -X $method "$url" -H "Content-Type: application/json" -d "$data")
        fi
    else
        if [ -n "$headers" ]; then
            response=$(curl -s -w "\n%{http_code}" -X $method "$url" $headers)
        else
            response=$(curl -s -w "\n%{http_code}" -X $method "$url")
        fi
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" -eq 200 ] || [ "$http_code" -eq 201 ]; then
        echo "✅ SUCCESS (HTTP $http_code)"
    else
        echo "❌ FAILED (HTTP $http_code)"
        echo "Response: $body"
    fi
    echo ""
}

# Test 1: Server connectivity
echo "🔍 Step 1: Testing Server Connectivity"
test_endpoint "GET" "$BASE_URL/api/auth/login" "" "" "Server connectivity"

# Test 2: User Registration
echo "🔍 Step 2: Testing User Registration"
register_data='{
    "email": "'$ADMIN_EMAIL'",
    "password": "'$ADMIN_PASSWORD'",
    "name": "Admin User",
    "phone": "+1234567890",
    "companyName": "Test Company",
    "companyInitials": "TC"
}'
test_endpoint "POST" "$BASE_URL/api/auth/register" "$register_data" "" "Admin registration"

# Test 3: User Login
echo "🔍 Step 3: Testing User Login"
login_data='{
    "email": "'$ADMIN_EMAIL'",
    "password": "'$ADMIN_PASSWORD'"
}'
login_response=$(curl -s -X POST "$BASE_URL/api/auth/login" -H "Content-Type: application/json" -d "$login_data")
admin_token=$(echo "$login_response" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
admin_id=$(echo "$login_response" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)

if [ -n "$admin_token" ]; then
    echo "✅ Login successful, token received"
else
    echo "❌ Login failed"
fi
echo ""

# Test 4: Create Employee
echo "🔍 Step 4: Testing Employee Creation"
emp_data='{
    "name": "John Doe",
    "email": "'$EMP_EMAIL'",
    "password": "'$EMP_PASSWORD'",
    "phone": "+1234567890",
    "jobTitle": "Software Engineer",
    "department": "Engineering",
    "salary": 75000
}'
test_endpoint "POST" "$BASE_URL/api/employees" "$emp_data" "-H \"x-user-id: $admin_id\" -H \"x-user-role: admin\"" "Employee creation"

# Test 5: Employee Login
echo "🔍 Step 5: Testing Employee Login"
emp_login_data='{
    "email": "'$EMP_EMAIL'",
    "password": "'$EMP_PASSWORD'"
}'
emp_login_response=$(curl -s -X POST "$BASE_URL/api/auth/login" -H "Content-Type: application/json" -d "$emp_login_data")
emp_token=$(echo "$emp_login_response" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
emp_id=$(echo "$emp_login_response" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)

if [ -n "$emp_token" ]; then
    echo "✅ Employee login successful"
else
    echo "❌ Employee login failed"
fi
echo ""

# Test 6: Get Employee Profile
echo "🔍 Step 6: Testing Employee Profile"
test_endpoint "GET" "$BASE_URL/api/employee/profile" "" "-H \"x-user-id: $emp_id\" -H \"x-user-role: employee\"" "Get employee profile"

# Test 7: Attendance Check-in
echo "🔍 Step 7: Testing Attendance Check-in"
checkin_data='{"action": "check-in"}'
test_endpoint "POST" "$BASE_URL/api/attendance" "$checkin_data" "-H \"x-user-id: $emp_id\" -H \"x-user-role: employee\"" "Check-in"

# Test 8: Get Leave Balance
echo "🔍 Step 8: Testing Leave Balance"
test_endpoint "GET" "$BASE_URL/api/leave/balance" "" "-H \"x-user-id: $emp_id\" -H \"x-user-role: employee\"" "Get leave balance"

# Test 9: Apply for Leave
echo "🔍 Step 9: Testing Leave Application"
leave_data='{
    "startDate": "2024-01-20",
    "endDate": "2024-01-22",
    "leaveType": "paid",
    "reason": "Testing leave application"
}'
test_endpoint "POST" "$BASE_URL/api/leave" "$leave_data" "-H \"x-user-id: $emp_id\" -H \"x-user-role: employee\"" "Apply for leave"

# Test 10: Get Dashboard
echo "🔍 Step 10: Testing Dashboard"
test_endpoint "GET" "$BASE_URL/api/dashboard" "" "-H \"x-user-id: $emp_id\" -H \"x-user-role: employee\"" "Employee dashboard"

# Test 11: Admin Dashboard
echo "🔍 Step 11: Testing Admin Dashboard"
test_endpoint "GET" "$BASE_URL/api/dashboard" "" "-H \"x-user-id: $admin_id\" -H \"x-user-role: admin\"" "Admin dashboard"

echo "🎉 Manual Testing Complete!"
echo ""
echo "📋 Summary:"
echo "- If all tests show ✅ SUCCESS, your backend is working perfectly"
echo "- If any test shows ❌ FAILED, check the error response and troubleshoot"
echo "- Refer to MANUAL_TESTING_GUIDE.md for detailed troubleshooting steps"
echo ""
echo "🔗 Next Steps:"
echo "1. Test with Postman for more detailed API testing"
echo "2. Connect your frontend application"
echo "3. Run comprehensive tests using VERIFICATION_CHECKLIST.md"
