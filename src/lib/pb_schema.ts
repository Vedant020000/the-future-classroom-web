/**
 * PocketBase Schema Definition
 * 
 * This file contains the schema definitions for the PocketBase collections used in the application.
 * Use this as a reference when setting up the PocketBase admin dashboard.
 */

export const collections = [
    /**
     * users collection (auth)
     * Created automatically by PocketBase
     * Additional fields:
     * - name: text field
     * - avatar: file field
     * - role: select field (options: "student", "teacher", "admin")
     */

    /**
     * AI Usage Collection
     * Tracks user's API usage statistics
     */
    {
        name: "ai_usage",
        schema: [
            {
                name: "user_id",
                type: "relation",
                required: true,
                options: {
                    collectionId: "_pb_users_auth_",
                    cascadeDelete: true
                }
            },
            {
                name: "daily_queries",
                type: "number",
                required: true,
                default: 0
            },
            {
                name: "daily_limit",
                type: "number",
                required: true,
                default: 25
            },
            {
                name: "saved_templates",
                type: "number",
                required: true,
                default: 0
            },
            {
                name: "templates_limit",
                type: "number",
                required: true,
                default: 10
            },
            {
                name: "last_reset",
                type: "date",
                required: true,
                default: "now"
            }
        ]
    },

    /**
     * Templates Collection
     * Stores user-saved AI templates
     */
    {
        name: "templates",
        schema: [
            {
                name: "user_id",
                type: "relation",
                required: true,
                options: {
                    collectionId: "_pb_users_auth_",
                    cascadeDelete: true
                }
            },
            {
                name: "title",
                type: "text",
                required: true
            },
            {
                name: "description",
                type: "text"
            },
            {
                name: "content",
                type: "json",
                required: true
            },
            {
                name: "category",
                type: "select",
                options: {
                    values: ["lesson_plan", "quiz", "assignment", "lecture_notes", "other"]
                }
            },
            {
                name: "is_public",
                type: "bool",
                default: false
            }
        ]
    },

    /**
     * Community Posts Collection
     * Stores user posts for the community section
     */
    {
        name: "community_posts",
        schema: [
            {
                name: "user_id",
                type: "relation",
                required: true,
                options: {
                    collectionId: "_pb_users_auth_",
                    cascadeDelete: true
                }
            },
            {
                name: "title",
                type: "text",
                required: true
            },
            {
                name: "content",
                type: "text",
                required: true
            },
            {
                name: "likes",
                type: "number",
                default: 0
            },
            {
                name: "category",
                type: "select",
                options: {
                    values: ["discussion", "resource", "question", "announcement"]
                }
            },
            {
                name: "attachments",
                type: "file",
                options: {
                    maxSelect: 5,
                    maxSize: 5242880
                }
            }
        ]
    },

    /**
     * Comments Collection
     * Stores comments on community posts
     */
    {
        name: "comments",
        schema: [
            {
                name: "user_id",
                type: "relation",
                required: true,
                options: {
                    collectionId: "_pb_users_auth_",
                    cascadeDelete: true
                }
            },
            {
                name: "post_id",
                type: "relation",
                required: true,
                options: {
                    collectionId: "community_posts",
                    cascadeDelete: true
                }
            },
            {
                name: "content",
                type: "text",
                required: true
            },
            {
                name: "likes",
                type: "number",
                default: 0
            }
        ]
    },

    /**
     * AI Chat History Collection
     * Stores user chat history with the AI
     */
    {
        name: "ai_chats",
        schema: [
            {
                name: "user_id",
                type: "relation",
                required: true,
                options: {
                    collectionId: "_pb_users_auth_",
                    cascadeDelete: true
                }
            },
            {
                name: "title",
                type: "text",
                required: true
            },
            {
                name: "messages",
                type: "json",
                required: true
            },
            {
                name: "tool_type",
                type: "select",
                options: {
                    values: ["lesson_planner", "quiz_generator", "content_writer", "general"]
                }
            }
        ]
    },

    /**
     * Lesson Plans Collection
     * Stores user-created lesson plans
     */
    {
        name: "lesson_plans",
        schema: [
            {
                name: "user_id",
                type: "relation",
                required: true,
                options: {
                    collectionId: "_pb_users_auth_",
                    cascadeDelete: true
                }
            },
            {
                name: "title",
                type: "text",
                required: true
            },
            {
                name: "subject",
                type: "text"
            },
            {
                name: "gradeLevel",
                type: "text"
            },
            {
                name: "topic",
                type: "text"
            },
            {
                name: "objectives",
                type: "text" // Can store as markdown or simple text initially
            },
            {
                name: "duration",
                type: "text"
            },
            {
                name: "materials",
                type: "text" // Store as markdown list or JSON? Start with text.
            },
            {
                name: "activities",
                type: "json" // Store the structured activities/blocks here
            },
            {
                name: "assessment",
                type: "text" // Store as markdown or simple text
            },
            {
                name: "standards",
                type: "text" // Store as markdown or comma-separated
            },
            {
                name: "is_public",
                type: "bool",
                default: false
            },
            {
                name: "last_generated_content", // Store the last AI generation for reference/editing
                type: "text"
            }
        ]
    }
];

/**
 * Setup Instructions:
 * 
 * 1. Start the PocketBase server
 * 2. Access the admin dashboard at http://127.0.0.1:8090/_/
 * 3. Create a new admin account
 * 4. Navigate to Settings > Auth Providers to set up OAuth (Google, etc.)
 * 5. Manually create collections based on the schema above
 * 6. Set appropriate collection rules for security:
 *    - Users: Allow users to view and update their own records
 *    - AI Usage: Allow users to read their own usage, but not modify
 *    - Templates: Allow users to manage their own templates
 *    - Community Posts: Allow all authenticated users to view, authors to edit
 *    - Comments: Allow all authenticated users to view, authors to edit
 *    - AI Chats: Only allow users to view and manage their own chat history
 */ 