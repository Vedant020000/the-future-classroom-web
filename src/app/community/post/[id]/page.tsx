'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import PbImage from '@/components/PbImage';
import styles from '../../page.module.css';
import { useAuth } from '@/lib/AuthContext';
import { getCommunityPost, getCommentsForPost, addComment, Comment, CommunityPost, toggleLikePost } from '@/lib/communityService';

export default function PostDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const [post, setPost] = useState<CommunityPost | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [likeCount, setLikeCount] = useState(0);
    const [commentText, setCommentText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

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
            setPost(postData);
            setLikeCount(postData.likes || 0);

            const commentsData = await getCommentsForPost(postId);
            setComments(commentsData);
        } catch (err: any) {
            setError(err.message || 'Failed to load post. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLike = async () => {
        if (!post || !user) return;

        const success = await toggleLikePost(post.id);
        if (success) {
            setLikeCount(prev => prev + 1);
        }
    };

    const handleSubmitComment = async (e: FormEvent) => {
        e.preventDefault();

        if (!user) {
            router.push('/login');
            return;
        }

        if (!post || !commentText.trim()) return;

        setIsSubmitting(true);

        try {
            const newComment = await addComment(post.id, commentText);
            if (newComment) {
                // Add the expanded user info manually
                const commentWithUser = {
                    ...newComment,
                    expand: {
                        user_id: {
                            id: user.id,
                            name: user.name || 'Anonymous',
                            avatar: user.avatar,
                        }
                    }
                } as Comment;

                setComments(prev => [...prev, commentWithUser]);
                setCommentText('');
            }
        } catch (err) {
            console.error('Failed to add comment:', err);
        } finally {
            setIsSubmitting(false);
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

    const author = post.expand?.user_id || { id: post.user_id, name: 'Unknown User' };
    const timeAgo = post.created
        ? formatDistanceToNow(new Date(post.created), { addSuffix: true })
        : 'recently';

    return (
        <div className={styles.page}>
            <section className={styles.mainSection}>
                <div className={styles.container}>
                    <div className={styles.postDetailLayout}>
                        <div className={styles.breadcrumbs}>
                            <Link href="/community" className={styles.breadcrumbLink}>
                                Community
                            </Link>
                            <span className={styles.breadcrumbSeparator}>/</span>
                            <span className={styles.breadcrumbCurrent}>{post.title}</span>
                        </div>

                        <article className={styles.postDetail}>
                            <div className={styles.postHeader}>
                                <div className={styles.postAvatar}>
                                    {author && 'avatar' in author && author.avatar ? (
                                        <PbImage
                                            record={author}
                                            filename={author.avatar}
                                            alt={author.name}
                                            width={40}
                                            height={40}
                                            className={styles.avatarImage}
                                        />
                                    ) : (
                                        <span className={styles.avatarText}>{getInitials(author.name)}</span>
                                    )}
                                </div>
                                <div>
                                    <div className={styles.authorHeader}>
                                        <h4 className={styles.authorName}>{author.name}</h4>
                                    </div>
                                    <p className={styles.authorMeta}>
                                        {post.category === 'discussion' ? 'Discussion' :
                                            post.category === 'resource' ? 'Resource' :
                                                post.category === 'question' ? 'Question' :
                                                    'Announcement'} • {timeAgo}
                                    </p>
                                </div>
                            </div>

                            <h1 className={styles.postDetailTitle}>{post.title}</h1>

                            <div className={styles.postDetailContent}>
                                {post.content.split('\n').map((paragraph, idx) => (
                                    <p key={idx}>{paragraph}</p>
                                ))}
                            </div>

                            {post.attachments && post.attachments.length > 0 && (
                                <div className={styles.postDetailImages}>
                                    {post.attachments.map((attachment: string, idx: number) => (
                                        <img
                                            key={idx}
                                            src={`${process.env.NEXT_PUBLIC_POCKETBASE_URL}/api/files/community_posts/${post.id}/${attachment}`}
                                            alt={`Attachment ${idx + 1}`}
                                            className={styles.postDetailImage}
                                        />
                                    ))}
                                </div>
                            )}

                            <div className={styles.postActions}>
                                <button
                                    className={styles.postAction}
                                    onClick={handleLike}
                                >
                                    <svg className={styles.actionIcon} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"></path>
                                    </svg>
                                    <span>{likeCount}</span>
                                </button>
                                <button className={styles.postAction}>
                                    <svg className={styles.actionIcon} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"></path>
                                    </svg>
                                    <span>Share</span>
                                </button>
                                {user && user.id === post.user_id && (
                                    <Link href={`/community/edit/${post.id}`} className={styles.postAction}>
                                        <svg className={styles.actionIcon} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
                                        </svg>
                                        <span>Edit</span>
                                    </Link>
                                )}
                            </div>
                        </article>

                        <div className={styles.commentsSection}>
                            <h2 className={styles.commentsTitle}>
                                Comments ({comments.length})
                            </h2>

                            {user ? (
                                <form onSubmit={handleSubmitComment} className={styles.commentForm}>
                                    <div className={styles.commentFormHeader}>
                                        <div className={styles.avatar}>
                                            <span className={styles.avatarText}>{getInitials(user.name || 'User')}</span>
                                        </div>
                                        <span className={styles.commentAs}>Commenting as <strong>{user.name || 'Anonymous'}</strong></span>
                                    </div>
                                    <textarea
                                        className={styles.commentInput}
                                        placeholder="Add your comment"
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        required
                                        rows={4}
                                    ></textarea>
                                    <button
                                        type="submit"
                                        className={styles.primaryButton}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Posting...' : 'Post Comment'}
                                    </button>
                                </form>
                            ) : (
                                <div className={styles.loginToComment}>
                                    <p>Please <Link href="/login" className={styles.loginLink}>log in</Link> to leave a comment.</p>
                                </div>
                            )}

                            {comments.length > 0 ? (
                                <div className={styles.commentsList}>
                                    {comments.map((comment) => {
                                        const commentAuthor = comment.expand?.user_id || { id: comment.user_id, name: 'Unknown User' };
                                        const commentTimeAgo = comment.created
                                            ? formatDistanceToNow(new Date(comment.created), { addSuffix: true })
                                            : 'recently';

                                        return (
                                            <div key={comment.id} className={styles.commentItem}>
                                                <div className={styles.commentHeader}>
                                                    <div className={styles.postAvatar}>
                                                        {commentAuthor.avatar ? (
                                                            <PbImage
                                                                record={commentAuthor}
                                                                filename={commentAuthor.avatar}
                                                                alt={commentAuthor.name}
                                                                width={32}
                                                                height={32}
                                                                className={styles.avatarImage}
                                                            />
                                                        ) : (
                                                            <span className={styles.avatarText}>{getInitials(commentAuthor.name)}</span>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h4 className={styles.commentAuthor}>{commentAuthor.name}</h4>
                                                        <p className={styles.commentMeta}>{commentTimeAgo}</p>
                                                    </div>
                                                </div>
                                                <div className={styles.commentContent}>
                                                    {comment.content}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className={styles.noComments}>
                                    <p>No comments yet. Be the first to share your thoughts!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
} 