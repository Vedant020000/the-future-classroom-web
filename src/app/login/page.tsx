'use client';

import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import pb, { loginWithGoogle } from '@/lib/pocketbase';
import { useAuth } from '@/lib/AuthContext';
import styles from './page.module.css';

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, isAuthenticated, refresh } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const fromParam = searchParams.get('from');
    const fromPath = fromParam ? `/${fromParam.startsWith('/') ? fromParam.substring(1) : fromParam}` : '/dashboard';

    useEffect(() => {
        if (searchParams.get('registered') === 'true') {
            setSuccessMessage('Registration successful! Please check your email for verification if required, then log in.');
            router.replace('/login', { scroll: false });
        }
    }, [searchParams, router]);

    useEffect(() => {
        if (isAuthenticated && user) {
            console.log('User already authenticated, redirecting to:', fromPath);
            router.replace(fromPath);
        }
    }, [isAuthenticated, user, router, fromPath]);

    const handleEmailPasswordLogin = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            console.log('Attempting email/password login...');
            await pb.collection('users').authWithPassword(email, password);
            await refresh();
            console.log('Email/password login successful, redirecting to:', fromPath);
            router.push(fromPath);
        } catch (err: any) {
            console.error('Authentication error (email/password):', err);
            setError(err.message || 'Failed to sign in. Check email/password.');
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setIsGoogleLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            console.log('Starting Google sign-in process...');
            await loginWithGoogle();
            await refresh();
            console.log('Google sign-in successful, redirecting to:', fromPath);
            router.push(fromPath);
        } catch (err: any) {
            console.error('Authentication error (Google):', err);
            setError(err.message || 'Failed to sign in with Google. Please try again.');
            setIsGoogleLoading(false);
        }
    };

    useEffect(() => {
        if (pb.authStore.isValid && !user) {
            console.log("Auth store valid but context user missing, refreshing...");
            refresh().then(() => {
                console.log("Refresh complete after auth store check.");
            }).catch(err => {
                console.error("Error refreshing auth state after auth store check:", err);
            });
        }
    }, [refresh, user]);

    return (
        <div className="min-h-screen pt-20 pb-12 flex items-center justify-center">
            <div className="max-w-md w-full bg-card border border-border/40 rounded-xl shadow-lg p-8 space-y-6">
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-1">
                        <span className="gradient-text">Welcome Back</span>
                    </h1>
                    <p className="text-foreground/70">Sign in to access your dashboard.</p>
                </div>

                {successMessage && (
                    <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-500 text-sm text-center">
                        {successMessage}
                    </div>
                )}

                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleEmailPasswordLogin} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-1">
                            Email Address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg bg-card border border-border/40 focus:outline-none focus:ring-2 focus:ring-primary/30"
                            placeholder="you@school.edu"
                            disabled={isLoading || isGoogleLoading}
                        />
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label htmlFor="password" className="block text-sm font-medium">
                                Password
                            </label>
                            <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                                Forgot password?
                            </Link>
                        </div>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg bg-card border border-border/40 focus:outline-none focus:ring-2 focus:ring-primary/30"
                            placeholder="••••••••"
                            disabled={isLoading || isGoogleLoading}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || isGoogleLoading}
                        className="w-full btn btnPrimary py-3 px-4 text-base transition duration-300 ease-in-out hover:scale-[1.02] disabled:opacity-60 disabled:pointer-events-none flex justify-center items-center"
                    >
                        {isLoading && (
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        )}
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <div className="relative flex items-center justify-center my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border/40"></div>
                    </div>
                    <div className="relative bg-card px-2 text-sm text-foreground/60">
                        OR
                    </div>
                </div>

                <button
                    onClick={handleGoogleSignIn}
                    disabled={isLoading || isGoogleLoading}
                    className="w-full btn btnSecondary py-3 px-4 text-base transition duration-300 ease-in-out hover:scale-[1.02] disabled:opacity-60 disabled:pointer-events-none flex justify-center items-center"
                >
                    {isGoogleLoading ? (
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        <svg className="mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                            <path fill="none" d="M0 0h48v48H0z" />
                        </svg>
                    )}
                    {isGoogleLoading ? 'Signing In...' : 'Sign in with Google'}
                </button>

                <div className="mt-6 text-center text-sm text-foreground/70">
                    Don't have an account?
                    <Link href="/signup" className="ml-1 font-medium text-primary hover:underline">
                        Sign Up
                    </Link>
                </div>

                <p className="mt-4 text-center text-xs text-foreground/50">
                    By signing in, you agree to our{' '}
                    <Link href="/terms" className="underline hover:text-foreground/70">Terms</Link> and{' '}
                    <Link href="/privacy" className="underline hover:text-foreground/70">Privacy Policy</Link>.
                </p>
            </div>
        </div>
    );
} 