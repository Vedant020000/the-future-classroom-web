'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';
import { useAuth } from '@/lib/AuthContext';
import PbImage from '@/components/PbImage';
import {
    DashboardData,
    fetchDashboardData,
    AssignedWork,
    Announcement
} from '@/lib/dashboardService';
import { RecordModel } from 'pocketbase';

const aiTools = [
    {
        id: 'raina',
        name: 'Raina',
        description: 'Your AI teaching assistant that helps you with daily teaching tasks',
        icon: '🤖',
        color: '#4f46e5',
        path: '/ai-tools/raina'
    },
    {
        id: 'lesson-generator',
        name: 'Lesson Generator',
        description: 'Create comprehensive lesson plans in minutes',
        icon: '📝',
        color: '#0ea5e9',
        path: '/ai-tools/lesson-generator'
    },
    {
        id: 'quiz-creator',
        name: 'Quiz Creator',
        description: 'Generate customized quizzes and assessments',
        icon: '❓',
        color: '#ec4899',
        path: '/ai-tools/quiz-creator'
    },
    {
        id: 'essay-helper',
        name: 'Essay Helper',
        description: 'Guide students with structured essay writing assistance',
        icon: '📄',
        color: '#f59e0b',
        path: '/ai-tools/essay-helper'
    },
    {
        id: 'study-assistant',
        name: 'Study Assistant',
        description: 'Personalized study materials and flashcards',
        icon: '📚',
        color: '#10b981',
        path: '/ai-tools/study-assistant'
    }
];

