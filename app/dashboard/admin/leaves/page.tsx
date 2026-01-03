'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LeaveRequest {
    id: string;
    type: string;
    startDate: string;
    endDate: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    reason: string;
    adminComment: string | null;
    user: {
        name: string;
        email: string;
        loginId: string;
    };
}

export default function AdminLeaveDashboard() {
    const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [processingId, setProcessingId] = useState<string | null>(null);

    useEffect(() => {
        fetchLeaves();
    }, []);

    const fetchLeaves = async () => {
        try {
            const res = await fetch('/api/leaves/admin');
            const data = await res.json();
            if (Array.isArray(data)) {
                setLeaves(data);
            }
        } catch (error) {
            console.error('Error fetching leaves:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id: string, status: 'APPROVED' | 'REJECTED', comment: string) => {
        setProcessingId(id);
        try {
            const res = await fetch(`/api/leaves/admin/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status, adminComment: comment })
            });
            if (res.ok) {
                setLeaves(prev => prev.map(l => l.id === id ? { ...l, status, adminComment: comment } : l));
            }
        } catch (error) {
            console.error('Error updating leave:', error);
        } finally {
            setProcessingId(null);
        }
    };

    const filteredLeaves = leaves.filter(l =>
        l.user.name.toLowerCase().includes(filter.toLowerCase()) ||
        l.user.loginId.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="space-y-6 container mx-auto p-6 max-w-7xl animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Leave Management</h1>
                    <p className="text-muted-foreground mt-1">Review and approve employee leave requests.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Input
                        placeholder="Search by name or ID..."
                        className="w-[250px]"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total Pending" count={leaves.filter(l => l.status === 'PENDING').length} color="text-yellow-600 bg-yellow-50" />
                <StatCard title="Approved" count={leaves.filter(l => l.status === 'APPROVED').length} color="text-green-600 bg-green-50" />
                <StatCard title="Rejected" count={leaves.filter(l => l.status === 'REJECTED').length} color="text-red-600 bg-red-50" />
            </div>

            <Card className="border-none shadow-xl glass">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-muted/50 border-b">
                                    <th className="p-4 font-semibold">Employee</th>
                                    <th className="p-4 font-semibold">Type</th>
                                    <th className="p-4 font-semibold">Dates</th>
                                    <th className="p-4 font-semibold">Reason</th>
                                    <th className="p-4 font-semibold">Status</th>
                                    <th className="p-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {loading ? (
                                    <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">Loading requests...</td></tr>
                                ) : filteredLeaves.length === 0 ? (
                                    <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No leave requests found.</td></tr>
                                ) : (
                                    filteredLeaves.map((leave) => (
                                        <LeaveRow
                                            key={leave.id}
                                            leave={leave}
                                            onAction={handleAction}
                                            isProcessing={processingId === leave.id}
                                        />
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function StatCard({ title, count, color }: { title: string, count: number, color: string }) {
    return (
        <Card className="border-none shadow-lg">
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-muted-foreground uppercase">{title}</p>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${color}`}>
                        {count}
                    </span>
                </div>
                <p className="text-3xl font-bold mt-2">{count}</p>
            </CardContent>
        </Card>
    );
}

function LeaveRow({ leave, onAction, isProcessing }: {
    leave: LeaveRequest,
    onAction: (id: string, status: 'APPROVED' | 'REJECTED', comment: string) => void,
    isProcessing: boolean
}) {
    const [comment, setComment] = useState('');
    const [showComment, setShowComment] = useState(false);

    return (
        <tr className="hover:bg-muted/30 transition-colors group">
            <td className="p-4">
                <div>
                    <p className="font-semibold text-foreground">{leave.user.name}</p>
                    <p className="text-xs text-muted-foreground">{leave.user.loginId} • {leave.user.email}</p>
                </div>
            </td>
            <td className="p-4">
                <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                    {leave.type}
                </span>
            </td>
            <td className="p-4">
                <div className="text-sm">
                    <p>{new Date(leave.startDate).toLocaleDateString()}</p>
                    <p className="text-xs text-muted-foreground">to {new Date(leave.endDate).toLocaleDateString()}</p>
                </div>
            </td>
            <td className="p-4">
                <p className="text-sm text-muted-foreground max-w-[200px] truncate" title={leave.reason}>
                    {leave.reason}
                </p>
            </td>
            <td className="p-4">
                <StatusBadge status={leave.status} />
            </td>
            <td className="p-4 text-right">
                {leave.status === 'PENDING' ? (
                    <div className="flex flex-col items-end gap-2">
                        {!showComment ? (
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setShowComment(true)}
                                    className="h-8"
                                >
                                    Action
                                </Button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2 w-full max-w-[200px] animate-in slide-in-from-right-2 duration-200">
                                <Input
                                    placeholder="Admin comment..."
                                    className="h-8 text-xs"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                />
                                <div className="flex gap-2 justify-end">
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-7 px-2 text-xs"
                                        onClick={() => setShowComment(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        className="h-7 px-2 text-xs"
                                        onClick={() => onAction(leave.id, 'REJECTED', comment)}
                                        disabled={isProcessing}
                                    >
                                        Reject
                                    </Button>
                                    <Button
                                        size="sm"
                                        className="h-7 px-2 text-xs bg-green-600 hover:bg-green-700"
                                        onClick={() => onAction(leave.id, 'APPROVED', comment)}
                                        disabled={isProcessing}
                                    >
                                        Approve
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-xs text-muted-foreground italic">
                        {leave.adminComment || 'No comment'}
                    </div>
                )}
            </td>
        </tr>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        PENDING: "bg-yellow-50 text-yellow-800 ring-yellow-600/20",
        APPROVED: "bg-green-50 text-green-800 ring-green-600/20",
        REJECTED: "bg-red-50 text-red-800 ring-red-600/20",
    };

    return (
        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${styles[status]}`}>
            {status}
        </span>
    );
}
