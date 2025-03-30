'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess(false);

        // Simple email validation
        if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
            setError('Please enter a valid email address');
            setIsLoading(false);
            return;
        }

        try {
            // In a real app, this would be a fetch call to your password reset API
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Simulate successful request
            setSuccess(true);
        } catch (err) {
            setError('Failed to send reset link. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 flex flex-col items-center">
            <div className="w-full max-w-md mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold mb-2">
                        <span className="gradient-text">Reset Your Password</span>
                    </h1>
                    <p className="text-foreground/70">
                        Enter your email address and we'll send you a link to reset your password
                    </p>
                </div>

                <div className="bg-card border border-border/40 rounded-xl shadow-lg p-8">
                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 text-sm">
                            {error}
                        </div>
                    )}

                    {success ? (
                        <div className="text-center py-6">
                            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Check Your Email</h3>
                            <p className="text-foreground/70 mb-6">
                                We've sent a password reset link to <span className="font-medium">{email}</span>.
                                The link will expire in 30 minutes.
                            </p>
                            <p className="text-sm text-foreground/60">
                                Didn't receive the email? Check your spam folder or{' '}
                                <button
                                    onClick={handleSubmit}
                                    className="text-primary hover:text-primary-dark transition-colors font-medium"
                                >
                                    try again
                                </button>
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium mb-2">
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg bg-card border border-border/40 focus:outline-none focus:ring-2 focus:ring-primary/30"
                                    placeholder="you@school.edu"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full btn-primary flex justify-center"
                            >
                                {isLoading ? (
                                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : 'Send Reset Link'}
                            </button>
                        </form>
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