export default function StudentDashboard() {
    const router = useRouter();
    const { user, isLoading, isAuthenticated } = useAuth();
    const [dashboardData, setDashboardData] = useState<DashboardData>({
        recentLessonPlans: [],
        assignedWork: [],
        progressData: {
            completedTasks: 0,
            totalTasks: 0,
            averageScore: 0
        },
        announcements: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDashboardData = async () => {
            if (!isAuthenticated && !isLoading) {
                router.push('/login?from=dashboard');
                return;
            }

            if (!isLoading && isAuthenticated && user?.id) {
                try {
                    const data = await fetchDashboardData(user.id);
                    setDashboardData(data);
                    setLoading(false);
                } catch (error) {
                    console.error('Error loading dashboard data:', error);
                    setLoading(false);
                }
            }
        };

        loadDashboardData();
    }, [isLoading, isAuthenticated, user, router]);

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(part => part.charAt(0))
            .join('')
            .toUpperCase();
    };

    if (isLoading || loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <p>Loading your dashboard...</p>
            </div>
        );
    }

    return (
        <div className={styles.dashboardContainer}>
            {/* Header Section */}
            <section className={styles.welcomeSection}>
                <div className={styles.welcomeContent}>
                    <div className={styles.userProfile}>
                        <div className={styles.avatar}>
                            {user?.avatar ? (
                                <PbImage
                                    record={user}
                                    filename={user.avatar}
                                    alt={user.name || 'User'}
                                    width={64}
                                    height={64}
                                    className={styles.avatarImage}
                                />
                            ) : (
                                <div className={styles.avatarFallback}>
                                    {getInitials(user?.name || 'User')}
                                </div>
                            )}
                        </div>
                        <div>
                            <h1 className={styles.welcomeHeading}>Welcome back, {user?.name || 'Student'}!</h1>
                            <p className={styles.todayDate}>
                                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                        </div>
                    </div>
                    <div className={styles.statsOverview}>
                        <div className={styles.statCard}>
                            <span className={styles.statNumber}>{dashboardData.progressData.completedTasks}</span>
                            <span className={styles.statLabel}>Tasks Completed</span>
                        </div>
                        <div className={styles.statCard}>
                            <span className={styles.statNumber}>{dashboardData.recentLessonPlans.length}</span>
                            <span className={styles.statLabel}>Lesson Plans</span>
                        </div>
                        <div className={styles.statCard}>
                            <span className={styles.statNumber}>{dashboardData.progressData.averageScore}%</span>
                            <span className={styles.statLabel}>Average Score</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* AI Tools Section */}
            <section className={styles.sectionContainer}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>AI Tools</h2>
                    <Link href="/ai-tools" className={styles.viewAllLink}>
                        View All Tools
                    </Link>
                </div>
                <div className={styles.toolsGrid}>
                    {aiTools.map((tool) => (
                        <Link href={tool.path} key={tool.id} className={styles.toolCard} style={{ borderTop: `4px solid ${tool.color}` }}>
                            <div className={styles.toolIcon} style={{ backgroundColor: `${tool.color}20` }}>
                                <span>{tool.icon}</span>
                            </div>
                            <h3 className={styles.toolName}>{tool.name}</h3>
                            <p className={styles.toolDescription}>{tool.description}</p>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Dashboard Grid */}
            <div className={styles.dashboardLayout}>
                <div className={styles.mainColumn}>
                    {/* Recent Lesson Plans / Activities */}
                    <div className={styles.dashboardCard}>
                        <div className={styles.cardHeader}>
                            <h2>Recent Lesson Plans</h2>
                            <Link href="/lesson-planner" className={styles.viewAllLink}>
                                View All
                            </Link>
                        </div>
                        <div className={styles.cardContent}>
                            {dashboardData.recentLessonPlans.length > 0 ? (
                                <ul className={styles.lessonList}>
                                    {dashboardData.recentLessonPlans.map((lesson: RecordModel) => (
                                        <li key={lesson.id} className={styles.lessonItem}>
                                            <Link href={`/lesson-planner?id=${lesson.id}`}>
                                                <span className={styles.lessonTitle}>{lesson.title || 'Untitled Lesson'}</span>
                                                <span className={styles.lessonDate}>
                                                    {new Date(lesson.created).toLocaleDateString()}
                                                </span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className={styles.emptyState}>
                                    <div className={styles.emptyStateIcon}>📝</div>
                                    <p>No recent lesson plans found.</p>
                                    <Link href="/lesson-planner" className={styles.emptyStateButton}>
                                        Create a Lesson Plan
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Assigned Work / Homework */}
                    <div className={styles.dashboardCard}>
                        <div className={styles.cardHeader}>
                            <h2>Assigned Work</h2>
                            <Link href="/assignments" className={styles.viewAllLink}>
                                View All
                            </Link>
                        </div>
                        <div className={styles.cardContent}>
                            {dashboardData.assignedWork.length > 0 ? (
                                <ul className={styles.assignmentList}>
                                    {dashboardData.assignedWork.map((assignment: AssignedWork) => (
                                        <li key={assignment.id} className={styles.assignmentItem}>
                                            <div className={styles.assignmentInfo}>
                                                <span className={styles.assignmentTitle}>{assignment.title}</span>
                                                <span className={styles.assignmentSubject}>{assignment.subject}</span>
                                            </div>
                                            <span className={styles.assignmentDue}>Due: {assignment.dueDate}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className={styles.emptyState}>
                                    <div className={styles.emptyStateIcon}>📚</div>
                                    <p>No assigned work at the moment.</p>
                                    <Link href="/ai-tools/quiz-creator" className={styles.emptyStateButton}>
                                        Create an Assignment
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className={styles.sideColumn}>
                    {/* Progress Tracking */}
                    <div className={styles.dashboardCard}>
                        <div className={styles.cardHeader}>
                            <h2>Your Progress</h2>
                        </div>
                        <div className={styles.cardContent}>
                            <div className={styles.progressChart}>
                                <div className={styles.progressCircle}>
                                    <div
                                        className={styles.progressFill}
                                        style={{
                                            background: `conic-gradient(#3291ff ${(dashboardData.progressData.completedTasks / dashboardData.progressData.totalTasks) * 360}deg, rgba(255, 255, 255, 0.1) 0deg)`
                                        }}
                                    ></div>
                                    <div className={styles.progressInner}>
                                        <span className={styles.progressPercent}>
                                            {Math.round((dashboardData.progressData.completedTasks / dashboardData.progressData.totalTasks) * 100)}%
                                        </span>
                                    </div>
                                </div>
                                <div className={styles.progressLegend}>
                                    <div className={styles.progressLegendItem}>
                                        <span className={styles.legendDot} style={{ backgroundColor: '#3291ff' }}></span>
                                        <span>Completed: {dashboardData.progressData.completedTasks}</span>
                                    </div>
                                    <div className={styles.progressLegendItem}>
                                        <span className={styles.legendDot} style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}></span>
                                        <span>Remaining: {dashboardData.progressData.totalTasks - dashboardData.progressData.completedTasks}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Announcements */}
                    <div className={styles.dashboardCard}>
                        <div className={styles.cardHeader}>
                            <h2>Announcements</h2>
                        </div>
                        <div className={styles.cardContent}>
                            {dashboardData.announcements.length > 0 ? (
                                <ul className={styles.announcementList}>
                                    {dashboardData.announcements.map((announcement: Announcement) => (
                                        <li key={announcement.id} className={styles.announcementItem}>
                                            <div className={styles.announcementHeader}>
                                                <span className={styles.announcementTitle}>{announcement.title}</span>
                                                <span className={styles.announcementDate}>{announcement.date}</span>
                                            </div>
                                            <p className={styles.announcementContent}>{announcement.content}</p>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className={styles.emptyState}>
                                    <div className={styles.emptyStateIcon}>📢</div>
                                    <p>No announcements at this time.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 