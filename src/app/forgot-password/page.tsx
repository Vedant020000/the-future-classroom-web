'use client';

import { useState } from 'react';
import Link from 'next/link';
import pb from '@/lib/pocketbase'; // Import PocketBase instance

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Allow trying again from the success state
        if (!isLoading && !success) {
            setError('');
        }
        // If already successful, re-trigger the logic
        if (success) {
            setSuccess(false); // Reset success state to allow resubmit visuals
        }

        setIsLoading(true);

        // Simple email validation
        if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
            setError('Please enter a valid email address');
            setIsLoading(false);
            return;
        }

        try {
            // Call PocketBase password reset request
            await pb.collection('users').requestPasswordReset(email);
            console.log(`Password reset requested for: ${email}`);
            setSuccess(true);
            setError(''); // Clear any previous errors on success
        } catch (err: any) {
            console.error('PocketBase password reset request error:', err);
            let errorMessage = 'Failed to send reset link. Please try again later.';
            // Check if the error is specifically "User not found" or similar
            if (err?.status === 404 || err?.data?.message?.includes('Failed to find record')) {
                // Still show success to avoid leaking information about registered emails
                console.log('User not found, but showing success message to avoid email enumeration.');
                setSuccess(true);
            } else if (err.message) {
                errorMessage = `Failed to send reset link: ${err.message}`;
            }
            setError(errorMessage);
            setSuccess(false); // Ensure success is false if there was a non-404 error
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
                        Enter your email address and we'll send you a link to reset your password.
                    </p>
                </div>

                <div className="bg-card border border-border/40 rounded-xl shadow-lg p-8">
                    {/* Only show error if not in success state */}
                    {error && !success && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 text-sm">
                            {error}
                        </div>
                    )}

                    {success ? (
                        <div className="text-center py-6">
                            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Check Your Email</h3>
                            <p className="text-foreground/70 mb-6">
                                If an account exists for <span className="font-medium text-primary">{email}</span>, you will receive a password reset link shortly.
                                The link will expire according to your PocketBase settings.
                            </p>
                            <p className="text-sm text-foreground/60">
                                Didn't receive the email? Check your spam folder or{' '}
                                <button
                                    type="button" // Change to button to prevent form submission
                                    onClick={handleSubmit} // Reuse handleSubmit to trigger the flow again
                                    disabled={isLoading}
                                    className="text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed ml-1 font-medium"
                                >
                                    {isLoading ? 'Sending...' : 'try sending again'}
                                </button>.
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
                                {isLoading ? 'Sending Link...' : 'Send Reset Link'}
                            </button>
                        </form>
                    )}

                    <div className="mt-8 pt-6 border-t border-border/40 text-center">
                        <p className="text-sm text-foreground/70">
                            Remember your password?{' '}
                            <Link
                                href="/login"
                                className="ml-1 font-medium text-primary hover:underline"
                            >
                                Back to Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
} 