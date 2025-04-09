// src/lib/aiToolsData.ts

// Define the interface for a form field
export interface FormField {
    id: string;
    label: string;
    type: 'text' | 'textarea' | 'select' | 'number' | 'checkbox';
    placeholder?: string;
    helperText?: string;
    required?: boolean;
    options?: string[] | { value: string; label: string }[];
}

// Define the interface for an AI Tool
export interface AiTool {
    id: string;
    name: string;
    icon: string;
    description: string;
    beta?: boolean;
    welcomeMessage?: string;
    disclaimer?: string;
    formFields: FormField[];
}

// Define the array of available AI tools
export const allTools: AiTool[] = [
    {
        id: 'assistant',
        name: 'AI Teaching Assistant',
        icon: '🤖',
        description: 'General help with planning, methodologies, and content.',
        beta: false,
        disclaimer: 'Your teaching assistant is here to help, but always use your professional judgment.',
        formFields: [
            { id: 'topic', label: 'Topic/Question', type: 'textarea', placeholder: 'e.g., Explain Bloom\'s Taxonomy, Ideas for teaching fractions', required: true },
            { id: 'context', label: 'Additional Context (Optional)', type: 'textarea', placeholder: 'e.g., Grade level, specific student needs, prior knowledge' }
        ]
    },
    {
        id: 'lesson-generator',
        name: 'AI Lesson Planner',
        icon: '📝',
        description: 'Create comprehensive lesson plans tailored to your needs.',
        beta: false,
        disclaimer: 'Lesson plans should be reviewed and adapted to your specific classroom needs.',
        formFields: [
            { id: 'subject', label: 'Subject', type: 'text', placeholder: 'e.g., Math, History, Science', required: true },
            { id: 'gradeLevel', label: 'Grade Level', type: 'text', placeholder: 'e.g., 5th Grade, High School Biology', required: true },
            { id: 'topic', label: 'Lesson Topic', type: 'text', placeholder: 'e.g., Introduction to Algebra, The American Revolution', required: true },
            { id: 'objectives', label: 'Learning Objectives', type: 'textarea', placeholder: 'e.g., Students will be able to identify the main causes...', required: true },
            { id: 'duration', label: 'Lesson Duration (Optional)', type: 'text', placeholder: 'e.g., 45 minutes, 2 class periods' },
            { id: 'activities', label: 'Key Activities/Methods (Optional)', type: 'textarea', placeholder: 'e.g., Group discussion, hands-on experiment, lecture' },
        ]
    },
    {
        id: 'assessment-creator',
        name: 'Assessment Generator',
        icon: '📊',
        description: 'Generate quizzes, tests, and other assessments quickly.',
        beta: false,
        disclaimer: 'All assessments should be reviewed for accuracy and appropriateness before use.',
        formFields: [
            {
                id: 'type', label: 'Assessment Type', type: 'select', options: [
                    { value: 'Multiple Choice Quiz', label: 'Multiple Choice Quiz' },
                    { value: 'Short Answer Questions', label: 'Short Answer Questions' },
                    { value: 'Essay Prompt', label: 'Essay Prompt' },
                    { value: 'True/False', label: 'True/False' },
                    { value: 'Fill-in-the-Blank', label: 'Fill-in-the-Blank' }
                ], required: true
            },
            { id: 'topic', label: 'Topic/Subject Area', type: 'text', placeholder: 'e.g., Photosynthesis, WWII Key Battles', required: true },
            { id: 'gradeLevel', label: 'Grade Level', type: 'text', placeholder: 'e.g., 8th Grade, College Intro', required: true },
            { id: 'numQuestions', label: 'Number of Questions/Items (Optional)', type: 'text', placeholder: 'e.g., 10, 5 short answers' },
            { id: 'objectives', label: 'Learning Objectives Covered (Optional)', type: 'textarea', placeholder: 'e.g., Identify key figures, Explain the process of...' },
        ]
    },
    {
        id: 'differentiation-assistant',
        name: 'Differentiation Assistant',
        icon: '🔄',
        description: 'Adapt lessons for diverse learners and learning styles.',
        beta: false,
        formFields: [
            { id: 'originalMaterial', label: 'Original Material/Lesson Content', type: 'textarea', placeholder: 'Paste or describe the original lesson activity, text, or concept.', required: true },
            { id: 'targetAudience', label: 'Target Audience/Needs', type: 'textarea', placeholder: 'e.g., Struggling readers, advanced learners, visual learners, students with ADHD', required: true },
            { id: 'differentiationGoal', label: 'Differentiation Goal (Optional)', type: 'textarea', placeholder: 'e.g., Simplify language, provide extension activities, add visual aids' },
        ]
    },
    {
        id: 'feedback-generator',
        name: 'Feedback Generator',
        icon: '💬',
        description: 'Craft constructive and personalized student feedback.',
        beta: false,
        formFields: [
            { id: 'assignmentType', label: 'Assignment Type', type: 'text', placeholder: 'e.g., Essay, Math Worksheet, Presentation', required: true },
            { id: 'studentWork', label: 'Student Work Snippet (Optional)', type: 'textarea', placeholder: 'Paste a relevant excerpt of the student\'s work.' },
            { id: 'criteria', label: 'Key Criteria/Rubric Points', type: 'textarea', placeholder: 'e.g., Thesis clarity, use of evidence, calculation accuracy', required: true },
            { id: 'strengths', label: 'Observed Strengths (Optional)', type: 'textarea', placeholder: 'e.g., Good organization, creative ideas' },
            { id: 'weaknesses', label: 'Areas for Improvement', type: 'textarea', placeholder: 'e.g., Needs more supporting details, check punctuation', required: true },
            {
                id: 'tone', label: 'Desired Tone (Optional)', type: 'select', options: [
                    { value: 'Encouraging', label: 'Encouraging' },
                    { value: 'Formal', label: 'Formal' },
                    { value: 'Direct', label: 'Direct' },
                    { value: 'Supportive', label: 'Supportive' }
                ], placeholder: 'Select feedback tone'
            }
        ]
    },
    {
        id: 'rubric-creator',
        name: 'Rubric Creator',
        icon: '📋',
        description: 'Design detailed grading rubrics for projects and assignments.',
        beta: false,
        formFields: [
            { id: 'assignmentType', label: 'Assignment/Project Type', type: 'text', placeholder: 'e.g., Research Paper, Oral Presentation, Science Fair Project', required: true },
            { id: 'criteria', label: 'Grading Criteria', type: 'textarea', placeholder: 'List the key areas to assess, e.g., Content Knowledge, Organization, Presentation Skills, Use of Sources', required: true },
            { id: 'levels', label: 'Performance Levels', type: 'text', placeholder: 'e.g., Excellent, Good, Fair, Poor OR 4, 3, 2, 1', required: true },
            { id: 'gradeLevel', label: 'Grade Level (Optional)', type: 'text', placeholder: 'e.g., Middle School, University' },
        ]
    },
    {
        id: 'iep-assistant',
        name: 'IEP Goal Writer',
        icon: '👤',
        description: 'Develop measurable IEP goals and objectives (Beta).',
        beta: true,
        disclaimer: 'IEP goals should always be reviewed by your special education team before implementation.',
        formFields: [
            { id: 'area', label: 'Area of Need', type: 'text', placeholder: 'e.g., Reading Comprehension, Math Calculation, Social Skills, Communication', required: true },
            { id: 'presentLevel', label: 'Student\'s Present Level of Performance', type: 'textarea', placeholder: 'Describe the student\'s current abilities and challenges in this area.', required: true },
            { id: 'goalFocus', label: 'Specific Skill/Behavior Focus', type: 'textarea', placeholder: 'e.g., Identifying main idea, Adding double-digit numbers, Initiating peer interactions', required: true },
            { id: 'timeframe', label: 'Timeframe (Optional)', type: 'text', placeholder: 'e.g., By the end of the school year, Within 9 weeks' },
            { id: 'measurement', label: 'How Goal Will Be Measured (Optional)', type: 'textarea', placeholder: 'e.g., Teacher observation, Work samples, % accuracy on probes' },
        ]
    },
]; 