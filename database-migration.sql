-- Dayflow HRMS Database Migration
-- Run this script in your PostgreSQL database

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

-- Insert default roles if they don't exist
INSERT INTO roles (id, name, description) 
VALUES 
    ('admin-role-id', 'admin', 'Company Administrator'),
    ('hr-role-id', 'hr', 'HR Manager'),
    ('employee-role-id', 'employee', 'Regular Employee')
ON CONFLICT (name) DO NOTHING;

-- Create initial leave balances for existing users
INSERT INTO leave_balances (id, user_id, year)
SELECT 
    gen_random_uuid()::text,
    id,
    EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER
FROM users 
WHERE id NOT IN (SELECT user_id FROM leave_balances)
ON CONFLICT (user_id) DO NOTHING;

-- Update existing users with default values if needed
UPDATE users SET 
    employee_id = COALESCE(employee_id, 'EMP' || LPAD(id::text, 4, '0')),
    date_joined = COALESCE(date_joined, created_at),
    status = COALESCE(status, 'active')
WHERE employee_id IS NULL OR date_joined IS NULL OR status IS NULL;

COMMIT;
