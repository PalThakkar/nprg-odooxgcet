-- Add new fields to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS employee_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS job_title TEXT,
ADD COLUMN IF NOT EXISTS department TEXT,
ADD COLUMN IF NOT EXISTS date_joined TIMESTAMP,
ADD COLUMN IF NOT EXISTS salary DOUBLE PRECISION;

-- Add new fields to attendances table  
ALTER TABLE attendances
ADD COLUMN IF NOT EXISTS work_hours DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS extra_hours DOUBLE PRECISION DEFAULT 0,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'present',
ADD COLUMN IF NOT EXISTS remarks TEXT;

-- Create leave_requests table
CREATE TABLE IF NOT EXISTS leave_requests (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    leave_type TEXT NOT NULL,
    reason TEXT,
    status TEXT DEFAULT 'pending',
    approved_by TEXT,
    approved_at TIMESTAMP,
    remarks TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create leave_balances table
CREATE TABLE IF NOT EXISTS leave_balances (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL UNIQUE,
    paid_days_left INTEGER DEFAULT 24,
    sick_days_left INTEGER DEFAULT 7,
    unpaid_days_left INTEGER DEFAULT 0,
    year INTEGER DEFAULT 2025,
    updated_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create payrolls table
CREATE TABLE IF NOT EXISTS payrolls (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    basic_salary DOUBLE PRECISION NOT NULL,
    allowances DOUBLE PRECISION DEFAULT 0,
    deductions DOUBLE PRECISION DEFAULT 0,
    net_salary DOUBLE PRECISION NOT NULL,
    pay_period TEXT NOT NULL,
    status TEXT DEFAULT 'draft',
    processed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_leave_requests_user_id ON leave_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_leave_requests_status ON leave_requests(status);
CREATE INDEX IF NOT EXISTS idx_attendances_user_date ON attendances(user_id, date);
CREATE INDEX IF NOT EXISTS idx_payrolls_user_period ON payrolls(user_id, pay_period);
