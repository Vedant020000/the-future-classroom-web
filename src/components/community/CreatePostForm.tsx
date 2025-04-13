'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createCommunityPost } from '@/lib/communityService';
import { useAuth } from '@/lib/AuthContext';
import styles from '@/app/community/page.module.css';

interface CreatePostFormProps {
    onPostCreated: () => void; // Define the callback prop type
}

export default function CreatePostForm({ onPostCreated }: CreatePostFormProps) { // Add prop to component signature
    const { user } = useAuth();
    const router = useRouter();
    const [isExpanded, setIsExpanded] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: 'discussion',
    });
    const [attachments, setAttachments] = useState<File[]>([]);
    const [error, setError] = useState('');

    // Get the user's initials for the avatar
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(part => part.charAt(0))
            .join('')
            .toUpperCase();
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAttachmentChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            // Convert FileList to array
            const filesArray = Array.from(e.target.files);
            setAttachments(filesArray);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!user) {
            router.push('/login');
            return;
        }

        if (!formData.title.trim()) {
            setError('Title is required');
            return;
        }

        if (!formData.content.trim()) {
            setError('Content is required');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            const post = await createCommunityPost({
                title: formData.title,
                content: formData.content,
                category: formData.category as 'discussion' | 'resource' | 'question' | 'announcement',
                attachments: attachments,
            });

            if (post) {
                // Reset form
                setFormData({
                    title: '',
                    content: '',
                    category: 'discussion',
                });
                setAttachments([]);
                setIsExpanded(false);
                // router.refresh(); // Refresh the page to show the new post - Replaced by callback
                onPostCreated(); // Call the callback function to trigger refresh in parent
            } else {
                setError('Failed to create post. Please try again.');
            }
        } catch (error: any) {
            setError(error.message || 'Failed to create post. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!user) {
        return (
            <div className={styles.postCreator}>
                <div className={styles.loginPrompt}>
                    <p>Please <a href="/login" className={styles.loginLink}>log in</a> to create posts.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.postCreator}>
            {!isExpanded ? (
                <div className={styles.userBar}>
                    <div className={styles.avatar}>
                        <span className={styles.avatarText}>{getInitials(user?.name || 'User')}</span>
                    </div>
                    <div className={styles.postInput}>
                        <button
                            className={styles.postInputField}
                            onClick={() => setIsExpanded(true)}
                        >
                            Share your insights, resources, or questions...
                        </button>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    {error && <div className={styles.errorMessage}>{error}</div>}

                    <div className={styles.formGroup}>
                        <label htmlFor="title" className={styles.formLabel}>Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="Enter a title for your post"
                            className={styles.formInput}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="content" className={styles.formLabel}>Content</label>
                        <textarea
                            id="content"
                            name="content"
                            value={formData.content}
                            onChange={handleInputChange}
                            placeholder="Share your thoughts, questions, or resources..."
                            className={styles.formTextarea}
                            rows={5}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="category" className={styles.formLabel}>Category</label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className={styles.formSelect}
                        >
                            <option value="discussion">Discussion</option>
                            <option value="resource">Resource</option>
                            <option value="question">Question</option>
                            <option value="announcement">Announcement</option>
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="attachments" className={styles.formLabel}>Attachments</label>
                        <input
                            type="file"
                            id="attachments"
                            name="attachments"
                            onChange={handleAttachmentChange}
                            className={styles.formFile}
                            multiple
                        />
                        <p className={styles.formHelp}>Max 5 files, 5MB each</p>
                    </div>

                    <div className={styles.formActions}>
                        <button
                            type="button"
                            className={styles.cancelButton}
                            onClick={() => setIsExpanded(false)}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={styles.primaryButton}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Posting...' : 'Post'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
} 