import pb from './pocketbase';
import { RecordModel } from 'pocketbase';

// Define the structure of a Lesson Plan based on the schema
export interface LessonPlan extends RecordModel {
    user_id: string;
    title: string;
    subject?: string;
    gradeLevel?: string;
    topic?: string;
    objectives?: string; // Markdown/Text
    duration?: string;
    materials?: string; // Markdown/Text
    activities?: any[]; // Array of blocks/components
    assessment?: string; // Markdown/Text
    standards?: string; // Markdown/Text
    is_public?: boolean;
    last_generated_content?: string;
}

const COLLECTION_NAME = 'lesson_plans';

// --- CRUD Operations ---

/**
 * Create a new lesson plan
 * @param data Partial data for the new lesson plan (requires user_id and title)
 * @returns The created lesson plan record
 */
export async function createLessonPlan(data: Partial<LessonPlan> & { user_id: string, title: string }): Promise<LessonPlan> {
    try {
        const record = await pb.collection(COLLECTION_NAME).create(data);
        return record as LessonPlan;
    } catch (error) {
        console.error('Error creating lesson plan:', error);
        throw error; // Re-throw the error for the caller to handle
    }
}

/**
 * Get a specific lesson plan by ID
 * @param id The ID of the lesson plan to retrieve
 * @returns The lesson plan record or null if not found
 */
export async function getLessonPlan(id: string): Promise<LessonPlan | null> {
    try {
        const record = await pb.collection(COLLECTION_NAME).getOne(id);
        return record as LessonPlan;
    } catch (error: any) {
        if (error.status === 404) {
            return null; // Not found
        }
        console.error('Error fetching lesson plan:', error);
        throw error;
    }
}

/**
 * Update an existing lesson plan
 * @param id The ID of the lesson plan to update
 * @param data The data to update
 * @returns The updated lesson plan record
 */
export async function updateLessonPlan(id: string, data: Partial<LessonPlan>): Promise<LessonPlan> {
    try {
        const record = await pb.collection(COLLECTION_NAME).update(id, data);
        return record as LessonPlan;
    } catch (error) {
        console.error('Error updating lesson plan:', error);
        throw error;
    }
}

/**
 * Delete a lesson plan
 * @param id The ID of the lesson plan to delete
 * @returns True if deletion was successful
 */
export async function deleteLessonPlan(id: string): Promise<boolean> {
    try {
        await pb.collection(COLLECTION_NAME).delete(id);
        return true;
    } catch (error) {
        console.error('Error deleting lesson plan:', error);
        throw error;
    }
}

/**
 * List lesson plans for the current user
 * @param page Current page number
 * @param perPage Items per page
 * @param sort Sorting string (e.g., '-created')
 * @param filter Optional filter string
 * @returns Paginated list of lesson plans
 */
export async function listUserLessonPlans(userId: string, page = 1, perPage = 20, sort = '-created', filter = '') {
    if (!userId) throw new Error('User ID is required to list lesson plans.');

    const combinedFilter = `user_id = "${userId}"${filter ? ` && (${filter})` : ''}`;

    try {
        const result = await pb.collection(COLLECTION_NAME).getList<LessonPlan>(page, perPage, {
            filter: combinedFilter,
            sort: sort,
        });
        return result;
    } catch (error) {
        console.error('Error listing user lesson plans:', error);
        throw error;
    }
}

// Add more functions as needed (e.g., listPublicLessonPlans) 