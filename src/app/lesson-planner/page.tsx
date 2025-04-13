'use client';

import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import LessonPlannerWorkspace from '@/components/lesson-planner/LessonPlannerWorkspace'; // Import the main component

export default function LessonPlannerPage() {
    const { user, isLoading, isAuthenticated } = useAuth();
    const router = useRouter();
    const [lessonPlanId, setLessonPlanId] = useState<string | null>(null);

    if (!isLoading && !isAuthenticated) {
        router.push('/login?from=lesson-planner');
        return <div className={styles.loadingContainer}><div className={styles.spinner}></div></div>;
    }

    if (isLoading) {
        return <div className={styles.loadingContainer}><div className={styles.spinner}></div></div>;
    }

    const handleStartNew = () => {
        setLessonPlanId('new');
        console.log("Starting new lesson plan");
    };

    const handleEditExisting = () => {
        console.log("Select existing lesson plan (TODO)");
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className={styles.pageContainer}>
                {/* Conditionally render title based on state */}
                {!lessonPlanId ? (
                    <h1 className={styles.title}>Lesson Planner</h1>
                ) : (
                    <h1 className={styles.title}>Interactive Lesson Planner</h1> // Keep title when workspace is active
                )}

                {!lessonPlanId && (
                    <div className={styles.initialChoice}>
                        <h2>Welcome, {user?.name || 'Teacher'}!</h2>
                        <p>How would you like to start?</p>
                        <div className={styles.buttonGroup}>
                            <button onClick={handleStartNew} className={styles.primaryButton}>
                                Start New Lesson Plan
                            </button>
                            <button onClick={handleEditExisting} className={styles.secondaryButton} disabled>
                                Edit Existing Plan (Coming Soon)
                            </button>
                        </div>
                    </div>
                )}

                {/* Render the workspace when starting new or editing */}
                {(lessonPlanId === 'new' /* || (lessonPlanId && lessonPlanId !== 'new') */) && (
                    <LessonPlannerWorkspace lessonPlanId={lessonPlanId} />
                )}
            </div>
        </DndProvider>
    );
} 