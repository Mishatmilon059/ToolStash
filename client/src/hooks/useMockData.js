import { useState } from 'react';

const INITIAL_TOOLS = [
    {
        id: '1',
        name: 'ChatGPT',
        description: 'Advanced AI language model for conversation, coding, and creative writing.',
        category: 'Chatbot',
        status: 'tried',
        url: 'https://chat.openai.com',
        tags: ['text', 'coding', 'assistant'],
        isSaved: true
    },
    {
        id: '2',
        name: 'Midjourney',
        description: 'Generates hyper-realistic images from natural language descriptions.',
        category: 'Image',
        status: 'new',
        url: 'https://midjourney.com',
        tags: ['image', 'art', 'generative'],
        isSaved: true
    },
    {
        id: '3',
        name: 'Notion AI',
        description: 'Integrated AI writing assistant that lives inside your workspace.',
        category: 'Productivity',
        status: 'new',
        url: 'https://notion.so',
        tags: ['writing', 'notes', 'productivity'],
        isSaved: true
    },
    {
        id: '4',
        name: 'Runway Gen-2',
        description: 'Text-to-video generation tool for creators and filmmakers.',
        category: 'Video',
        status: 'useful',
        url: 'https://runwayml.com',
        tags: ['video', 'creative'],
        isSaved: true
    },
    {
        id: '5',
        name: 'Github Copilot',
        description: 'AI pair programmer that helps you write code faster.',
        category: 'Developer',
        status: 'useful',
        url: 'https://github.com/features/copilot',
        tags: ['coding', 'developer'],
        isSaved: true
    },
    {
        id: '6',
        name: 'ElevenLabs',
        description: 'The most realistic text-to-speech and voice cloning software.',
        category: 'Audio',
        status: 'new',
        url: 'https://elevenlabs.io',
        tags: ['audio', 'voice', 'tts'],
        isSaved: true
    }
];

