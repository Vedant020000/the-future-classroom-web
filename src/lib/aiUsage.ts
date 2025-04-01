import pb from './pocketbase';

export type AiUsageRecord = {
    id: string;
    user_id: string;
    daily_queries: number;
    daily_limit: number;
    saved_templates: number;
    templates_limit: number;
    last_reset: string;
};

/**
 * Get the current usage statistics for a user
 * @param userId The user ID to get stats for
 * @returns The usage record or null if not found
 */
export async function getUserUsage(userId: string): Promise<AiUsageRecord | null> {
    if (!userId) return null;

    try {
        const record = await pb.collection('ai_usage').getFirstListItem(`user_id="${userId}"`, {
            sort: '-created',
        });

        // Check if we need to reset daily stats (if last_reset is not today)
        const lastResetDate = new Date(record.last_reset);
        const today = new Date();

        if (
            lastResetDate.getFullYear() !== today.getFullYear() ||
            lastResetDate.getMonth() !== today.getMonth() ||
            lastResetDate.getDate() !== today.getDate()
        ) {
            // Reset daily stats
            const updated = await pb.collection('ai_usage').update(record.id, {
                daily_queries: 0,
                last_reset: new Date().toISOString(),
            });

            return updated as unknown as AiUsageRecord;
        }

        return record as unknown as AiUsageRecord;
    } catch (error) {
        // If no record exists, create a default one
        try {
            const defaultUsage = {
                user_id: userId,
                daily_queries: 0,
                daily_limit: 25,
                saved_templates: 0,
                templates_limit: 10,
                last_reset: new Date().toISOString(),
            };

            const newRecord = await pb.collection('ai_usage').create(defaultUsage);
            return newRecord as unknown as AiUsageRecord;
        } catch (createError) {
            console.error('Error creating usage record:', createError);
            return null;
        }
    }
}

/**
 * Increment the daily query count for a user
 * @param userId The user ID to update
 * @returns The updated usage record or null if failed
 */
export async function incrementDailyQueries(userId: string): Promise<AiUsageRecord | null> {
    if (!userId) return null;

    try {
        const usageRecord = await getUserUsage(userId);

        if (!usageRecord) return null;

        // Increment daily queries
        const updated = await pb.collection('ai_usage').update(usageRecord.id, {
            daily_queries: usageRecord.daily_queries + 1,
        });

        return updated as unknown as AiUsageRecord;
    } catch (error) {
        console.error('Error incrementing daily queries:', error);
        return null;
    }
}

/**
 * Increment the saved templates count for a user
 * @param userId The user ID to update
 * @returns The updated usage record or null if failed
 */
export async function incrementSavedTemplates(userId: string): Promise<AiUsageRecord | null> {
    if (!userId) return null;

    try {
        const usageRecord = await getUserUsage(userId);

        if (!usageRecord) return null;

        // Increment saved templates
        const updated = await pb.collection('ai_usage').update(usageRecord.id, {
            saved_templates: usageRecord.saved_templates + 1,
        });

        return updated as unknown as AiUsageRecord;
    } catch (error) {
        console.error('Error incrementing saved templates:', error);
        return null;
    }
}

/**
 * Check if a user has exceeded their daily query limit
 * @param userId The user ID to check
 * @returns True if the user can make more queries, false if they've reached the limit
 */
export async function canMakeQuery(userId: string): Promise<boolean> {
    if (!userId) return false;

    try {
        const usageRecord = await getUserUsage(userId);

        if (!usageRecord) return false;

        return usageRecord.daily_queries < usageRecord.daily_limit;
    } catch (error) {
        console.error('Error checking query allowance:', error);
        return false;
    }
}

/**
 * Check if a user has exceeded their templates limit
 * @param userId The user ID to check
 * @returns True if the user can save more templates, false if they've reached the limit
 */
export async function canSaveTemplate(userId: string): Promise<boolean> {
    if (!userId) return false;

    try {
        const usageRecord = await getUserUsage(userId);

        if (!usageRecord) return false;

        return usageRecord.saved_templates < usageRecord.templates_limit;
    } catch (error) {
        console.error('Error checking template allowance:', error);
        return false;
    }
} 