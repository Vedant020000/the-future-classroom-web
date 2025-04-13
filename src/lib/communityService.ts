import pb from './pocketbase';

export type CommunityPost = {
    id: string;
    user_id: string; // Reference to users collection
    title: string;
    content: string;
    likes: number;
    category: 'discussion' | 'resource' | 'question' | 'announcement';
    created: string;
    updated: string;
    attachments?: string[]; // Array of attachment filenames
    expand?: {
        user_id?: {
            id: string;
            name: string;
            avatar?: string;
            email: string;
        }
    }
};

export type Comment = {
    id: string;
    user_id: string;
    post_id: string;
    content: string;
    likes: number;
    created: string;
    updated: string;
    expand?: {
        user_id?: {
            id: string;
            name: string;
            avatar?: string;
        }
    }
};

export type PostFilter = {
    category?: string;
    searchTerm?: string;
    userId?: string;
    gradeLevel?: string;
    subject?: string;
};

/**
 * Get all community posts with optional filtering and sorting
 */
export async function getCommunityPosts(
    filter: PostFilter = {},
    page = 1,
    perPage = 20,
    sort: string = '-created' // Add optional sort parameter
): Promise<{
    posts: CommunityPost[];
    totalItems: number;
    totalPages: number;
    page: number;
}> {
    try {
        let filterString = '';

        // Apply category filter
        if (filter.category) {
            filterString += `category="${filter.category}"`;
        }

        // Apply user filter
        if (filter.userId) {
            if (filterString) filterString += ' && ';
            filterString += `user_id="${filter.userId}"`;
        }

        // Apply search filter
        if (filter.searchTerm) {
            const searchTerm = filter.searchTerm.trim();
            if (searchTerm && filterString) filterString += ' && ';
            if (searchTerm) filterString += `(title ~ "${searchTerm}" || content ~ "${searchTerm}")`;
        }

        console.log(`Fetching posts with filter: '${filterString}', sort: '${sort}'`); // Log filter/sort

        const resultList = await pb.collection('community_posts').getList(page, perPage, {
            sort: sort, // Use the sort parameter
            filter: filterString || undefined,
            expand: 'user_id',
        });

        return {
            posts: resultList.items as unknown as CommunityPost[],
            totalItems: resultList.totalItems,
            totalPages: resultList.totalPages,
            page: resultList.page,
        };
    } catch (error) {
        console.error(`Error fetching community posts (filter: '${JSON.stringify(filter)}', sort: '${sort}'):`, error);
        return {
            posts: [],
            totalItems: 0,
            totalPages: 0,
            page: 1,
        };
    }
}

/**
 * Get a single post by ID
 */
export async function getCommunityPost(postId: string): Promise<CommunityPost | null> {
    try {
        const post = await pb.collection('community_posts').getOne(postId, {
            expand: 'user_id',
        });
        return post as unknown as CommunityPost;
    } catch (error) {
        console.error('Error fetching post:', error);
        return null;
    }
}

/**
 * Create a new community post
 */
export async function createCommunityPost(post: {
    title: string;
    content: string;
    category: 'discussion' | 'resource' | 'question' | 'announcement';
    attachments?: File[];
}): Promise<CommunityPost | null> {
    try {
        // Make sure a user is logged in
        if (!pb.authStore.isValid) {
            throw new Error('User must be logged in to create a post');
        }

        const formData = new FormData();
        formData.append('title', post.title);
        formData.append('content', post.content);
        formData.append('category', post.category);
        formData.append('user_id', pb.authStore.model?.id);
        formData.append('likes', '0');

        // Add attachments if present
        if (post.attachments && post.attachments.length > 0) {
            post.attachments.forEach(file => {
                formData.append('attachments', file);
            });
        }

        const record = await pb.collection('community_posts').create(formData);
        return record as unknown as CommunityPost;
    } catch (error) {
        console.error('Error creating community post:', error);
        return null;
    }
}

/**
 * Update an existing community post
 */
