import pb from './pocketbase';
import { RecordModel, ListResult } from 'pocketbase';

export interface AssignedWork {
    id: string;
    title: string;
    dueDate: string;
    subject: string;
}

export interface Announcement {
    id: string;
    title: string;
    date: string;
    content: string;
}

export interface ProgressData {
    id?: string;
    completedTasks: number;
    totalTasks: number;
    averageScore: number;
    user_id?: string;
}

export interface DashboardData {
    recentLessonPlans: RecordModel[];
    assignedWork: AssignedWork[];
    progressData: ProgressData | null;
    announcements: Announcement[];
}

/**
 * Fetches all dashboard data for the current user from PocketBase
 * @param userId The ID of the current user
 * @returns Dashboard data including lesson plans, assignments, progress, and announcements
 */
export async function fetchDashboardData(userId: string): Promise<DashboardData> {
    if (!userId) {
        throw new Error('User ID is required to fetch dashboard data');
    }

    console.log(`Fetching dashboard data for user: ${userId}`);

    try {
        // Fetch recent lesson plans (Top 3)
        const lessonPlansPromise = pb.collection('lesson_plans').getList<RecordModel>(1, 3, {
            filter: `user_id="${userId}"`,
            sort: '-created'
        });

        // Fetch assigned work (Example: Fetch all assigned work for the user)
        const assignedWorkPromise = pb.collection('assigned_work').getFullList<AssignedWork>({
            filter: `user_id="${userId}"`,
            sort: 'dueDate'
        });

        // Fetch progress data (Assuming one record per user)
        const progressDataPromise = pb.collection('progress_data').getFirstListItem<ProgressData>(
            `user_id="${userId}"`,
            { requestKey: `progress-${userId}` }
        ).catch(err => {
            if (err.status === 404) {
                console.warn(`No progress data found for user ${userId}`);
                return null;
            }
            console.error('Error fetching progress data:', err);
            throw err;
        });

        // Fetch announcements (Example: Fetch latest 5 general announcements)
        const announcementsPromise = pb.collection('announcements').getList<Announcement>(1, 5, {
            sort: '-date'
        });

        const [lessonPlansResult, assignedWorkResult, progressDataResult, announcementsResult] = await Promise.all([
            lessonPlansPromise,
            assignedWorkPromise,
            progressDataPromise,
            announcementsPromise
        ]);

        console.log('Dashboard data fetched successfully');

        return {
            recentLessonPlans: lessonPlansResult.items,
            assignedWork: assignedWorkResult,
            progressData: progressDataResult,
            announcements: announcementsResult.items
        };

    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        throw error;
    }
}

/**
 * Fetches only the recent lesson plans for the current user
 * @param userId The ID of the current user
 * @param limit The maximum number of lesson plans to fetch
 * @returns Array of recent lesson plans
 */
export async function fetchRecentLessonPlans(userId: string, limit = 3): Promise<RecordModel[]> {
    if (!userId) {
        throw new Error('User ID is required to fetch recent lesson plans');
    }
    console.log(`Fetching recent lesson plans for user: ${userId}, limit: ${limit}`);
    try {
        const lessonPlans = await pb.collection('lesson_plans').getList<RecordModel>(1, limit, {
            filter: `user_id="${userId}"`,
            sort: '-created'
        });
        return lessonPlans.items;
    } catch (error) {
        console.error('Error fetching recent lesson plans:', error);
        throw error;
    }
}

// Removed mock data functions: fetchAssignedWork, fetchProgressData, fetchAnnouncements 