'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';
import { getCommunityPosts, PostFilter, CommunityPost } from '@/lib/communityService';
import { useAuth } from '@/lib/AuthContext';
import PostCard from '@/components/community/PostCard';
import CreatePostForm from '@/components/community/CreatePostForm';

export default function CommunityPage() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('trending');
    const [showFilters, setShowFilters] = useState(false);
    const [posts, setPosts] = useState<CommunityPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState<PostFilter>({});
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchPosts();
    }, [currentPage, filter, activeTab]);

    const fetchPosts = async () => {
        setIsLoading(true);
        setError('');

        try {
            // Apply sorting based on active tab
            let postsFilter = { ...filter };

            if (activeTab === 'trending') {
                // For trending, we sort by likes in the backend
                // This is handled in the sorting option in getCommunityPosts
            } else if (activeTab === 'following') {
                // For following, show only posts from users you follow
                // For now, just show the most recent posts
            }

            const result = await getCommunityPosts(postsFilter, currentPage, 10);
            setPosts(result.posts);
            setTotalPages(result.totalPages);
        } catch (err: any) {
            setError(err.message || 'Failed to load posts. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilter(prev => ({
            ...prev,
            [name]: value === 'all' ? undefined : value
        }));
        setCurrentPage(1); // Reset to first page on filter change
    };

    const handleFilterApply = () => {
        fetchPosts();
        setShowFilters(false);
    };

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const search = formData.get('search') as string;

        setFilter(prev => ({
            ...prev,
            searchTerm: search.trim() ? search : undefined
        }));
        setCurrentPage(1); // Reset to first page on search
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(part => part.charAt(0))
            .join('')
            .toUpperCase();
    };

    return (
        <div className={styles.page}>
            {/* Header */}
            <section className={styles.headerSection}>
                <div className={styles.container}>
                    <div className={styles.headerContent}>
                        <h1 className={styles.title}>
                            <span className={styles.gradientText}>Educator Community</span>
                        </h1>
                        <p className={styles.subtitle}>
                            Connect with fellow teachers, share experiences, and discover innovative teaching strategies.
                        </p>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className={styles.mainSection}>
                <div className={styles.container}>
                    <div className={styles.mainLayout}>
                        {/* Left Sidebar */}
                        <div className={styles.leftSidebar}>
                            <div className={styles.sidebarCard}>
                                <h3 className={styles.sidebarTitle}>Community Menu</h3>
                                <nav className={styles.navMenu}>
                                    <Link href="/community" className={`${styles.navLink} ${styles.navLinkActive}`}>
                                        <svg className={styles.navIcon} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                                        </svg>
                                        <span>Home Feed</span>
                                    </Link>
                                    <Link href="/community/reading-list" className={styles.navLink}>
                                        <svg className={styles.navIcon} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"></path>
                                        </svg>
                                        <span>Reading List</span>
                                    </Link>
                                    <Link href="/community/groups" className={styles.navLink}>
                                        <svg className={styles.navIcon} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
                                        </svg>
                                        <span>Groups</span>
                                    </Link>
                                    <Link href="/community/topics" className={styles.navLink}>
                                        <svg className={styles.navIcon} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"></path>
                                        </svg>
                                        <span>Topics</span>
                                    </Link>
                                    <Link href="/community/events" className={styles.navLink}>
                                        <svg className={styles.navIcon} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path>
                                        </svg>
                                        <span>Events</span>
                                    </Link>
                                </nav>

                                <div className={styles.topicsSection}>
                                    <h3 className={styles.sidebarTitle}>Popular Topics</h3>
                                    <div className={styles.topicsContainer}>
                                        {popularTopics.map((topic, index) => (
                                            <Link
                                                key={index}
                                                href={`/community/topic/${topic.slug}`}
                                                className={styles.topicTag}
                                            >
                                                #{topic.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className={styles.mainContent}>
                            {/* Create Post */}
                            <CreatePostForm />

                            {/* Feed Tabs */}
                            <div className={styles.feedContainer}>
                                <div className={styles.tabsContainer}>
                                    <button
                                        className={`${styles.tab} ${activeTab === 'trending' ? styles.tabActive : ''}`}
                                        onClick={() => setActiveTab('trending')}
                                    >
                                        Trending
                                    </button>
                                    <button
                                        className={`${styles.tab} ${activeTab === 'latest' ? styles.tabActive : ''}`}
                                        onClick={() => setActiveTab('latest')}
                                    >
                                        Latest
                                    </button>
                                    <button
                                        className={`${styles.tab} ${activeTab === 'following' ? styles.tabActive : ''}`}
                                        onClick={() => setActiveTab('following')}
                                    >
                                        Following
                                    </button>
                                </div>

                                <div className={styles.filterBar}>
                                    <div>
                                        <span className={styles.filterLabel}>
                                            Showing posts for{' '}
                                            <span className={styles.currentFilter}>
                                                {filter.category ?
                                                    filter.category.charAt(0).toUpperCase() + filter.category.slice(1) :
                                                    'All educators'}
                                            </span>
                                        </span>
                                    </div>
                                    <div className={styles.searchAndFilter}>
                                        <form onSubmit={handleSearch} className={styles.searchForm}>
                                            <input
                                                type="text"
                                                name="search"
                                                placeholder="Search posts..."
                                                className={styles.searchInput}
                                            />
                                            <button type="submit" className={styles.searchButton}>
                                                <svg className={styles.searchIcon} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
                                                </svg>
                                            </button>
                                        </form>
                                        <button
                                            onClick={() => setShowFilters(!showFilters)}
                                            className={styles.filterButton}
                                        >
                                            <svg className={styles.filterIcon} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd"></path>
                                            </svg>
                                            <span>Filter</span>
                                        </button>
                                    </div>
                                </div>

                                {showFilters && (
                                    <div className={styles.filtersPanel}>
                                        <div className={styles.filtersGrid}>
                                            <div className={styles.formGroup}>
                                                <label className={styles.formLabel}>Grade Level</label>
                                                <select
                                                    className={styles.formSelect}
                                                    name="gradeLevel"
                                                    onChange={handleFilterChange}
                                                    value={filter.gradeLevel || 'all'}
                                                >
                                                    <option value="all">All Grades</option>
                                                    <option value="elementary">Elementary</option>
                                                    <option value="middle">Middle School</option>
                                                    <option value="high">High School</option>
                                                </select>
                                            </div>
                                            <div className={styles.formGroup}>
                                                <label className={styles.formLabel}>Subject</label>
                                                <select
                                                    className={styles.formSelect}
                                                    name="subject"
                                                    onChange={handleFilterChange}
                                                    value={filter.subject || 'all'}
                                                >
                                                    <option value="all">All Subjects</option>
                                                    <option value="math">Mathematics</option>
                                                    <option value="science">Science</option>
                                                    <option value="language">Language Arts</option>
                                                    <option value="social">Social Studies</option>
                                                </select>
                                            </div>
                                            <div className={styles.formGroup}>
                                                <label className={styles.formLabel}>Content Type</label>
                                                <select
                                                    className={styles.formSelect}
                                                    name="category"
                                                    onChange={handleFilterChange}
                                                    value={filter.category || 'all'}
                                                >
                                                    <option value="all">All Types</option>
                                                    <option value="resource">Resources</option>
                                                    <option value="discussion">Discussions</option>
                                                    <option value="question">Questions</option>
                                                    <option value="announcement">Announcements</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className={styles.filterActions}>
                                            <button
                                                className={styles.applyButton}
                                                onClick={handleFilterApply}
                                            >
                                                Apply Filters
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Posts */}
                                <div className={styles.postsList}>
                                    {isLoading ? (
                                        <div className={styles.loadingContainer}>
                                            <div className={styles.spinner}></div>
                                            <p>Loading posts...</p>
                                        </div>
                                    ) : error ? (
                                        <div className={styles.errorContainer}>
                                            <p>{error}</p>
                                            <button
                                                className={styles.retryButton}
                                                onClick={fetchPosts}
                                            >
                                                Retry
                                            </button>
                                        </div>
                                    ) : posts.length === 0 ? (
                                        <div className={styles.emptyContainer}>
                                            <p>No posts found. Be the first to post in this community!</p>
                                        </div>
                                    ) : (
                                        posts.map((post) => (
                                            <PostCard key={post.id} post={post} />
                                        ))
                                    )}

                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                        <div className={styles.pagination}>
                                            <button
                                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                                disabled={currentPage === 1}
                                                className={styles.paginationButton}
                                            >
                                                Previous
                                            </button>
                                            <span className={styles.pageIndicator}>Page {currentPage} of {totalPages}</span>
                                            <button
                                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                                disabled={currentPage === totalPages}
                                                className={styles.paginationButton}
                                            >
                                                Next
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Sidebar */}
                        <div className={styles.rightSidebar}>
                            {/* Upcoming Events */}
                            <div className={styles.rightSidebarCard}>
                                <h3 className={styles.cardTitle}>Upcoming Events</h3>
                                <div className={styles.eventsList}>
                                    {events.map((event, index) => (
                                        <div key={index} className={styles.eventItem}>
                                            <div className={styles.eventDate}>
                                                <span className={styles.eventDay}>{event.day}</span>
                                                <span className={styles.eventMonth}>{event.month}</span>
                                            </div>
                                            <div className={styles.eventDetails}>
                                                <h4 className={styles.eventTitle}>{event.title}</h4>
                                                <p className={styles.eventMeta}>{event.type} • {event.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <Link href="/community/events" className={styles.topicTag}>
                                    View All Events
                                </Link>
                            </div>

                            {/* Suggested Users */}
                            <div className={styles.rightSidebarCard}>
                                <h3 className={styles.cardTitle}>Suggested to Follow</h3>
                                <div className={styles.usersList}>
                                    {suggestedUsers.map((user, index) => (
                                        <div key={index} className={styles.userItem}>
                                            <div className={styles.userAvatar}>
                                                <span>{user.initial}</span>
                                            </div>
                                            <div className={styles.userInfo}>
                                                <div className={styles.userName}>
                                                    {user.name}
                                                    {user.verified && (
                                                        <svg className={styles.verifiedBadge} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                                        </svg>
                                                    )}
                                                </div>
                                                <p className={styles.userRole}>{user.role}</p>
                                            </div>
                                            <button className={styles.followButton}>
                                                Follow
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

// Sample data
const popularTopics = [
    { name: 'AIinEducation', slug: 'ai-in-education' },
    { name: 'LessonPlanning', slug: 'lesson-planning' },
    { name: 'STEM', slug: 'stem' },
    { name: 'ClassroomManagement', slug: 'classroom-management' },
    { name: 'EdTech', slug: 'edtech' },
    { name: 'ProfessionalDevelopment', slug: 'professional-development' },
];

const events = [
    {
        day: '15',
        month: 'Jun',
        title: 'AI in Education Summit',
        type: 'Virtual Conference',
        time: '9:00 AM - 4:00 PM EST',
    },
    {
        day: '22',
        month: 'Jun',
        title: 'Integrating AI in STEM Classrooms',
        type: 'Webinar',
        time: '7:00 PM - 8:30 PM EST',
    },
    {
        day: '28',
        month: 'Jun',
        title: 'Teacher Tech Meetup',
        type: 'In-Person • New York',
        time: '6:30 PM - 8:30 PM EST',
    },
];

const suggestedUsers = [
    {
        name: 'Dr. James Wilson',
        initial: 'JW',
        role: 'Educational Psychology Professor',
        verified: true,
    },
    {
        name: 'Emma Thompson',
        initial: 'ET',
        role: 'K-12 Technology Coordinator',
        verified: true,
    },
    {
        name: 'Kevin Patel',
        initial: 'KP',
        role: 'High School English Teacher',
        verified: false,
    },
]; 