export async function updateCommunityPost(
    postId: string,
    updates: Partial<CommunityPost>,
    newAttachments?: File[]
): Promise<CommunityPost | null> {
    try {
        // Make sure a user is logged in
        if (!pb.authStore.isValid) {
            throw new Error('User must be logged in to update a post');
        }

        // Get the existing post
        const existingPost = await pb.collection('community_posts').getOne(postId);

        // Check if the current user is the owner
        if (existingPost.user_id !== pb.authStore.model?.id) {
            throw new Error('Only the owner can update this post');
        }

        const formData = new FormData();
        if (updates.title) formData.append('title', updates.title);
        if (updates.content) formData.append('content', updates.content);
        if (updates.category) formData.append('category', updates.category);

        // Add new attachments if present
        if (newAttachments && newAttachments.length > 0) {
            newAttachments.forEach(file => {
                formData.append('attachments+', file);
            });
        }

        const record = await pb.collection('community_posts').update(postId, formData);
        return record as unknown as CommunityPost;
    } catch (error) {
        console.error('Error updating community post:', error);
        return null;
    }
}

/**
 * Delete a community post
 */
export async function deleteCommunityPost(postId: string): Promise<boolean> {
    try {
        // Make sure a user is logged in
        if (!pb.authStore.isValid) {
            throw new Error('User must be logged in to delete a post');
        }

        // Get the existing post
        const existingPost = await pb.collection('community_posts').getOne(postId);

        // Check if the current user is the owner
        if (existingPost.user_id !== pb.authStore.model?.id) {
            throw new Error('Only the owner can delete this post');
        }

        await pb.collection('community_posts').delete(postId);
        return true;
    } catch (error) {
        console.error('Error deleting community post:', error);
        return false;
    }
}

/**
 * Like a post (toggle like)
 */
export async function toggleLikePost(postId: string): Promise<boolean> {
    try {
        // Make sure a user is logged in
        if (!pb.authStore.isValid) {
            throw new Error('User must be logged in to like a post');
        }

        // Get the current post to get the current like count
        const post = await pb.collection('community_posts').getOne(postId);

        // TODO: In a real app, you'd want to track which users liked which posts
        // For now, we'll just increment the like count
        const newLikes = (post.likes || 0) + 1;

        await pb.collection('community_posts').update(postId, {
            likes: newLikes,
        });

        return true;
    } catch (error) {
        console.error('Error liking post:', error);
        return false;
    }
}

/**
 * Get comments for a post
 */
export async function getCommentsForPost(postId: string): Promise<Comment[]> {
    try {
        const comments = await pb.collection('comments').getFullList({
            filter: `post_id="${postId}"`,
            sort: 'created',
            expand: 'user_id',
        });
        return comments as unknown as Comment[];
    } catch (error) {
        console.error('Error fetching comments:', error);
        return [];
    }
}

/**
 * Add a comment to a post
 */
export async function addComment(postId: string, content: string): Promise<Comment | null> {
    try {
        // Make sure a user is logged in
        if (!pb.authStore.isValid) {
            throw new Error('User must be logged in to comment');
        }

        const data = {
            user_id: pb.authStore.model?.id,
            post_id: postId,
            content: content,
            likes: 0,
        };

        const comment = await pb.collection('comments').create(data);
        return comment as unknown as Comment;
    } catch (error) {
        console.error('Error adding comment:', error);
        return null;
    }
}

/**
 * Delete a comment
 */
export async function deleteComment(commentId: string): Promise<boolean> {
    try {
        // Make sure a user is logged in
        if (!pb.authStore.isValid) {
            throw new Error('User must be logged in to delete a comment');
        }

        // Get the existing comment
        const existingComment = await pb.collection('comments').getOne(commentId);

        // Check if the current user is the owner
        if (existingComment.user_id !== pb.authStore.model?.id) {
            throw new Error('Only the owner can delete this comment');
        }

        await pb.collection('comments').delete(commentId);
        return true;
    } catch (error) {
        console.error('Error deleting comment:', error);
        return false;
    }
} 