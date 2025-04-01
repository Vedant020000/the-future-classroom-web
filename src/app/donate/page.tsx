'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function DonatePage() {
    const [donationType, setDonationType] = useState('once');
    const [amount, setAmount] = useState(25);
    const [customAmount, setCustomAmount] = useState('');

    const handleAmountClick = (value: number) => {
        setAmount(value);
        setCustomAmount('');
    };

    const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        // Only allow numbers and decimals
        if (/^\d*\.?\d*$/.test(value)) {
            setCustomAmount(value);
            if (value) {
                setAmount(0); // Reset preset amounts
            }
        }
    };

    const handleDonate = () => {
        // In a real app, this would integrate with Stripe or another payment processor
        const finalAmount = customAmount ? parseFloat(customAmount) : amount;
        alert(`Thank you for your ${donationType === 'once' ? 'one-time' : 'monthly'} donation of $${finalAmount.toFixed(2)}!`);
    };

    return (
        <div className={styles.page}>
            <section className={styles.headerSection}>
                <div className={styles.container}>
                    <h1 className={styles.title}>Support Our Educational Mission</h1>
                    <p className={styles.subtitle}>
                        Help us bring AI-powered educational tools to students and educators worldwide.
                        Your contribution directly supports our non-profit initiative.
                    </p>
                </div>
            </section>

            <section className={styles.contentSection}>
                <div className={styles.container}>
                    <div className={styles.grid}>
                        <div className={styles.mainContent}>
                            <div className={styles.card}>
                                <h2 className={styles.cardTitle}>Our Non-Profit Mission</h2>
                                <p className={styles.paragraph}>
                                    The Future Classroom is a non-profit initiative dedicated to democratizing access to cutting-edge
                                    educational AI tools. We believe that technology should enhance education for everyone,
                                    regardless of their financial resources or geographical location.
                                </p>
                                <p className={styles.paragraph}>
                                    Your donation directly supports our mission to:
                                </p>
                                <ul className={styles.list}>
                                    <li className={styles.listItem}>
                                        Develop and improve AI-powered educational tools for classrooms around the world
                                    </li>
                                    <li className={styles.listItem}>
                                        Provide free access to basic AI educational services for all educators
                                    </li>
                                    <li className={styles.listItem}>
                                        Create resources and training materials to help teachers effectively use AI in education
                                    </li>
                                    <li className={styles.listItem}>
                                        Research and implement best practices for responsible AI use in educational settings
                                    </li>
                                </ul>
                            </div>

                            <div className={styles.card}>
                                <h2 className={styles.cardTitle}>How Your Donation Helps</h2>
                                <p className={styles.paragraph}>
                                    <span className={styles.highlight}>$10 monthly</span> provides a student with full access to our AI educational tools
                                </p>
                                <p className={styles.paragraph}>
                                    <span className={styles.highlight}>$25 monthly</span> supports a classroom of students with enhanced AI tools for collaborative learning
                                </p>
                                <p className={styles.paragraph}>
                                    <span className={styles.highlight}>$50 monthly</span> funds the development of new AI features and educational content
                                </p>
                                <p className={styles.paragraph}>
                                    <span className={styles.highlight}>$100 monthly</span> helps us extend our platform to under-resourced schools and communities
                                </p>
                                <p className={styles.paragraph}>
                                    Every donation, no matter the size, makes a meaningful impact on our ability to deliver
                                    high-quality AI educational tools to students and educators worldwide.
                                </p>
                            </div>
                        </div>

                        <div className={styles.donationCard}>
                            <h2 className={styles.cardTitle}>Make a Donation</h2>

                            <div className={styles.donationTabs}>
                                <button
                                    className={`${styles.donationTab} ${donationType === 'once' ? styles.activeTab : ''}`}
                                    onClick={() => setDonationType('once')}
                                >
                                    One-time
                                </button>
                                <button
                                    className={`${styles.donationTab} ${donationType === 'monthly' ? styles.activeTab : ''}`}
                                    onClick={() => setDonationType('monthly')}
                                >
                                    Monthly
                                </button>
                            </div>

                            <div className={styles.donationAmounts}>
                                <button
                                    className={`${styles.amountButton} ${amount === 10 && !customAmount ? styles.activeAmount : ''}`}
                                    onClick={() => handleAmountClick(10)}
                                >
                                    $10
                                </button>
                                <button
                                    className={`${styles.amountButton} ${amount === 25 && !customAmount ? styles.activeAmount : ''}`}
                                    onClick={() => handleAmountClick(25)}
                                >
                                    $25
                                </button>
                                <button
                                    className={`${styles.amountButton} ${amount === 50 && !customAmount ? styles.activeAmount : ''}`}
                                    onClick={() => handleAmountClick(50)}
                                >
                                    $50
                                </button>
                                <button
                                    className={`${styles.amountButton} ${amount === 100 && !customAmount ? styles.activeAmount : ''}`}
                                    onClick={() => handleAmountClick(100)}
                                >
                                    $100
                                </button>
                                <button
                                    className={`${styles.amountButton} ${amount === 250 && !customAmount ? styles.activeAmount : ''}`}
                                    onClick={() => handleAmountClick(250)}
                                >
                                    $250
                                </button>
                                <button
                                    className={`${styles.amountButton} ${amount === 500 && !customAmount ? styles.activeAmount : ''}`}
                                    onClick={() => handleAmountClick(500)}
                                >
                                    $500
                                </button>
                            </div>

                            <div className={styles.customAmount}>
                                <label htmlFor="custom-amount" className={styles.inputLabel}>
                                    Or enter a custom amount:
                                </label>
                                <div className={styles.inputGroup}>
                                    <span className={styles.currencySymbol}>$</span>
                                    <input
                                        id="custom-amount"
                                        type="text"
                                        className={styles.input}
                                        placeholder="Enter amount"
                                        value={customAmount}
                                        onChange={handleCustomAmountChange}
                                    />
                                </div>
                            </div>

                            <button className={styles.donateButton} onClick={handleDonate}>
                                Donate {donationType === 'monthly' ? 'Monthly' : 'Now'}
                            </button>

                            <div className={styles.benefitsSection}>
                                <h3 className={styles.cardTitle}>Donor Benefits</h3>
                                <ul className={styles.benefitsList}>
                                    <li className={styles.benefitItem}>
                                        <span className={styles.checkIcon}>✓</span>
                                        <span className={styles.benefitText}>
                                            Increased daily AI query limits
                                        </span>
                                    </li>
                                    <li className={styles.benefitItem}>
                                        <span className={styles.checkIcon}>✓</span>
                                        <span className={styles.benefitText}>
                                            Access to premium AI models and tools
                                        </span>
                                    </li>
                                    <li className={styles.benefitItem}>
                                        <span className={styles.checkIcon}>✓</span>
                                        <span className={styles.benefitText}>
                                            Early access to new features
                                        </span>
                                    </li>
                                    <li className={styles.benefitItem}>
                                        <span className={styles.checkIcon}>✓</span>
                                        <span className={styles.benefitText}>
                                            Priority support via email
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
} 