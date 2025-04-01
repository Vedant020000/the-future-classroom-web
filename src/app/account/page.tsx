'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';
import pb from '@/lib/pocketbase';

export default function AccountPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [userData, setUserData] = useState<any>(null);
    const [usageStats, setUsageStats] = useState<any>(null);
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [updateError, setUpdateError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        avatar: null as File | null,
    });

    useEffect(() => {
        const checkAuth = async () => {
            try {
                if (!pb.authStore.isValid) {
                    router.push('/login');
                    return;
                }

                // Get current user data
                const user = pb.authStore.model;
                setUserData(user);
                setFormData({
                    name: user?.name || '',
                    email: user?.email || '',
                    avatar: null,
                });

                // Fetch usage stats from the ai_usage collection
                try {
                    const usageRecord = await pb.collection('ai_usage').getFirstListItem(
                        `user_id="${user?.id}"`,
                        { sort: '-created' }
                    );
                    setUsageStats(usageRecord);
                } catch (error) {
                    // If no usage record exists, create a default one
                    const defaultUsage = {
                        user_id: user?.id,
                        daily_queries: 0,
                        daily_limit: 25,
                        saved_templates: 0,
                        templates_limit: 10,
                    };

                    try {
                        const newUsageRecord = await pb.collection('ai_usage').create(defaultUsage);
                        setUsageStats(newUsageRecord);
                    } catch (createError) {
                        console.error('Error creating usage record:', createError);
                    }
                }

                setIsLoading(false);
            } catch (error) {
                console.error('Auth error:', error);
                router.push('/login');
            }
        };

        checkAuth();
    }, [router]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, files } = e.target;

        if (name === 'avatar' && files && files.length > 0) {
            setFormData(prev => ({
                ...prev,
                avatar: files[0],
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setUpdateSuccess(false);
        setUpdateError('');

        try {
            const data: Record<string, any> = {};

            if (formData.name !== userData.name) {
                data.name = formData.name;
            }

            if (formData.avatar) {
                data.avatar = formData.avatar;
            }

            // Only update if there are changes
            if (Object.keys(data).length > 0) {
                const updated = await pb.collection('users').update(userData.id, data);
                setUserData(updated);
                setUpdateSuccess(true);

                // Refresh auth store with updated user data
                const authData = { ...pb.authStore.model, ...updated };
                pb.authStore.save(pb.authStore.token, authData);
            } else {
                setUpdateSuccess(true);
            }
        } catch (error: any) {
            console.error('Update error:', error);
            setUpdateError(error.message || 'Failed to update profile');
        }
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(part => part.charAt(0))
            .join('')
            .toUpperCase();
    };

    if (isLoading) {
        return (
            <div className={styles.page}>
                <div className={styles.loadingContainer}>
                    <div className={styles.spinner}></div>
                    <p>Loading your account...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <section className={styles.headerSection}>
                <div className={styles.container}>
                    <div className={styles.headerContent}>
                        <div className={styles.profileLayout}>
                            <div className={styles.avatar}>
                                {userData?.avatar ? (
                                    <Image
                                        src={pb.getFileUrl(userData, userData.avatar)}
                                        alt={userData.name || 'User'}
                                        width={96}
                                        height={96}
                                        className={styles.avatarImage}
                                    />
                                ) : (
                                    getInitials(userData?.name || 'User')
                                )}
                            </div>
                            <div className={styles.userInfo}>
                                <h1 className={styles.userName}>{userData?.name || 'User'}</h1>
                                <p className={styles.userRole}>
                                    {userData?.verified ? 'Verified User' : 'Unverified User'}
                                </p>
                                <p className={styles.userEmail}>{userData?.email}</p>
                                <div className={styles.badgeContainer}>
                                    <span className={styles.planBadge}>Free Plan</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className={styles.container}>
                <div className={styles.tabContainer}>
                    <div className={styles.tabs}>
                        <button
                            className={`${styles.tabButton} ${activeTab === 'overview' ? styles.activeTab : ''}`}
                            onClick={() => setActiveTab('overview')}
                        >
                            Overview
                        </button>
                        <button
                            className={`${styles.tabButton} ${activeTab === 'profile' ? styles.activeTab : ''}`}
                            onClick={() => setActiveTab('profile')}
                        >
                            Profile Settings
                        </button>
                        <button
                            className={`${styles.tabButton} ${activeTab === 'usage' ? styles.activeTab : ''}`}
                            onClick={() => setActiveTab('usage')}
                        >
                            Usage & Statistics
                        </button>
                    </div>

                    <div className={styles.tabContent}>
                        {activeTab === 'overview' && (
                            <>
                                <section className={styles.statsSection}>
                                    <h2 className={styles.sectionTitle}>Usage Statistics</h2>
                                    <div className={styles.statsGrid}>
                                        <div className={styles.statsCard}>
                                            <div className={styles.statsHeader}>
                                                <h3 className={styles.statsTitle}>Daily Queries</h3>
                                                <p className={styles.statsSubtitle}>Refreshes daily at midnight</p>
                                            </div>
                                            <p className={styles.statsValue}>{usageStats?.daily_queries || 0} / {usageStats?.daily_limit || 25}</p>
                                            <div className={styles.progressBar}>
                                                <div
                                                    className={`${styles.progressFill} ${styles.primaryFill}`}
                                                    style={{ width: `${Math.min(((usageStats?.daily_queries || 0) / (usageStats?.daily_limit || 25)) * 100, 100)}%` }}
                                                ></div>
                                            </div>
                                            <div className={styles.progressLabels}>
                                                <span>0</span>
                                                <span>{usageStats?.daily_limit || 25}</span>
                                            </div>
                                        </div>
                                        <div className={styles.statsCard}>
                                            <div className={styles.statsHeader}>
                                                <h3 className={styles.statsTitle}>Saved Templates</h3>
                                                <p className={styles.statsSubtitle}>Total templates saved</p>
                                            </div>
                                            <p className={styles.statsValue}>{usageStats?.saved_templates || 0} / {usageStats?.templates_limit || 10}</p>
                                            <div className={styles.progressBar}>
                                                <div
                                                    className={`${styles.progressFill} ${styles.accentFill}`}
                                                    style={{ width: `${Math.min(((usageStats?.saved_templates || 0) / (usageStats?.templates_limit || 10)) * 100, 100)}%` }}
                                                ></div>
                                            </div>
                                            <div className={styles.progressLabels}>
                                                <span>0</span>
                                                <span>{usageStats?.templates_limit || 10}</span>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <section className={styles.infoSection}>
                                    <h2 className={styles.sectionTitle}>Our Mission</h2>
                                    <div className={styles.infoCard}>
                                        <p className={styles.infoParagraph}>
                                            The Future Classroom is a non-profit initiative designed to bring AI-powered educational tools to students and educators around the world.
                                            Our mission is to democratize access to cutting-edge educational technology and make learning more engaging, personalized, and effective.
                                        </p>
                                        <p className={styles.infoParagraph}>
                                            As a free user, you have access to a limited number of daily queries and saved templates.
                                            We rely on donations and support from our community to keep these services accessible to everyone.
                                        </p>
                                        <div className={styles.buttonContainer}>
                                            <Link href="/donate" className={styles.primaryButton}>
                                                Support Our Mission
                                            </Link>
                                        </div>
                                    </div>
                                </section>
                            </>
                        )}

                        {activeTab === 'profile' && (
                            <section>
                                <h2 className={styles.sectionTitle}>Profile Settings</h2>

                                {updateSuccess && (
                                    <div className={`${styles.messageBox} ${styles.successMessage}`}>
                                        Profile updated successfully!
                                    </div>
                                )}

                                {updateError && (
                                    <div className={`${styles.messageBox} ${styles.errorMessage}`}>
                                        {updateError}
                                    </div>
                                )}

                                <form className={styles.profileForm} onSubmit={handleUpdateProfile}>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="name" className={styles.formLabel}>Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className={styles.formInput}
                                            placeholder="Your name"
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label htmlFor="email" className={styles.formLabel}>Email</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            className={styles.formInput}
                                            disabled
                                        />
                                        <p className={styles.formHelp}>Email cannot be changed</p>
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label htmlFor="avatar" className={styles.formLabel}>Profile Picture</label>
                                        <input
                                            type="file"
                                            id="avatar"
                                            name="avatar"
                                            onChange={handleInputChange}
                                            className={styles.formInput}
                                            accept="image/*"
                                        />
                                        <p className={styles.formHelp}>Recommended size: 200x200 pixels</p>
                                    </div>

                                    <div className={styles.buttonContainer}>
                                        <button type="submit" className={styles.primaryButton}>
                                            Update Profile
                                        </button>
                                    </div>
                                </form>
                            </section>
                        )}

                        {activeTab === 'usage' && (
                            <section>
                                <h2 className={styles.sectionTitle}>Usage & Statistics</h2>

                                <div className={styles.usageCard}>
                                    <h3 className={styles.usageTitle}>Your Current Plan</h3>
                                    <p className={styles.usageDescription}>
                                        You're currently on the <strong>Free Plan</strong>. This provides you with limited access to our educational AI tools.
                                    </p>

                                    <ul className={styles.usageList}>
                                        <li className={styles.usageItem}>
                                            <span className={styles.usageLabel}>Daily AI Queries</span>
                                            <span className={styles.usageValue}>{usageStats?.daily_limit || 25} queries</span>
                                        </li>
                                        <li className={styles.usageItem}>
                                            <span className={styles.usageLabel}>Saved Templates</span>
                                            <span className={styles.usageValue}>{usageStats?.templates_limit || 10} templates</span>
                                        </li>
                                        <li className={styles.usageItem}>
                                            <span className={styles.usageLabel}>Model Access</span>
                                            <span className={styles.usageValue}>Standard models</span>
                                        </li>
                                        <li className={styles.usageItem}>
                                            <span className={styles.usageLabel}>Community Features</span>
                                            <span className={styles.usageValue}>Read access only</span>
                                        </li>
                                    </ul>

                                    <div className={styles.buttonContainer}>
                                        <Link href="/donate" className={styles.primaryButton}>
                                            Upgrade with Donation
                                        </Link>
                                    </div>

                                    <div className={styles.usageNotes}>
                                        <h4 className={styles.notesTitle}>Note</h4>
                                        <p className={styles.notesParagraph}>
                                            The Future Classroom is a non-profit initiative. We provide enhanced access to users who support our mission through donations.
                                            All proceeds go directly to maintaining and improving our services and expanding access to educational AI tools.
                                        </p>
                                        <p className={styles.notesParagraph}>
                                            For educational institutions interested in bulk access for students, please{' '}
                                            <a href="mailto:contact@futureclassroom.org" className={styles.contactLink}>contact us</a> for special arrangements.
                                        </p>
                                    </div>
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
} 