import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export function useStats() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const calculateStats = async () => {
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                // Fetch all tools to aggregate stats client-side
                const { data: tools, error } = await supabase
                    .from('ai_tools')
                    .select('*')
                    .eq('user_id', user.id);

                if (error) throw error;

                const allTools = tools || [];
                const toolsSaved = allTools.length;
                const toolsTried = allTools.filter(t => t.status === 'tried' || t.status === 'useful').length;
                const toolsUseful = allTools.filter(t => t.status === 'useful').length;
                const saveTryRatio = toolsSaved > 0 ? Math.round((toolsTried / toolsSaved) * 100) : 0;

                // Compute category distribution from real data
                const categoryMap = {};
                allTools.forEach(t => {
                    const cat = t.category || 'Other';
                    categoryMap[cat] = (categoryMap[cat] || 0) + 1;
                });
                const categoriesExplored = Object.entries(categoryMap).map(([name, value]) => ({
                    name,
                    value,
                    percentage: toolsSaved > 0 ? Math.round((value / toolsSaved) * 100) : 0
                }));

                // Build learning progress from created_at dates
                const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                const progressMap = {};
                monthNames.forEach(m => { progressMap[m] = { day: m, saved: 0, tried: 0, useful: 0 }; });
                allTools.forEach(t => {
                    const month = monthNames[new Date(t.created_at).getMonth()];
                    if (progressMap[month]) {
                        progressMap[month].saved++;
                        if (t.status === 'tried' || t.status === 'useful') progressMap[month].tried++;
                        if (t.status === 'useful') progressMap[month].useful++;
                    }
                });
                const learningProgress = monthNames.map(m => progressMap[m]);

                // Recent tools tried
                const recentToolsTried = allTools
                    .filter(t => t.status === 'tried' || t.status === 'useful')
                    .slice(0, 5)
                    .map(t => ({
                        name: t.name,
                        category: t.category || 'AI',
                        outcome: t.status === 'useful' ? 'Useful' : 'Tried',
                        date: t.tried_at ? new Date(t.tried_at).toLocaleDateString() : new Date(t.created_at).toLocaleDateString()
                    }));

                // Achievements based on actual data
                const recentAchievements = [];
                if (toolsSaved >= 1) recentAchievements.push({ name: 'First Tool Saved', category: 'Milestone', outcome: 'Unlocked', date: '🚀' });
                if (toolsSaved >= 10) recentAchievements.push({ name: '10 Tools Stashed', category: 'Collection', outcome: 'Unlocked', date: '📦' });
                if (toolsSaved >= 50) recentAchievements.push({ name: '50 Tools Saved', category: 'Collection', outcome: 'Unlocked', date: '💾' });
                if (toolsTried >= 5) recentAchievements.push({ name: 'Explorer', category: 'Badge', outcome: 'Unlocked', date: '🔎' });
                if (toolsUseful >= 5) recentAchievements.push({ name: 'Curator', category: 'Badge', outcome: 'Unlocked', date: '⭐' });
                if (Object.keys(categoryMap).length >= 3) recentAchievements.push({ name: 'Versatile', category: 'Badge', outcome: 'Unlocked', date: '🌈' });

                // Milestones
                const recentMilestones = [];
                if (toolsSaved >= 1) recentMilestones.push({ title: 'First Tool Saved', date: 'Achieved', icon: '🚀' });
                if (toolsTried >= 1) recentMilestones.push({ title: 'First Tool Tried', date: 'Achieved', icon: '⚡' });
                if (toolsUseful >= 1) recentMilestones.push({ title: 'Found Something Useful', date: 'Achieved', icon: '⭐' });
                if (toolsSaved >= 25) recentMilestones.push({ title: '25 Tools Stashed', date: 'Achieved', icon: '💾' });

                setStats({
                    toolsSaved,
                    toolsTried,
                    usefulTools: toolsUseful,
                    saveTryRatio,
                    learningProgress,
                    categoriesExplored: categoriesExplored.length > 0 ? categoriesExplored : [{ name: 'None yet', value: 1 }],
                    recentMilestones,
                    recentToolsTried,
                    recentAchievements
                });

            } catch (error) {
                console.error("Failed to calculate stats", error);
                // Set fallback stats so the page doesn't crash
                setStats({
                    toolsSaved: 0,
                    toolsTried: 0,
                    usefulTools: 0,
                    saveTryRatio: 0,
                    learningProgress: [
                        { day: 'Jan', saved: 0, tried: 0, useful: 0 },
                        { day: 'Feb', saved: 0, tried: 0, useful: 0 },
                        { day: 'Mar', saved: 0, tried: 0, useful: 0 },
                    ],
                    categoriesExplored: [{ name: 'None', value: 1 }],
                    recentMilestones: [],
                    recentToolsTried: [],
                    recentAchievements: [],
                });
            } finally {
                setLoading(false);
            }
        };

        calculateStats();
    }, [user]);

    return { stats, loading };
}
