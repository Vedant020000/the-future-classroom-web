'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function AccountPage() {
    const [activeTab, setActiveTab] = useState('usage');

    // Mock user data
    const userData = {
        name: 'Alex Johnson',
        email: 'alex.johnson@schooldistrict.edu',
        role: 'Science Teacher',
        school: 'Westwood High School',
        plan: 'Free',
        usageStats: {
            daily: {
                used: 14,
                limit: 20,
                percentage: 70
            },
            monthly: {
                used: 243,
                limit: 500,
                percentage: 48.6
            }
        },
        usageHistory: [
            { date: 'May 10, 2024', tool: 'AI Lesson Planner', queries: 6 },
            { date: 'May 9, 2024', tool: 'Assessment Generator', queries: 4 },
            { date: 'May 9, 2024', tool: 'Feedback Generator', queries: 3 },
            { date: 'May 8, 2024', tool: 'Rubric Creator', queries: 5 },
            { date: 'May 7, 2024', tool: 'AI Lesson Planner', queries: 8 },
        ],
        savedTemplates: [
            { id: 1, name: 'Physics Lab Report Template', tool: 'AI Lesson Planner', date: 'May 5, 2024' },
            { id: 2, name: 'Weekly Quiz Format', tool: 'Assessment Generator', date: 'April 28, 2024' },
            { id: 3, name: 'Student Feedback Template', tool: 'Feedback Generator', date: 'April 15, 2024' },
        ]
    };

    return (
        <div className={styles.page}>
            {/* Header */}
            <section className={styles.headerSection}>
                <div className={styles.container}>
                    <div className={styles.headerContent}>
                        <div className={styles.profileLayout}>
                            <div className={styles.avatar}>
                                {userData.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className={styles.userInfo}>
                                <h1 className={styles.userName}>{userData.name}</h1>
                                <p className={styles.userRole}>{userData.role} at {userData.school}</p>
                                <p className={styles.userEmail}>{userData.email}</p>
                                <div className={styles.badgeContainer}>
                                    <span className={styles.planBadge}>
                                        Non-profit Access
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className={styles.mainSection}>
                <div className={styles.container}>
                    <div className={styles.content}>
                        {/* Tabs */}
                        <div className={styles.tabsContainer}>
                            <button
                                className={`${styles.tabButton} ${activeTab === 'usage' ? styles.activeTab : ''}`}
                                onClick={() => setActiveTab('usage')}
                            >
                                Usage & Limits
                            </button>
                            <button
                                className={`${styles.tabButton} ${activeTab === 'templates' ? styles.activeTab : ''}`}
                                onClick={() => setActiveTab('templates')}
                            >
                                Saved Templates
                            </button>
                            <button
                                className={`${styles.tabButton} ${activeTab === 'settings' ? styles.activeTab : ''}`}
                                onClick={() => setActiveTab('settings')}
                            >
                                Account Settings
                            </button>
                            <button
                                className={`${styles.tabButton} ${activeTab === 'billing' ? styles.activeTab : ''}`}
                                onClick={() => setActiveTab('billing')}
                            >
                                Billing
                            </button>
                        </div>

                        {/* Usage Tab Content */}
                        {activeTab === 'usage' && (
                            <div>
                                {/* Usage Stats */}
                                <div>
                                    <h2 className={styles.sectionTitle}>AI Usage Statistics</h2>
                                    <div className={styles.statsGrid}>
                                        <div className={styles.statsCard}>
                                            <div className={styles.statsHeader}>
                                                <h3 className={styles.statsTitle}>Daily Queries</h3>
                                                <p className={styles.statsSubtitle}>Resets at midnight</p>
                                            </div>
                                            <p className={styles.statsValue}>14 / 15</p>
                                            <div className={styles.progressBar}>
                                                <div className={`${styles.progressFill} ${styles.primaryFill}`} style={{ width: '93%' }}></div>
                                            </div>
                                            <div className={styles.progressLabels}>
                                                <span>0</span>
                                                <span>15</span>
                                            </div>
                                        </div>

                                        <div className={styles.statsCard}>
                                            <div className={styles.statsHeader}>
                                                <h3 className={styles.statsTitle}>Generated Lessons</h3>
                                                <p className={styles.statsSubtitle}>This month</p>
                                            </div>
                                            <p className={styles.statsValue}>12</p>
                                        </div>

                                        <div className={styles.statsCard}>
                                            <div className={styles.statsHeader}>
                                                <h3 className={styles.statsTitle}>Saved Templates</h3>
                                                <p className={styles.statsSubtitle}>Max 10</p>
                                            </div>
                                            <p className={styles.statsValue}>7 / 10</p>
                                            <div className={styles.progressBar}>
                                                <div className={`${styles.progressFill} ${styles.accentFill}`} style={{ width: '70%' }}></div>
                                            </div>
                                            <div className={styles.progressLabels}>
                                                <span>0</span>
                                                <span>10</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Usage History */}
                                <div>
                                    <div className={styles.sectionHeader}>
                                        <h2 className={styles.sectionTitle}>Recent Activity</h2>
                                        <button className={styles.viewAllLink}>View All</button>
                                    </div>
                                    <div className={styles.tableContainer}>
                                        <table className={styles.table}>
                                            <thead className={styles.tableHeader}>
                                                <tr>
                                                    <th className={styles.tableHeaderCell}>Date</th>
                                                    <th className={styles.tableHeaderCell}>AI Tool</th>
                                                    <th className={styles.tableHeaderCell}>Queries</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {userData.usageHistory.map((item, index) => (
                                                    <tr key={index} className={styles.tableRow}>
                                                        <td className={styles.tableCell}>{item.date}</td>
                                                        <td className={styles.tableCell}>{item.tool}</td>
                                                        <td className={styles.tableCell}>{item.queries}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Plan Upgrade */}
                                <div className={styles.upgradeSection}>
                                    <div className={styles.upgradeCard}>
                                        <h3 className={styles.upgradeTitle}>About Our Non-Profit Mission</h3>
                                        <p className={styles.upgradeDescription}>
                                            The Future Classroom is a non-profit initiative dedicated to bringing AI tools to K-12 teachers around the world.
                                            We provide limited access to ensure all educators can benefit from these resources.
                                            Usage limits help us keep our servers running and the service available to all.
                                        </p>

                                        <p className={styles.upgradeDescription} style={{ marginTop: '1rem' }}>
                                            If you'd like to support our mission, please consider making a donation to help us expand our services
                                            and increase usage limits for all educators.
                                        </p>

                                        <div style={{ marginTop: '1.5rem' }}>
                                            <button className={styles.primaryButton}>
                                                Make a Donation
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Templates Tab Content */}
                        {activeTab === 'templates' && (
                            <div>
                                <h2 className={styles.sectionTitle}>Your Saved Templates</h2>
                                <div className={styles.templatesList}>
                                    {userData.savedTemplates.map((template) => (
                                        <div key={template.id} className={styles.templateCard}>
                                            <h3 className={styles.templateName}>{template.name}</h3>
                                            <p className={styles.templateTool}>{template.tool}</p>
                                            <p className={styles.templateDate}>Saved on {template.date}</p>
                                            <div className={styles.templateActions}>
                                                <button className={`${styles.templateActionButton} ${styles.useButton}`}>
                                                    Use Template
                                                </button>
                                                <button className={`${styles.templateActionButton} ${styles.deleteButton}`}>
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Settings Tab Content */}
                        {activeTab === 'settings' && (
                            <div>
                                <div className={styles.formSection}>
                                    <h2 className={styles.sectionTitle}>Personal Information</h2>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Full Name</label>
                                        <input
                                            type="text"
                                            className={styles.formInput}
                                            defaultValue={userData.name}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Email Address</label>
                                        <input
                                            type="email"
                                            className={styles.formInput}
                                            defaultValue={userData.email}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Role</label>
                                        <input
                                            type="text"
                                            className={styles.formInput}
                                            defaultValue={userData.role}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>School/Organization</label>
                                        <input
                                            type="text"
                                            className={styles.formInput}
                                            defaultValue={userData.school}
                                        />
                                    </div>
                                </div>

                                <div className={styles.formSection}>
                                    <h2 className={styles.formSubtitle}>Change Password</h2>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Current Password</label>
                                        <input
                                            type="password"
                                            className={styles.formInput}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>New Password</label>
                                        <input
                                            type="password"
                                            className={styles.formInput}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Confirm New Password</label>
                                        <input
                                            type="password"
                                            className={styles.formInput}
                                        />
                                    </div>
                                </div>

                                <div className={styles.formSection}>
                                    <h2 className={styles.formSubtitle}>Preferences</h2>
                                    <div className={styles.checkboxGroup}>
                                        <input type="checkbox" id="emailNotifications" className={styles.checkboxInput} defaultChecked />
                                        <label htmlFor="emailNotifications">Receive email notifications</label>
                                    </div>
                                    <div className={styles.checkboxGroup}>
                                        <input type="checkbox" id="saveHistory" className={styles.checkboxInput} defaultChecked />
                                        <label htmlFor="saveHistory">Save AI interaction history</label>
                                    </div>
                                    <div className={styles.checkboxGroup}>
                                        <input type="checkbox" id="autoSave" className={styles.checkboxInput} defaultChecked />
                                        <label htmlFor="autoSave">Auto-save generated content</label>
                                    </div>
                                </div>

                                <div className={styles.buttonGroup}>
                                    <button className={styles.saveButton}>Save Changes</button>
                                    <button className={styles.cancelButton}>Cancel</button>
                                </div>
                            </div>
                        )}

                        {/* Billing Tab Content */}
                        {activeTab === 'billing' && (
                            <div>
                                <h2 className={styles.sectionTitle}>Subscription Details</h2>
                                <div className={styles.billingInfo}>
                                    <div className={styles.billingRow}>
                                        <span className={styles.billingLabel}>Current Plan</span>
                                        <span>{userData.plan}</span>
                                    </div>
                                    <div className={styles.billingRow}>
                                        <span className={styles.billingLabel}>Billing Cycle</span>
                                        <span>Monthly</span>
                                    </div>
                                    <div className={styles.billingRow}>
                                        <span className={styles.billingLabel}>Next Invoice</span>
                                        <span>June 15, 2024</span>
                                    </div>
                                </div>

                                <h2 className={styles.sectionTitle}>Payment Methods</h2>
                                <div className={styles.paymentMethod}>
                                    <div className={styles.paymentIcon}>
                                        <svg className={styles.addIcon} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"></path>
                                            <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd"></path>
                                        </svg>
                                    </div>
                                    <div className={styles.paymentDetails}>
                                        <div className={styles.paymentName}>Visa ending in 4242</div>
                                        <div className={styles.paymentExpiry}>Expires 12/25</div>
                                    </div>
                                    <span className={styles.paymentDefault}>Default</span>
                                </div>

                                <button className={styles.addPaymentButton}>
                                    <svg className={styles.addIcon} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path>
                                    </svg>
                                    Add Payment Method
                                </button>

                                <h2 className={styles.sectionTitle}>Billing History</h2>
                                <div className={styles.tableContainer}>
                                    <table className={styles.table}>
                                        <thead className={styles.tableHeader}>
                                            <tr>
                                                <th className={styles.tableHeaderCell}>Date</th>
                                                <th className={styles.tableHeaderCell}>Invoice</th>
                                                <th className={styles.tableHeaderCell}>Amount</th>
                                                <th className={styles.tableHeaderCell}>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className={styles.tableRow}>
                                                <td className={styles.tableCell}>May 15, 2024</td>
                                                <td className={styles.tableCell}>#INV-2024-005</td>
                                                <td className={styles.tableCell}>$8.99</td>
                                                <td className={styles.tableCell}>Paid</td>
                                            </tr>
                                            <tr className={styles.tableRow}>
                                                <td className={styles.tableCell}>April 15, 2024</td>
                                                <td className={styles.tableCell}>#INV-2024-004</td>
                                                <td className={styles.tableCell}>$8.99</td>
                                                <td className={styles.tableCell}>Paid</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
} 