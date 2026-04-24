import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export function useGuide() {
    const [progress, setProgress] = useState([]);
    const { user } = useAuth();

    // Static guide content
    const guideContent = {
        gettingStarted: [
            { id: 'g1', text: 'Save your first AI tool', action: '/tools' },
            { id: 'g2', text: 'Try one tool and mark as "Tried"', action: '/tools' },
            { id: 'g3', text: 'Mark something as "Useful"', action: '/tools' },
            { id: 'g4', text: 'Unlock your first achievement', action: '/achievements' },
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
    };

    useEffect(() => {
        const fetchProgress = async () => {
            if (!user) return;
            try {
                const { data, error } = await supabase
                    .from('guide_progress')
                    .select('*')
                    .eq('user_id', user.id);

                if (error) throw error;
                setProgress(data || []);
            } catch (error) {
                console.error("Failed to fetch guide progress", error);
                // Keep local state — progress will be empty but page won't crash
            }
        };
        fetchProgress();
    }, [user]);

    const toggleItem = async (section, itemId, currentStatus) => {
        if (!user) return;
        try {
            const newStatus = !currentStatus;

            // Optimistic update
            const existingIndex = progress.findIndex(p => p.item_id === itemId && p.section === section);
            let newProgress = [...progress];

            if (existingIndex >= 0) {
                newProgress[existingIndex] = { ...newProgress[existingIndex], is_completed: newStatus };
            } else {
                newProgress.push({ section, item_id: itemId, is_completed: newStatus, user_id: user.id });
            }
            setProgress(newProgress);

            const { error } = await supabase
                .from('guide_progress')
                .upsert({
                    user_id: user.id,
                    section,
                    item_id: itemId,
                    is_completed: newStatus,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'user_id, section, item_id' });

            if (error) throw error;
        } catch (error) {
            console.error("Failed to update guide progress", error);
            // Keep optimistic update — works offline
        }
    };

    const getEnrichedItems = () => {
        return {
            ...guideContent,
            gettingStarted: guideContent.gettingStarted.map(item => ({
                ...item,
                isCompleted: progress.find(p => p.item_id === item.id)?.is_completed || false
            }))
        };
    };

    return { guideItems: getEnrichedItems(), toggleItem };
}
