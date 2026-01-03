# Dayflow HRMS API Documentation

## Overview
This document describes the backend API endpoints for the Dayflow Human Resource Management System. The API provides functionality for authentication, employee management, attendance tracking, leave management, and payroll processing.

## Base URL
```
http://localhost:3000/api
```

## Authentication
All API endpoints (except login/register) require authentication. Include the following headers:
- `x-user-id`: The authenticated user's ID
- `x-user-role`: The user's role (admin, hr, employee)

## Endpoints

### Authentication

#### POST /api/auth/register
Register a new user (admin/HR only during company setup)

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "phone": "+1234567890",
  "companyName": "Acme Corp",
  "companyInitials": "AC"
}
```

**Response:**
```json
{
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "John Doe",
    "loginId": "AC-001-2024",
    "role": "admin",
    "company": "Acme Corp"
  },
  "token": "jwt-token"
}
```

#### POST /api/auth/login
Authenticate user and get access token

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "John Doe",
    "loginId": "AC-001-2024",
    "role": "admin",
    "company": "Acme Corp"
  },
  "token": "jwt-token"
}
```

### Employee Management

#### GET /api/employees
Get list of employees (Admin/HR only)

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `search`: Search by name, email, or employee ID
- `department`: Filter by department

**Response:**
```json
{
  "employees": [
    {
      "id": "user-id",
      "name": "John Doe",
      "email": "john@example.com",
      "employeeId": "EMP0001",
      "jobTitle": "Software Engineer",
      "department": "Engineering",
      "status": "present",
      "dateJoined": "2024-01-15",
      "phone": "+1234567890",
      "role": {
        "id": "role-id",
        "name": "employee"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

#### POST /api/employees
Create new employee (Admin/HR only)

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "password123",
  "phone": "+1234567890",
  "jobTitle": "HR Manager",
  "department": "Human Resources",
  "salary": 75000,
  "roleId": "role-id"
}
```

### Employee Profile

#### GET /api/employee/profile
Get employee profile

**Query Parameters:**
- `employeeId`: Get specific employee's profile (Admin/HR only)

**Response:**
```json
{
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "John Doe",
    "phone": "+1234567890",
    "address": "123 Main St",
    "employeeId": "EMP0001",
    "jobTitle": "Software Engineer",
    "department": "Engineering",
    "dateJoined": "2024-01-15",
    "salary": 80000,
    "avatarUrl": "https://example.com/avatar.jpg",
    "status": "present",
    "role": {
      "id": "role-id",
      "name": "employee"
    },
    "company": {
      "id": "company-id",
      "name": "Acme Corp",
      "initials": "AC"
    }
  }
}
```

#### PATCH /api/employee/profile
Update employee profile

**Request Body:**
```json
{
  "name": "John Updated",
  "phone": "+1234567890",
  "address": "456 New St"
}
```

### Attendance Management

#### GET /api/attendance
Get today's attendance status

**Response:**
```json
{
  "attendance": {
    "id": "attendance-id",
    "userId": "user-id",
    "checkIn": "2024-01-15T09:00:00Z",
    "checkOut": null,
    "date": "2024-01-15",
    "workHours": null,
    "extraHours": 0,
    "status": "present"
  }
}
```

#### POST /api/attendance
Check-in or check-out

**Request Body:**
```json
{
  "action": "check-in" // or "check-out"
}
```

#### GET /api/attendance/history
Get attendance history

**Query Parameters:**
- `month`: Month (1-12)
- `year`: Year (e.g., 2024)
- `employeeId`: Specific employee (Admin/HR only)

**Response:**
```json
{
  "attendances": [
    {
      "id": "attendance-id",
      "userId": "user-id",
      "checkIn": "2024-01-15T09:00:00Z",
      "checkOut": "2024-01-15T17:30:00Z",
      "date": "2024-01-15",
      "workHours": 8.5,
      "extraHours": 0.5,
      "status": "present",
      "remarks": null,
      "user": {
        "id": "user-id",
        "name": "John Doe",
        "email": "john@example.com",
        "employeeId": "EMP0001"
      }
    }
  ],
  "summary": {
    "totalDays": 22,
    "presentDays": 20,
    "absentDays": 1,
    "halfDays": 1,
    "leaveDays": 0,
    "totalWorkHours": 170,
    "totalExtraHours": 2
  }
}
```

### Leave Management

