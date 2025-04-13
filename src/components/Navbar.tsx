'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import pb, { logout } from '@/lib/pocketbase'; // Import pb as well
import { useState, useEffect } from 'react';
import Image from 'next/image'; // Import Image for avatar

// Define the type for user
interface User {
    id: string;
    email: string;
    name?: string;
    avatar?: string;
    // PocketBase specific fields used for avatar
    collectionId?: string;
    collectionName?: string;
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

    // Get avatar URL
    const avatarUrl = typedUser?.avatar && typedUser?.id && typedUser?.collectionId
        ? pb.files.getUrl(typedUser, typedUser.avatar, { thumb: '100x100' })
        : null; // Fallback or default avatar can be handled in JSX

    const handleLogout = async () => {
        logout();
        await refresh();
        router.push('/');
    };

    // Render based on mounted state to avoid hydration mismatch
    const renderNavContent = () => {
        const authLoading = !mounted || isLoading;

        return (
            <div className="navContainer">
                {/* Left Side: Logo */}
                <Link href="/" className="logo">
                    The Future Classroom
                </Link>

                {/* Center: Navigation Items */}
                <div className="navItems">
                    <Link
                        href="/"
                        className={`navLink ${pathname === '/' ? 'navLinkActive' : ''}`}
                    >
                        Home
                    </Link>
                    <Link
                        href="/community"
                        className={`navLink ${pathname === '/community' ? 'navLinkActive' : ''}`}
                    >
                        Community <span className="betaBadgeNav">(Beta)</span>
                    </Link>
                    {/* Conditional links based on authentication */}
                    {!authLoading && isAuthenticated && (
                        <>
                            <Link
                                href="/dashboard"
                                className={`navLink ${pathname === '/dashboard' ? 'navLinkActive' : ''}`}
                            >
                                Dashboard
                            </Link>
                            <Link
                                href="/account"
                                className={`navLink ${pathname === '/account' ? 'navLinkActive' : ''}`}
                            >
                                Account
                            </Link>
                        </>
                    )}
                </div>

                {/* Right Side: Auth Actions / User Info */}
                <div className="navActions">
                    {authLoading ? (
                        // Placeholder/Loading state before hydration/auth check
                        <div className="navAuthLoadingPlaceholder">
                            <div className="placeholderAvatar"></div>
                            <div className="placeholderButton"></div>
                        </div>
                    ) : isAuthenticated && typedUser ? (
                        // Authenticated User View
                        <div className="navUserMenu">
                            {avatarUrl ? (
                                <Image
                                    src={avatarUrl}
                                    alt={typedUser.name || 'User Avatar'}
                                    width={36} // Adjust size as needed
                                    height={36}
                                    className="userAvatar"
                                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} // Hide on error
                                />
                            ) : (
                                <div className="userAvatar placeholderAvatar">👤</div> // Fallback Icon
                            )}
                            <span className="navUserGreeting" title={typedUser.email}> {/* Use name or fallback */}
                                {typedUser.name || typedUser.email}
                            </span>
                            {/* Add dropdown or other actions here if needed */}
                            <button
                                onClick={handleLogout}
                                className="btn btnOutline btnSmall"
                            >
                                Sign Out
                            </button>
                        </div>
                    ) : (
                        // Not Authenticated View
                        <Link href="/login" className="btn btnPrimary">
                            Sign In
                        </Link>
                    )}
                </div>
            </div>
        );
    };

    return (
        <nav className="navbar">
            {renderNavContent()}
        </nav>
    );
}
