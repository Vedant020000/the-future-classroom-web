'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { logout } from '@/lib/pocketbase';
import { useState, useEffect } from 'react';

// Define the type for user
interface User {
    id: string;
    email: string;
    name?: string;
    avatar?: string;
    [key: string]: any; // For any other fields that might be present
}

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, isAuthenticated, isLoading, refresh } = useAuth();
    const [mounted, setMounted] = useState(false);

    // Set mounted state to true after component mounts
    useEffect(() => {
        setMounted(true);
    }, []);

    // Type assertion to treat user as User type
    const typedUser = user as User | null;

    const handleLogout = async () => {
        logout();
        await refresh();
        router.push('/');
    };

    // Only render authenticated content client-side to prevent hydration errors
    if (!mounted) {
        return (
            <nav className="navbar">
                <div className="navContainer">
                    <Link href="/" className="logo">
                        The Future Classroom
                    </Link>

                    <div className="navItems">
                        <Link
                            href="/"
                            className={`navLink ${pathname === '/' ? 'navLinkActive' : ''}`}
                        >
                            Home
                        </Link>
                        <Link
                            href="/ai-tools"
                            className={`navLink ${pathname === '/ai-tools' ? 'navLinkActive' : ''}`}
                        >
                            AI Tools
                        </Link>
                        <Link
                            href="/community"
                            className={`navLink ${pathname === '/community' ? 'navLinkActive' : ''}`}
                        >
                            Community
                        </Link>
                    </div>

                    <div>
                        <Link href="/login" className="btn btnPrimary">
                            <svg style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} viewBox="0 0 48 48">
                                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                            </svg>
                            Sign In
                        </Link>
                    </div>
                </div>
            </nav>
        );
    }

    return (
        <nav className="navbar">
            <div className="navContainer">
                <Link href="/" className="logo">
                    The Future Classroom
                </Link>

                <div className="navItems">
                    <Link
                        href="/"
                        className={`navLink ${pathname === '/' ? 'navLinkActive' : ''}`}
                    >
                        Home
                    </Link>
                    {isAuthenticated ? (
                        <Link
                            href="/ai-access"
                            className={`navLink ${pathname === '/ai-access' ? 'navLinkActive' : ''}`}
                        >
                            AI Tools
                        </Link>
                    ) : (
                        <Link
                            href="/ai-tools"
                            className={`navLink ${pathname === '/ai-tools' ? 'navLinkActive' : ''}`}
                        >
                            AI Tools
                        </Link>
                    )}
                    <Link
                        href="/community"
                        className={`navLink ${pathname === '/community' ? 'navLinkActive' : ''}`}
                    >
                        Community
                    </Link>
                    {isAuthenticated && (
                        <Link
                            href="/account"
                            className={`navLink ${pathname === '/account' ? 'navLinkActive' : ''}`}
                        >
                            Account
                        </Link>
                    )}
                </div>

                <div>
                    {isAuthenticated ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ fontSize: '0.875rem', color: 'rgba(var(--foreground-rgb), 0.7)' }}>
                                {typedUser?.name || typedUser?.email}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="btn btnPrimary"
                                style={{ padding: '0.375rem 0.75rem' }}
                            >
                                Sign Out
                            </button>
                        </div>
                    ) : (
                        <Link href="/login" className="btn btnPrimary">
                            <svg style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} viewBox="0 0 48 48">
                                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                            </svg>
                            Sign In
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
} 