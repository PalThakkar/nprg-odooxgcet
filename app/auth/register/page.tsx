'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [companyInitials, setCompanyInitials] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, companyName, companyInitials }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            // Set cookie/token logic usually handled by API or here
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-[450px]">
                <CardHeader>
                    <CardTitle>Register</CardTitle>
                    <CardDescription>Create your admin account & company profile</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleRegister}>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="email">Email address</Label>
                                <Input id="email" type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            </div>
                            <div className="h-px bg-gray-200 my-2" />
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="companyName">Company Name</Label>
                                <Input id="companyName" placeholder="Acme Inc." value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="companyInitials">Company Initials (Max 2 letters)</Label>
                                <Input id="companyInitials" placeholder="AI" maxLength={2} value={companyInitials} onChange={(e) => setCompanyInitials(e.target.value)} required />
                            </div>
                        </div>
                        {error && <p className="text-red-500 text-sm mt-3 font-medium bg-red-50 p-2 rounded border border-red-100">{error}</p>}
                        <Button className="w-full mt-6 bg-purple-600 hover:bg-purple-700" type="submit" disabled={loading}>
                            {loading ? 'Setting up...' : 'Create Admin Account'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Link href="/auth/login" className="text-sm text-blue-600 hover:underline">Already have an account? Login</Link>
                </CardFooter>
            </Card>
        </div>
    );
}
