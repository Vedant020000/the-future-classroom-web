'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { loginWithGoogle } from '@/lib/pocketbase';
import { useAuth } from '@/lib/AuthContext';
import styles from './page.module.css';

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, isAuthenticated, refresh } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Get the 'from' parameter to redirect after login
    const fromParam = searchParams.get('from');
    const fromPath = fromParam ? `/${fromParam.startsWith('/') ? fromParam.substring(1) : fromParam}` : '/ai-access';

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated && user) {
            console.log('User already authenticated, redirecting to:', fromPath);
            router.push(fromPath);
        }
    }, [isAuthenticated, user, router, fromPath]);

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        setError('');

        try {
            console.log('Starting Google sign-in process...');
            // Use the PocketBase OAuth flow for Google
            await loginWithGoogle();

            // Refresh auth context to get the updated user
            await refresh();

            console.log('Google sign-in successful, redirecting to:', fromPath);
            router.push(fromPath);
        } catch (err: any) {
            console.error('Authentication error:', err);
            setError(err.message || 'Failed to sign in with Google. Please try again.');
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.loginPage}>
            <div className={styles.loginCard}>
                <div className={styles.logoContainer}>
                    <h1 className={styles.logo}>The Future Classroom</h1>
                    <p className={styles.subtitle}>AI Tools for K-12 Education</p>
                </div>

                {error && (
                    <div style={{
                        color: 'rgb(220, 53, 69)',
                        backgroundColor: 'rgba(220, 53, 69, 0.1)',
                        padding: '0.75rem',
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem',
                        textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}

                <button
                    className={`${styles.googleButton} ${isLoading ? styles.loadingButton : ''}`}
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <span className={styles.loadingSpinner}></span>
                    ) : (
                        <svg className={styles.googleIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                            <path fill="none" d="M0 0h48v48H0z" />
                        </svg>
                    )}
                    {isLoading ? 'Signing in...' : 'Sign in with Google'}
                </button>

                <p className={styles.disclaimer}>
                    This is a non-profit educational platform. By signing in, you agree to our{' '}
                    <Link href="/terms" className={styles.link}>Terms of Service</Link> and{' '}
                    <Link href="/privacy" className={styles.link}>Privacy Policy</Link>.
                </p>
            </div>
        </div>
    );
} 