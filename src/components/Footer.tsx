'use client';

import Link from 'next/link';

export default function Footer() {
    return (
        <footer style={{
            backgroundColor: 'rgb(10, 10, 10)',
            borderTop: '1px solid rgba(var(--border-rgb), 0.1)',
            padding: '2rem 0',
        }}>
            <div style={{
                maxWidth: '1280px',
                margin: '0 auto',
                padding: '0 1.5rem',
            }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                    gap: '2rem',
                    marginBottom: '2rem',
                }}>
                    {/* Company Info */}
                    <div>
                        <h3 style={{
                            fontSize: '1.25rem',
                            fontWeight: 'bold',
                            marginBottom: '1rem',
                            background: 'linear-gradient(to right, rgb(var(--primary-rgb)), rgb(var(--secondary-rgb)))',
                            WebkitBackgroundClip: 'text',
                            color: 'transparent',
                        }}>
                            The Future Classroom
                        </h3>
                        <p style={{
                            maxWidth: '25rem',
                            color: 'rgba(var(--foreground-rgb), 0.7)',
                            marginBottom: '1rem',
                        }}>
                            Empowering K-12 teachers to harness the transformative power of artificial intelligence in education.
                        </p>
                        <div style={{
                            display: 'flex',
                            gap: '1rem',
                        }}>
                            {/* Social icons would go here */}
                        </div>
                    </div>
                </div>

                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '1.5rem',
                    borderTop: '1px solid rgba(var(--border-rgb), 0.1)',
                    flexWrap: 'wrap',
                    gap: '1rem',
                }}>
                    <p style={{ color: 'rgba(var(--foreground-rgb), 0.6)', fontSize: '0.875rem' }}>
                        © {new Date().getFullYear()} Future Classroom. All rights reserved.
                    </p>
                    <div style={{
                        display: 'flex',
                        gap: '1.5rem',
                    }}>
                        <Link href="/privacy" style={{ color: 'rgba(var(--foreground-rgb), 0.6)', fontSize: '0.875rem', textDecoration: 'none' }}>
                            Privacy Policy
                        </Link>
                        <Link href="/terms" style={{ color: 'rgba(var(--foreground-rgb), 0.6)', fontSize: '0.875rem', textDecoration: 'none' }}>
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
} 