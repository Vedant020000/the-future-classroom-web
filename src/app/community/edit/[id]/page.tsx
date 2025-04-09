'use client';

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import styles from '../../page.module.css';
import { useAuth } from '@/lib/AuthContext';
import { getCommunityPost, updateCommunityPost, CommunityPost } from '@/lib/communityService';

export default function EditPostPage() {
    const { id } = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: 'discussion'
    });
    const [newAttachments, setNewAttachments] = useState<File[]>([]);
    const [post, setPost] = useState<CommunityPost | null>(null);

    useEffect(() => {
        if (id) {
            loadPost(id.toString());
        }
    }, [id]);

    const loadPost = async (postId: string) => {
        setIsLoading(true);
        setError('');

        try {
            const postData = await getCommunityPost(postId);
            if (!postData) {
                throw new Error('Post not found');
            }

            // Check if the current user is the author
            if (!user || user.id !== postData.user_id) {
                throw new Error('You are not authorized to edit this post');
            }

            setPost(postData);
            setFormData({
                title: postData.title,
                content: postData.content,
                category: postData.category
            });
        } catch (err: any) {
            setError(err.message || 'Failed to load post. Please try again.');
        } finally {
            setIsLoading(false);
        }
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
            setNewAttachments(filesArray);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!user || !post) {
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
            const updatedPost = await updateCommunityPost(
                post.id,
                {
                    title: formData.title,
                    content: formData.content,
                    category: formData.category as 'discussion' | 'resource' | 'question' | 'announcement',
                },
                newAttachments.length > 0 ? newAttachments : undefined
            );

            if (updatedPost) {
                router.push(`/community/post/${post.id}`);
            } else {
                setError('Failed to update post. Please try again.');
            }
        } catch (error: any) {
            setError(error.message || 'Failed to update post. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className={styles.page}>
                <div className={styles.container}>
                    <div className={styles.loadingContainer}>
                        <div className={styles.spinner}></div>
                        <p>Loading post...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className={styles.page}>
                <div className={styles.container}>
                    <div className={styles.errorContainer}>
                        <h2>Error</h2>
                        <p>{error || 'Post not found'}</p>
                        <Link href="/community" className={styles.primaryButton}>
                            Back to Community
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <section className={styles.mainSection}>
                <div className={styles.container}>
                    <div className={styles.editPostLayout}>
                        <div className={styles.breadcrumbs}>
                            <Link href="/community" className={styles.breadcrumbLink}>
                                Community
                            </Link>
                            <span className={styles.breadcrumbSeparator}>/</span>
                            <Link href={`/community/post/${post.id}`} className={styles.breadcrumbLink}>
                                Post
                            </Link>
                            <span className={styles.breadcrumbSeparator}>/</span>
                            <span className={styles.breadcrumbCurrent}>Edit</span>
                        </div>

                        <div className={styles.editPostCard}>
                            <h1 className={styles.editPostTitle}>Edit Your Post</h1>

                            <form onSubmit={handleSubmit} className={styles.editPostForm}>
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
                                        rows={10}
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
                                    <label htmlFor="newAttachments" className={styles.formLabel}>
                                        Add New Attachments
                                    </label>
                                    <input
                                        type="file"
                                        id="newAttachments"
                                        name="newAttachments"
                                        onChange={handleAttachmentChange}
                                        className={styles.formFile}
                                        multiple
                                    />
                                    <p className={styles.formHelp}>
                                        These will be added to any existing attachments. Max 5 files, 5MB each.
                                    </p>
                                </div>

                                <div className={styles.formActions}>
                                    <Link
                                        href={`/community/post/${post.id}`}
                                        className={styles.cancelButton}
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        className={styles.primaryButton}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Updating...' : 'Update Post'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
} 