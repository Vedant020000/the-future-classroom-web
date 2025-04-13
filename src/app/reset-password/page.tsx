'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import pb from '@/lib/pocketbase';
import './globals.css';

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [token, setToken] = useState<string | null>(null);
    const [tokenError, setTokenError] = useState<string | null>(null);

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const tokenParam = searchParams.get('token');
        if (tokenParam) {
            setToken(tokenParam);
            setTokenError(null);
        } else {
            setTokenError('Password reset token is missing or invalid. Please request a new link.');
        }
    }, [searchParams]);

    const validateForm = () => {
        if (!password) {
            setError('Password is required.');
            return false;
        }
        if (password.length < 8) {
            setError('Password must be at least 8 characters long.');
            return false;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return false;
        }
        setError('');
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!token || !validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            await pb.collection('users').confirmPasswordReset(
                token,
                password,
                confirmPassword
            );
            console.log('Password reset successful.');
            setSuccess(true);
        } catch (err: any) {
            console.error('PocketBase password reset confirmation error:', err);
            let errorMessage = 'Failed to reset password. The link may be invalid or expired.';
            if (err.message) {
                errorMessage = `Failed to reset password: ${err.message}`;
            }
            // Handle specific Pocketbase errors if needed (e.g., token expired)
            if (err?.data?.data?.token?.message) {
                errorMessage = `Failed to reset password: ${err.data.data.token.message}`;
            }
            setError(errorMessage);
            setSuccess(false);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 flex flex-col items-center">
            <div className="w-full max-w-md mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold mb-2">
                        <span className="gradient-text">Set New Password</span>
                    </h1>
                    {!success && !tokenError && (
                        <p className="text-foreground/70">
                            Enter and confirm your new password below.
                        </p>
                    )}
                </div>

                <div className="bg-card border border-border/40 rounded-xl shadow-lg p-8">
                    {tokenError && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 text-sm text-center">
                            <p>{tokenError}</p>
                            <Link href="/forgot-password" className="font-medium text-primary hover:underline mt-2 block">
                                Request a new reset link
                            </Link>
                        </div>
                    )}

                    {success ? (
                        <div className="text-center py-6">
                            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Password Updated!</h3>
                            <p className="text-foreground/70 mb-6">
                                Your password has been successfully reset.
                            </p>
                            <Link
                                href="/login"
                                className="w-full btn btnPrimary py-3 px-4 text-base inline-block"
                            >
                                Proceed to Sign In
                            </Link>
                        </div>
                    ) : null}

                    {/* Only show form if token exists and reset is not successful */}
                    {token && !success && !tokenError && (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 text-sm">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium mb-2">
                                    New Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg bg-card border border-border/40 focus:outline-none focus:ring-2 focus:ring-primary/30"
                                    placeholder="••••••••"
                                    required
                                    minLength={8}
                                    disabled={isLoading}
                                />
                                <p className="mt-1 text-xs text-foreground/60">Minimum 8 characters.</p>
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                                    Confirm New Password
                                </label>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg bg-card border border-border/40 focus:outline-none focus:ring-2 focus:ring-primary/30"
                                    placeholder="••••••••"
                                    required
                                    minLength={8}
                                    disabled={isLoading}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full btn btnPrimary py-3 px-4 text-base transition duration-300 ease-in-out hover:scale-[1.02] disabled:opacity-60 disabled:pointer-events-none flex justify-center items-center"
                            >
                                {isLoading ? (
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : null}
                                {isLoading ? 'Resetting Password...' : 'Reset Password'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

// Wrap the component in Suspense for useSearchParams
export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}> // Optional: Add a loading fallback
            <ResetPasswordForm />
        </Suspense>
    );
} 