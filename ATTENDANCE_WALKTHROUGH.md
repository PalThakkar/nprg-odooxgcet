# Attendance Tracking System & Admin Settings

I have implemented a comprehensive Attendance Tracking system with advanced status logic (Late, Half-day) and an Admin Configuration panel.

## Features Implemented

### 1. Admin Settings Panel (NEW)

**Path:** `app/admin/settings/page.tsx`

- **Configure Policies:** Admins can now start the official work day time, standard work hours, and grace periods.
  - **Shift Start Time:** e.g., "09:00"
  - **Grace Period:** e.g., 15 minutes
  - **Work Hours:** e.g., 9 hours
- These settings directly impact how employee attendance is graded.

### 2. Advanced Attendance Logic

- **Automated Late Marking:**
  - If an employee checks in *after* (Shift Start Time + Grace Period), they are automatically marked as **'Late'**.
- **Automated Half-day Marking:**
  - If an employee's total work duration is less than **50% of Standard Work Hours**, they are automatically marked as **'Half-day'** upon checkout.

### 3. Employee Attendance Portal

**Path:** `app/employees/attendance/page.tsx`

- **Real-time Check-in/Check-out:** Seamless state updates.
- **Smart Status Badges:** Visual indicators for Present, Late, Half-day, and Checked-out statuses.
- **Live Timer:** Shows duration since check-in.

### 4. Admin Attendance Dashboard

**Path:** `app/admin/attendance/page.tsx`

- **Daily Overview:** View attendance status for ALL employees for any selected date.
- **Real-time Status:** Updates based on Check-in/out and Leave data.
- **Leave Integration:** Automatically detects 'On Leave' status.

## Visuals & Verification

### Database Changes

- Added `startTime`, `workHours`, `gracePeriod` to `Company` model.
- Synced with `npx prisma db push`.

### Type Safety

- All new code is strictly typed.
- `npx tsc --noEmit` checks passed.

## Next Steps

- Verify the flow by changing settings in Admin Panel and checking in as an employee.
