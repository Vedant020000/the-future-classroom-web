'use client'; // Make this a Client Component

import { usePathname } from 'next/navigation';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import React from 'react';

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Determine if the footer should be shown
    const showFooter = pathname === '/' || pathname === '/dashboard';

    return (
        <>
            <Navbar />
            {/* Apply flex-grow and padding here or on a wrapper inside if needed */}
            <main style={{ flexGrow: 1, paddingTop: '4rem' }}>
                {children}
            </main>
            {showFooter && <Footer />}
        </>
    );
} 