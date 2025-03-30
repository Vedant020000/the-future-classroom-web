'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import './globals.css';

export default function ResetPasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [passwords, setPasswords] = useState({
        password: '',
        confirmPassword: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [tokenValid, setTokenValid] = useState(true);

    useEffect(() => {
        // Verify token on page load
        const verifyToken = async () => {
            if (!token) {
                setTokenValid(false);
                setError('Invalid or missing reset token. Please request a new password reset link.');
                return;
            }

            try {
                // In a real app, this would be a fetch call to verify the token
                await new Promise(resolve => setTimeout(resolve, 500));

                // Simulate token validation
                if (token.length < 10) {
                    setTokenValid(false);
                    setError('Invalid or expired reset token. Please request a new password reset link.');
                }
            } catch (err) {
                setTokenValid(false);
                setError('Could not verify reset token. Please try again later.');
            }
        };

        verifyToken();
    }, [token]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswords(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Reset states
        setError('');

        // Validate passwords
        if (passwords.password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        if (passwords.password !== passwords.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);

        try {
            // In a real app, this would be a fetch call to your reset password API
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Simulate successful password reset
            setSuccess(true);

            // Redirect to login after 3 seconds
            setTimeout(() => {
                router.push('/login?reset=success');
            }, 3000);
        } catch (err) {
            setError('Failed to reset password. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen pt-24 pb-12 flex flex-col items-center">
                <div className="w-full max-w-md mx-auto">
                    <div className="bg-card border border-border/40 rounded-xl shadow-lg p-8 text-center">
                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Password Reset Successful</h3>
                        <p className="text-foreground/70 mb-6">
                            Your password has been reset successfully. You will be redirected to the login page shortly.
                        </p>
                        <Link href="/login" className="btn-primary">
                            Go to Login
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 flex flex-col items-center">
            <div className="w-full max-w-md mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold mb-2">
                        <span className="gradient-text">Create New Password</span>
                    </h1>
                    <p className="text-foreground/70">
                        Enter your new password below
                    </p>
                </div>

                <div className="bg-card border border-border/40 rounded-xl shadow-lg p-8">
                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 text-sm">
                            {error}
                        </div>
                    )}

                    {tokenValid ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium mb-2">
                                    New Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={passwords.password}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg bg-card border border-border/40 focus:outline-none focus:ring-2 focus:ring-primary/30"
                                    placeholder="••••••••"
                                    required
                                    minLength={8}
                                />
                                <p className="mt-1 text-xs text-foreground/60">
                                    Password must be at least 8 characters
                                </p>
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                                    Confirm New Password
                                </label>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    value={passwords.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg bg-card border border-border/40 focus:outline-none focus:ring-2 focus:ring-primary/30"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full btn-primary flex justify-center"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Resetting Password...
                                    </>
                                ) : 'Reset Password'}
                            </button>
                        </form>
                    ) : (
                        <div className="text-center py-6">
                            <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Invalid Reset Link</h3>
                            <p className="text-foreground/70 mb-6">
                                {error || 'This password reset link is invalid or has expired.'}
                            </p>
                            <Link href="/forgot-password" className="btn-primary">
                                Request New Reset Link
                            </Link>
                        </div>
                    )}

                    <div className="mt-8 pt-6 border-t border-border/40 text-center">
                        <p className="text-sm text-foreground/70">
                            Remember your password?{' '}
                            <Link
                                href="/login"
                                className="text-primary hover:text-primary-dark transition-colors font-medium"
                            >
                                Back to sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
} 