#### GET /api/leave
Get leave requests

**Query Parameters:**
- `status`: Filter by status (pending, approved, rejected)
- `employeeId`: Specific employee (Admin/HR only)

**Response:**
```json
{
  "leaveRequests": [
    {
      "id": "leave-id",
      "userId": "user-id",
      "startDate": "2024-01-20",
      "endDate": "2024-01-22",
      "leaveType": "paid",
      "reason": "Family vacation",
      "status": "pending",
      "approvedBy": null,
      "approvedAt": null,
      "remarks": null,
      "createdAt": "2024-01-10T10:00:00Z",
      "user": {
        "id": "user-id",
        "name": "John Doe",
        "email": "john@example.com",
        "employeeId": "EMP0001"
      }
    }
  ]
}
```

#### POST /api/leave
Apply for leave

**Request Body:**
```json
{
  "startDate": "2024-01-20",
  "endDate": "2024-01-22",
  "leaveType": "paid",
  "reason": "Family vacation"
}
```

#### PATCH /api/leave/[id]
Approve/reject leave request (Admin/HR only)

**Request Body:**
```json
{
  "status": "approved",
  "remarks": "Approved as requested"
}
```

#### GET /api/leave/balance
Get leave balance

**Query Parameters:**
- `employeeId`: Specific employee (Admin/HR only)

**Response:**
```json
{
  "leaveBalance": {
    "id": "balance-id",
    "userId": "user-id",
    "paidDaysLeft": 24,
    "sickDaysLeft": 7,
    "unpaidDaysLeft": 0,
    "year": 2024,
    "updatedAt": "2024-01-15T10:00:00Z"
  }
}
```

### Payroll Management

#### GET /api/payroll
Get payroll records

**Query Parameters:**
- `payPeriod`: Filter by pay period (e.g., "2024-01")
- `employeeId`: Specific employee (Admin/HR only)

**Response:**
```json
{
  "payrolls": [
    {
      "id": "payroll-id",
      "userId": "user-id",
      "basicSalary": 80000,
      "allowances": 5000,
      "deductions": 2000,
      "netSalary": 83000,
      "payPeriod": "2024-01",
      "status": "processed",
      "processedAt": "2024-01-31T10:00:00Z",
      "createdAt": "2024-01-01T00:00:00Z",
      "user": {
        "id": "user-id",
        "name": "John Doe",
        "email": "john@example.com",
        "employeeId": "EMP0001"
      }
    }
  ]
}
```

#### POST /api/payroll
Create payroll record (Admin/HR only)

**Request Body:**
```json
{
  "userId": "user-id",
  "basicSalary": 80000,
  "allowances": 5000,
  "deductions": 2000,
  "payPeriod": "2024-01"
}
```

### Dashboard

#### GET /api/dashboard
Get dashboard data

**Query Parameters:**
- `employeeId`: Specific employee (Admin/HR only)

**Response:**
```json
{
  "user": {
    "id": "user-id",
    "name": "John Doe",
    "email": "john@example.com",
    "employeeId": "EMP0001",
    "jobTitle": "Software Engineer",
    "department": "Engineering",
    "status": "present",
    "avatarUrl": "https://example.com/avatar.jpg"
  },
  "attendanceSummary": {
    "totalDays": 22,
    "presentDays": 20,
    "absentDays": 1,
    "halfDays": 1,
    "leaveDays": 0,
    "totalWorkHours": 170,
    "totalExtraHours": 2
  },
  "leaveBalance": {
    "paidDaysLeft": 24,
    "sickDaysLeft": 7,
    "unpaidDaysLeft": 0
  },
  "recentLeaveRequests": [],
  "recentPayroll": [],
  "adminData": {
    "totalEmployees": 25,
    "pendingLeaveRequests": 3,
    "todayAttendances": 20,
    "presentToday": 18,
    "absentToday": 2
  }
}
```

## Error Responses

All endpoints return appropriate HTTP status codes:

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `404`: Not Found
- `409`: Conflict
- `500`: Internal Server Error

Error response format:
```json
{
  "error": "Error message description"
}
```

## Notes

1. All datetime fields are in ISO 8601 format
2. Pagination starts from page 1
3. Search is case-insensitive
4. Admin/HR users can access all employee data
5. Employees can only access their own data
6. Leave balance is automatically created for new employees
7. Work hours are calculated automatically during check-out
