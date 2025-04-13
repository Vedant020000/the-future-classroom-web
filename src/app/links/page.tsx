'use client';

import React from 'react';
import styles from './page.module.css';
import Link from 'next/link';

// Define link data - REPLACE PLACEHOLDERS WITH ACTUAL URLS
const linksData = [
    {
        id: 'instagram',
        name: 'Instagram',
        url: 'https://instagram.com/your_username', // <-- REPLACE
        icon: '📸', // Emoji icon
        description: 'Follow us on Instagram for updates and visuals.'
    },
    {
        id: 'milaap',
        name: 'Milaap',
        url: 'https://milaap.org/fundraisers/your_campaign', // <-- REPLACE
        icon: '💖', // Emoji icon 
        description: 'Support our cause through our Milaap crowdfunding campaign.'
    },
    {
        id: 'whatsapp',
        name: 'WhatsApp',
        // Replace with your number including country code, e.g., 91XXXXXXXXXX for India
        url: 'https://wa.me/91XXXXXXXXXX', // <-- REPLACE
        icon: '💬', // Emoji icon
        description: 'Connect with us directly on WhatsApp.'
    },
    {
        id: 'email',
        name: 'Email',
        url: 'mailto:your_email@example.com', // <-- REPLACE
        icon: '✉️', // Emoji icon
        description: 'Send us an email for inquiries or support.'
    }
];

const LinksPage = () => {
    return (
        <div className={styles.pageContainer}>
            <header className={styles.header}>
                <h1>Connect With Us</h1>
                <p>Find us on various platforms or get in touch directly.</p>
            </header>

            <div className={styles.linksGrid}>
                {linksData.map((link) => (
                    <Link href={link.url} key={link.id} className={styles.linkCard} target="_blank" rel="noopener noreferrer">
                        <div className={styles.linkIcon}>{link.icon}</div>
                        <div className={styles.linkContent}>
                            <h2 className={styles.linkName}>{link.name}</h2>
                            <p className={styles.linkDescription}>{link.description}</p>
                        </div>
                        <span className={styles.arrow}>→</span>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default LinksPage; 