const INITIAL_STATS = {
    // 1. Widget Data
    toolsSaved: 142,      // "Brain" - Total Income -> Total Saved
    toolsTried: 45,       // "Flask" - New Users -> Tools Tried
    usefulTools: 28,      // "Star"  - Orders -> Useful Finds
    saveTryRatio: 31.6,   // "Target" - Conversion Rate

    // 2. Main Graph Data (AI Learning Progress)
    learningProgress: [
        { day: 'Jan', saved: 12, tried: 5, useful: 2 },
        { day: 'Feb', saved: 25, tried: 10, useful: 5 },
        { day: 'Mar', saved: 18, tried: 8, useful: 6 },
        { day: 'Apr', saved: 35, tried: 15, useful: 10 },
        { day: 'May', saved: 28, tried: 12, useful: 8 },
        { day: 'Jun', saved: 45, tried: 20, useful: 14 },
        { day: 'Jul', saved: 32, tried: 15, useful: 11 },
        { day: 'Aug', saved: 40, tried: 18, useful: 15 },
        { day: 'Sep', saved: 55, tried: 25, useful: 18 },
        { day: 'Oct', saved: 48, tried: 22, useful: 16 },
        { day: 'Nov', saved: 60, tried: 30, useful: 22 },
        { day: 'Dec', saved: 75, tried: 38, useful: 28 }
    ],

    // 3. Donut Chart (Skill Coverage)
    categoriesExplored: [
        { name: 'Concierge/Chat', value: 45, percentage: 35, status: 'Up' },
        { name: 'Image Gen', value: 30, percentage: 25, status: 'Up' },
        { name: 'Coding', value: 25, percentage: 20, status: 'Down' },
        { name: 'Video/Audio', value: 20, percentage: 15, status: 'Up' },
        { name: 'Productivity', value: 10, percentage: 5, status: 'Down' }
    ],

    // 4. Achievement Timeline / Milestones (Replacing Map)
    recentMilestones: [
        { title: 'First Tool Saved', date: 'Jan 12', icon: '🚀' },
        { title: 'Level 3 Explorer', date: 'Mar 05', icon: '⚡' },
        { title: 'Coding Wizard', date: 'Jun 15', icon: '🧙‍♂️' },
        { title: '50 Saved Tools', date: 'Aug 22', icon: '💾' },
    ],

    // 5. Tables (Recent Activity & Achievements)
    recentToolsTried: [
        { id: '#T-101', name: 'Cursor AI', category: 'Coding', outcome: 'Useful', date: '2d ago' },
        { id: '#T-102', name: 'Midjourney v6', category: 'Image', outcome: 'Tried', date: '4d ago' },
        { id: '#T-103', name: 'Jasper', category: 'Writing', outcome: 'Not Useful', date: '1w ago' },
        { id: '#T-104', name: 'RunwayML', category: 'Video', outcome: 'Useful', date: '1w ago' },
    ],

    recentAchievements: [
        { id: '#A-001', name: 'Early Adopter', category: 'Badge', outcome: 'Unlocked', date: 'Feb 10' },
        { id: '#A-002', name: 'Prompt Engineer', category: 'Skill', outcome: 'Learning', date: 'Mar 15' },
        { id: '#A-003', name: 'Design Guru', category: 'Badge', outcome: 'Unlocked', date: 'May 20' },
    ],

    // 6. My Media Items (Context Memory)
    mediaItems: [
        {
            id: 'm1',
            type: 'reel',
            platform: 'Instagram',
            content: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80', // Placeholder
            note: 'AI that edits videos automatically',
            linkedTools: ['Runway', 'Pika'],
            date: '2h ago'
        },
        {
            id: 'm2',
            type: 'screenshot',
            content: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80', // Placeholder
            note: 'Shows how to remove silence automatically',
            linkedTools: ['Descript'],
            date: '1d ago'
        },
        {
            id: 'm3',
            type: 'note',
            content: null,
            note: 'Idea: Use finding-sounds.com for the SFX in the next project.',
            linkedTools: [],
            date: '3d ago'
        }
    ],

    // 7. Guide Data (Learning Companion)
    guideItems: {
        gettingStarted: [
            { id: 'g1', text: 'Save your first AI tool', isCompleted: true, action: '/tools' },
            { id: 'g2', text: 'Try one tool and mark as "Tried"', isCompleted: false, action: '/tools' },
            { id: 'g3', text: 'Mark something as "Useful"', isCompleted: false, action: '/tools' },
            { id: 'g4', text: 'Unlock your first achievement', isCompleted: true, action: '/achievements' }
        ],
        howTo: [
            { id: 'h1', title: 'How to save tools in 10s', icon: '⚡', steps: 3 },
            { id: 'h2', title: 'Deciding if a tool is worth keeping', icon: '🤔', steps: 5 },
            { id: 'h3', title: 'Avoiding AI overload', icon: '🧠', steps: 4 },
        ],
        faq: [
            { q: 'Is this tool free?', a: 'Most tools listed have free tiers, but check pricing pages.' },
            { q: 'What data should I not upload?', a: 'Avoid uploading PII (Personal Identifiable Information) or sensitive work data to public AI.' },
        ]
    }
};

export function useMockData() {
    const [tools, setTools] = useState(INITIAL_TOOLS);
    const [stats, setStats] = useState(INITIAL_STATS);

    const addTool = (tool) => {
        const newTool = {
            ...tool,
            id: Math.random().toString(36).substr(2, 9),
            status: 'new',
            isSaved: true,
            tags: []
        };
        setTools([newTool, ...tools]);

        // Update stats animation
        setStats(prev => ({
            ...prev,
            toolsSaved: prev.toolsSaved + 1
        }));
    };

    const updateToolStatus = (id, status) => {
        setTools(tools.map(t => t.id === id ? { ...t, status } : t));
    };

    return {
        tools,
        stats,
        mediaItems: INITIAL_STATS.mediaItems, // Exposing static for now, could be state
        guideItems: INITIAL_STATS.guideItems,
        addTool,
        updateToolStatus,
        user: {
            name: 'Hunter',
            avatar: 'https://ui-avatars.com/api/?name=Hunter&background=00F0FF&color=fff'
        }
    };
}
