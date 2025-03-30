'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';

export default function CommunityPage() {
    const [activeTab, setActiveTab] = useState('trending');
    const [showFilters, setShowFilters] = useState(false);

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
                            <div className={styles.postCreator}>
                                <div className={styles.userBar}>
                                    <div className={styles.avatar}>
                                        <span className={styles.avatarText}>YT</span>
                                    </div>
                                    <div className={styles.postInput}>
                                        <button
                                            className={styles.postInputField}
                                            onClick={() => alert('Post editor would open here')}
                                        >
                                            Share your insights, resources, or questions...
                                        </button>
                                    </div>
                                </div>
                                <div className={styles.postActions}>
                                    <div className={styles.attachmentButtons}>
                                        <button className={styles.attachButton}>
                                            <svg className={styles.attachIcon} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"></path>
                                            </svg>
                                            <span>Image</span>
                                        </button>
                                        <button className={styles.attachButton}>
                                            <svg className={styles.attachIcon} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 2h6v4H7V5zm8 8v2H5v-2h10zm0-4v2H5v-2h10z" clipRule="evenodd"></path>
                                            </svg>
                                            <span>Article</span>
                                        </button>
                                        <button className={styles.attachButton}>
                                            <svg className={styles.attachIcon} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"></path>
                                            </svg>
                                            <span>Video</span>
                                        </button>
                                    </div>
                                    <button className={styles.primaryButton}>
                                        Share
                                    </button>
                                </div>
                            </div>

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
                                        <span className={styles.filterLabel}>Showing posts for <span className={styles.currentFilter}>All educators</span></span>
                                    </div>
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

                                {showFilters && (
                                    <div className={styles.filtersPanel}>
                                        <div className={styles.filtersGrid}>
                                            <div className={styles.formGroup}>
                                                <label className={styles.formLabel}>Grade Level</label>
                                                <select className={styles.formSelect}>
                                                    <option>All Grades</option>
                                                    <option>Elementary</option>
                                                    <option>Middle School</option>
                                                    <option>High School</option>
                                                </select>
                                            </div>
                                            <div className={styles.formGroup}>
                                                <label className={styles.formLabel}>Subject</label>
                                                <select className={styles.formSelect}>
                                                    <option>All Subjects</option>
                                                    <option>Mathematics</option>
                                                    <option>Science</option>
                                                    <option>Language Arts</option>
                                                    <option>Social Studies</option>
                                                </select>
                                            </div>
                                            <div className={styles.formGroup}>
                                                <label className={styles.formLabel}>Content Type</label>
                                                <select className={styles.formSelect}>
                                                    <option>All Types</option>
                                                    <option>Resources</option>
                                                    <option>Discussions</option>
                                                    <option>Questions</option>
                                                    <option>Success Stories</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className={styles.filterActions}>
                                            <button className={styles.applyButton}>
                                                Apply Filters
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Posts */}
                                <div className={styles.postsList}>
                                    {posts.map((post, index) => (
                                        <div key={index} className={styles.postItem}>
                                            <div className={styles.postHeader}>
                                                <div className={styles.postAvatar}>
                                                    <span className={styles.avatarText}>{post.author.initial}</span>
                                                </div>
                                                <div>
                                                    <div className={styles.authorHeader}>
                                                        <h4 className={styles.authorName}>{post.author.name}</h4>
                                                        {post.author.verified && (
                                                            <svg className={styles.verifiedBadge} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                                            </svg>
                                                        )}
                                                    </div>
                                                    <p className={styles.authorMeta}>{post.author.title} • {post.timeAgo}</p>
                                                </div>
                                            </div>

                                            <h3 className={styles.postTitle}>
                                                <Link href={`/community/post/${post.id}`} className={styles.postTitleLink}>
                                                    {post.title}
                                                </Link>
                                            </h3>

                                            <p className={styles.postContent}>
                                                {post.content}
                                            </p>

                                            {post.image && (
                                                <div className={styles.postImage}>
                                                    <img
                                                        src={post.image}
                                                        alt={post.title}
                                                        className={styles.img}
                                                    />
                                                </div>
                                            )}

                                            <div className={styles.postTags}>
                                                {post.tags.map((tag, tagIndex) => (
                                                    <Link key={tagIndex} href={`/community/tag/${tag}`} className={styles.postTag}>
                                                        #{tag}
                                                    </Link>
                                                ))}
                                            </div>

                                            <div className={styles.postActions}>
                                                <button className={styles.postAction}>
                                                    <svg className={styles.actionIcon} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"></path>
                                                    </svg>
                                                    <span>{post.likes}</span>
                                                </button>
                                                <button className={styles.postAction}>
                                                    <svg className={styles.actionIcon} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                        <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd"></path>
                                                    </svg>
                                                    <span>{post.comments}</span>
                                                </button>
                                                <button className={styles.postAction}>
                                                    <svg className={styles.actionIcon} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"></path>
                                                    </svg>
                                                    <span>Share</span>
                                                </button>
                                                <button className={styles.postAction}>
                                                    <svg className={styles.actionIcon} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"></path>
                                                    </svg>
                                                    <span>Save</span>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
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

const posts = [
    {
        id: 1,
        author: {
            name: 'Sarah Johnson',
            initial: 'SJ',
            title: 'Science Teacher',
            verified: true,
        },
        timeAgo: '2 hours ago',
        title: 'How I Used AI to Revolutionize My Science Curriculum',
        content: 'After years of struggling to keep my students engaged in complex science topics, I\'ve found that integrating AI tools has completely transformed my classroom. Here\'s how I did it...',
        tags: ['AIinEducation', 'ScienceTeaching', 'EdTech'],
        likes: 45,
        comments: 12,
        image: '/images/science-classroom.jpg',
    },
    {
        id: 2,
        author: {
            name: 'Michael Rodriguez',
            initial: 'MR',
            title: 'Math Department Head',
            verified: true,
        },
        timeAgo: '5 hours ago',
        title: 'Question: Best AI Tools for Math Visualization?',
        content: 'I\'m looking for recommendations on AI tools that can help students visualize complex mathematical concepts. Has anyone tried anything that worked particularly well with high school students?',
        tags: ['MathEducation', 'EdTech', 'VisualLearning'],
        likes: 18,
        comments: 23,
        image: null,
    },
    {
        id: 3,
        author: {
            name: 'Lisa Chen',
            initial: 'LC',
            title: 'Elementary Educator',
            verified: false,
        },
        timeAgo: '1 day ago',
        title: 'Resource: Collection of AI-Generated Reading Comprehension Exercises',
        content: 'I\'ve created a collection of reading comprehension exercises using the AI tools on this platform. They\'re differentiated for grades 3-5 and cover various reading levels. Feel free to use and adapt them!',
        tags: ['ReadingComprehension', 'ElementaryEd', 'FreeResources'],
        likes: 87,
        comments: 34,
        image: '/images/reading-resources.jpg',
    },
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