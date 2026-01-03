const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

class ApiClient {
  private getAuthHeaders() {
    if (typeof window === 'undefined') return {};
    
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('userRole');
    
    const headers: Record<string, string> = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    if (userId) {
      headers['x-user-id'] = userId;
    }
    if (userRole) {
      headers['x-user-role'] = userRole;
    }
    
    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...this.getAuthHeaders(),
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication
  async login(email: string, password: string) {
    const response = await this.post<{ user: any; token: string }>('/auth/login', {
      email,
      password,
    });
    
    // Store auth data
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', response.token);
      localStorage.setItem('userId', response.user.id);
      localStorage.setItem('userRole', response.user.role);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  }

  async register(data: {
    email: string;
    password: string;
    name: string;
    phone: string;
    companyName: string;
    companyInitials: string;
  }) {
    const response = await this.post<{ user: any; token: string }>('/auth/register', data);
    
    // Store auth data
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', response.token);
      localStorage.setItem('userId', response.user.id);
      localStorage.setItem('userRole', response.user.role);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  }

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('userRole');
      localStorage.removeItem('user');
    }
  }

  // Employee Management
  async getEmployees(params?: {
    page?: number;
    limit?: number;
    search?: string;
    department?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.search) searchParams.set('search', params.search);
    if (params?.department) searchParams.set('department', params.department);

    return this.get(`/employees?${searchParams.toString()}`);
  }

  async createEmployee(data: {
    name: string;
    email: string;
    password: string;
    phone: string;
    jobTitle: string;
    department: string;
    salary: number;
    roleId: string;
  }) {
    return this.post('/employees', data);
  }

  // Profile Management
  async getProfile(employeeId?: string) {
    const searchParams = employeeId ? `?employeeId=${employeeId}` : '';
    return this.get(`/employee/profile${searchParams}`);
  }

  async updateProfile(data: {
    name?: string;
    phone?: string;
    address?: string;
    avatarUrl?: string;
    jobTitle?: string;
    department?: string;
    salary?: number;
  }) {
    return this.patch('/employee/profile', data);
  }

  // Attendance Management
  async getTodayAttendance() {
    return this.get('/attendance');
  }

  async checkIn() {
    return this.post('/attendance', { action: 'check-in' });
  }

  async checkOut() {
    return this.post('/attendance', { action: 'check-out' });
  }

  async getAttendanceHistory(params?: {
    month?: number;
    year?: number;
    employeeId?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.month) searchParams.set('month', params.month.toString());
    if (params?.year) searchParams.set('year', params.year.toString());
    if (params?.employeeId) searchParams.set('employeeId', params.employeeId);

    return this.get(`/attendance/history?${searchParams.toString()}`);
  }

  // Leave Management
  async getLeaveRequests(params?: {
    status?: string;
    employeeId?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.set('status', params.status);
    if (params?.employeeId) searchParams.set('employeeId', params.employeeId);

    return this.get(`/leave?${searchParams.toString()}`);
  }

  async applyForLeave(data: {
    startDate: string;
    endDate: string;
    leaveType: string;
    reason?: string;
  }) {
    return this.post('/leave', data);
  }

  async updateLeaveRequest(leaveId: string, data: {
    status: 'approved' | 'rejected';
    remarks?: string;
  }) {
    return this.patch(`/leave/${leaveId}`, data);
  }

  async getLeaveBalance(employeeId?: string) {
    const searchParams = employeeId ? `?employeeId=${employeeId}` : '';
    return this.get(`/leave/balance${searchParams}`);
  }

  // Payroll Management
  async getPayroll(params?: {
    payPeriod?: string;
    employeeId?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.payPeriod) searchParams.set('payPeriod', params.payPeriod);
    if (params?.employeeId) searchParams.set('employeeId', params.employeeId);

    return this.get(`/payroll?${searchParams.toString()}`);
  }

  async createPayroll(data: {
    userId: string;
    basicSalary: number;
    allowances?: number;
    deductions?: number;
    payPeriod: string;
  }) {
    return this.post('/payroll', data);
  }

  // Dashboard
  async getDashboardData(employeeId?: string) {
    const searchParams = employeeId ? `?employeeId=${employeeId}` : '';
    return this.get(`/dashboard${searchParams}`);
  }

  // Generic HTTP methods
  private get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  private post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  private patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  private put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  private delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
