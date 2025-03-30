import Link from 'next/link';
import Image from 'next/image';
import './globals.css';

export default function ToolsPage() {
    return (
        <div className="min-h-screen pt-24">
            {/* Header */}
            <section className="section bg-card/30 backdrop-blur-sm">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-4xl mx-auto">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            <span className="gradient-text">Educational Tools</span>
                        </h1>
                        <p className="text-foreground/80 text-lg max-w-2xl mx-auto">
                            Discover a collection of powerful tools that can transform your teaching experience and enhance student engagement.
                        </p>
                    </div>
                </div>
            </section>

            {/* Featured Tools */}
            <section className="section">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-12 text-center">
                        <span className="gradient-text">Popular Tools for Educators</span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {popularTools.map((tool, index) => (
                            <div key={index} className="glass-card rounded-xl overflow-hidden transition-transform hover:scale-105">
                                <div className="h-48 w-full relative bg-gradient-to-br from-primary/20 to-secondary/20">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-5xl">{tool.icon}</span>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold mb-2">{tool.name}</h3>
                                    <p className="text-foreground/70 mb-4">{tool.description}</p>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {tool.tags.map((tag, tagIndex) => (
                                            <span key={tagIndex} className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <a
                                        href={tool.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:text-primary-dark transition-colors font-medium flex items-center"
                                    >
                                        Visit Website
                                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="section bg-card/30 backdrop-blur-sm">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-12 text-center">
                        <span className="gradient-text">Tools by Category</span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {categories.map((category, index) => (
                            <div key={index} className="bg-card border border-border/40 rounded-xl p-6 transition-transform hover:scale-105">
                                <div className="flex items-center mb-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mr-4">
                                        <span className="text-2xl text-white">{category.icon}</span>
                                    </div>
                                    <h3 className="text-xl font-semibold">{category.name}</h3>
                                </div>
                                <p className="text-foreground/70 mb-4">{category.description}</p>
                                <ul className="space-y-2 mb-4">
                                    {category.tools.map((tool, toolIndex) => (
                                        <li key={toolIndex} className="flex items-center">
                                            <svg className="w-4 h-4 mr-2 text-primary" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                            </svg>
                                            <span>{tool}</span>
                                        </li>
                                    ))}
                                </ul>
                                <a href="#" className="text-primary hover:text-primary-dark transition-colors font-medium">
                                    Explore all {category.name.toLowerCase()} tools
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Tools Highlight */}
            <section className="section">
                <div className="container mx-auto px-4">
                    <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 text-center">
                        <h2 className="text-3xl font-bold mb-6">
                            <span className="gradient-text">Try Our Custom AI Tools</span>
                        </h2>
                        <p className="text-foreground/80 text-lg max-w-2xl mx-auto mb-8">
                            Discover our suite of custom-built AI tools designed specifically for K-12 educators to simplify and enhance the teaching experience.
                        </p>
                        <Link href="/ai-tools" className="btn-primary inline-block">
                            Explore AI Tools
                        </Link>
                    </div>
                </div>
            </section>

            {/* Resources */}
            <section className="section bg-card/30 backdrop-blur-sm">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-12 text-center">
                        <span className="gradient-text">Additional Resources</span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {resources.map((resource, index) => (
                            <div key={index} className="bg-card border border-border/40 rounded-xl overflow-hidden transition-transform hover:scale-105">
                                <div className="h-48 w-full relative bg-gradient-to-br from-primary/20 to-secondary/20">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-4xl">{resource.icon}</span>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold mb-2">{resource.title}</h3>
                                    <p className="text-foreground/70 mb-4">{resource.description}</p>
                                    <a href="#" className="text-primary hover:text-primary-dark transition-colors font-medium">
                                        Learn more
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

// Sample data
const popularTools = [
    {
        icon: '📚',
        name: 'Kahoot!',
        description: 'Create engaging quizzes and games for interactive classroom learning.',
        tags: ['Interactive', 'Quizzes', 'Games'],
        url: 'https://kahoot.com/',
    },
    {
        icon: '🖼️',
        name: 'Canva for Education',
        description: 'Design beautiful visual content for lessons, presentations, and student activities.',
        tags: ['Design', 'Visual', 'Presentations'],
        url: 'https://www.canva.com/education/',
    },
    {
        icon: '🧩',
        name: 'Quizlet',
        description: 'Create digital flashcards, games, and learning activities for students.',
        tags: ['Flashcards', 'Study', 'Memory'],
        url: 'https://quizlet.com/',
    },
    {
        icon: '🎬',
        name: 'Edpuzzle',
        description: 'Make video lessons more interactive with embedded questions and notes.',
        tags: ['Video', 'Interactive', 'Assessment'],
        url: 'https://edpuzzle.com/',
    },
    {
        icon: '📝',
        name: 'Google Classroom',
        description: 'Simplify creating, distributing, and grading assignments in a paperless way.',
        tags: ['Organization', 'Assignment', 'Grading'],
        url: 'https://classroom.google.com/',
    },
    {
        icon: '🔍',
        name: 'Nearpod',
        description: 'Create interactive lessons with virtual reality, 3D objects, and live activities.',
        tags: ['Interactive', 'VR', 'Engagement'],
        url: 'https://nearpod.com/',
    },
];

const categories = [
    {
        icon: '🎯',
        name: 'Assessment Tools',
        description: 'Tools to help teachers create quizzes, tests, and other assessment materials.',
        tools: ['Formative', 'Socrative', 'Quizizz', 'Google Forms', 'Microsoft Forms'],
    },
    {
        icon: '🌐',
        name: 'Learning Management Systems',
        description: 'Platforms to manage, deliver, and track educational courses and training programs.',
        tools: ['Google Classroom', 'Canvas', 'Schoology', 'Edmodo', 'Moodle'],
    },
    {
        icon: '🎮',
        name: 'Gamification Tools',
        description: 'Increase student engagement through game-like elements in learning activities.',
        tools: ['Kahoot!', 'Quizlet', 'Gimkit', 'Quizalize', 'ClassDojo'],
    },
    {
        icon: '📊',
        name: 'Data & Analytics',
        description: 'Track student performance and gain insights into learning patterns.',
        tools: ['Edulastic', 'Literably', 'Brightbytes', 'Panorama', 'Schoolzilla'],
    },
];

const resources = [
    {
        icon: '📖',
        title: 'EdTech Guides',
        description: 'Comprehensive guides on implementing educational technology in your classroom.',
    },
    {
        icon: '🎓',
        title: 'Professional Development',
        description: 'Courses and resources to help you master new teaching tools and techniques.',
    },
    {
        icon: '💡',
        title: 'Lesson Plan Templates',
        description: 'Ready-to-use templates to help you design effective technology-enhanced lessons.',
    },
]; 