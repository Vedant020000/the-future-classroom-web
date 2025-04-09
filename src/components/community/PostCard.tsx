'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import PbImage from '@/components/PbImage';
import { CommunityPost, toggleLikePost } from '@/lib/communityService';
import { useAuth } from '@/lib/AuthContext';
import styles from '@/app/community/page.module.css';

interface PostCardProps {
    post: CommunityPost;
}

export default function PostCard({ post }: PostCardProps) {
    const { user } = useAuth();
    const router = useRouter();
    const [likeCount, setLikeCount] = useState(post.likes || 0);
    const [isLiking, setIsLiking] = useState(false);

    const author = post.expand?.user_id || { id: post.user_id, name: 'Unknown User' };

    // Format the date using date-fns
    const timeAgo = post.created
        ? formatDistanceToNow(new Date(post.created), { addSuffix: true })
        : 'recently';

    // Get the user's initials for the avatar
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(part => part.charAt(0))
            .join('')
            .toUpperCase();
    };

    const handleLike = async () => {
        if (!user) {
            router.push('/login');
            return;
        }

        if (isLiking) return;

        setIsLiking(true);
        const success = await toggleLikePost(post.id);
        if (success) {
            setLikeCount(prev => prev + 1);
        }
        setIsLiking(false);
    };

    return (
        <div className={styles.postItem}>
            <div className={styles.postHeader}>
                <div className={styles.postAvatar}>
                    {author.avatar ? (
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
                        {author.verified && (
                            <svg className={styles.verifiedBadge} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                            </svg>
                        )}
                    </div>
                    <p className={styles.authorMeta}>
                        {post.category === 'discussion' ? 'Discussion' :
                            post.category === 'resource' ? 'Resource' :
                                post.category === 'question' ? 'Question' :
                                    'Announcement'} • {timeAgo}
                    </p>
                </div>
            </div>

            <h3 className={styles.postTitle}>
                <Link href={`/community/post/${post.id}`} className={styles.postTitleLink}>
                    {post.title}
                </Link>
            </h3>

            <p className={styles.postContent}>
                {post.content.length > 300
                    ? `${post.content.substring(0, 300)}...`
                    : post.content}
            </p>

            {post.attachments && post.attachments.length > 0 && (
                <div className={styles.postImage}>
                    <img
                        src={`${process.env.NEXT_PUBLIC_POCKETBASE_URL}/api/files/community_posts/${post.id}/${post.attachments[0]}`}
                        alt={post.title}
                        className={styles.img}
                    />
                </div>
            )}

            <div className={styles.postActions}>
                <button
                    className={styles.postAction}
                    onClick={handleLike}
                    disabled={isLiking}
                >
                    <svg className={styles.actionIcon} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"></path>
                    </svg>
                    <span>{likeCount}</span>
                </button>
                <Link href={`/community/post/${post.id}`} className={styles.postAction}>
                    <svg className={styles.actionIcon} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd"></path>
                    </svg>
                    <span>Comments</span>
                </Link>
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
        </div>
    );
} 