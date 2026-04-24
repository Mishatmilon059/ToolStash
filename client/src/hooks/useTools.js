import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export function useTools() {
    const [tools, setTools] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const fetchTools = async () => {
        if (!user) { setLoading(false); return; }
        try {
            const { data, error } = await supabase
                .from('ai_tools')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setTools(data || []);
        } catch (error) {
            console.error("Failed to fetch tools", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTools();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const addTool = async (toolData) => {
        if (!user) return false;
        try {
            const insertData = {
                user_id: user.id,
                name: toolData.name,
                description: toolData.description || '',
                category: toolData.category || 'Other',
                status: toolData.status || 'new',
                url: toolData.url || '',
                tags: toolData.tags || [],
                created_at: new Date().toISOString()
            };

            const { data, error } = await supabase
                .from('ai_tools')
                .insert([insertData])
                .select()
                .single();

            if (error) throw error;
            setTools([data, ...tools]);
            return true;
        } catch (error) {
            console.error("Failed to add tool", error);
            // Fallback: add locally if Supabase fails
            const localTool = {
                id: crypto.randomUUID(),
                user_id: user.id,
                created_at: new Date().toISOString(),
                ...toolData,
            };
            setTools([localTool, ...tools]);
            return true;
        }
    };

    const updateToolStatus = async (id, status) => {
        if (!user) return false;
        try {
            // Optimistic update
            setTools(tools.map(t => t.id === id ? {
                ...t,
                status,
                tried_at: status === 'tried' || status === 'useful' ? new Date().toISOString() : t.tried_at
            } : t));

            const { error } = await supabase
                .from('ai_tools')
                .update({
                    status,
                    tried_at: status === 'tried' || status === 'useful' ? new Date().toISOString() : null
                })
                .eq('id', id)
                .eq('user_id', user.id);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error("Failed to update status", error);
            return true; // Keep optimistic update
        }
    };

    const deleteTool = async (id) => {
        if (!user) return false;
        try {
            // Optimistic delete
            setTools(tools.filter(t => t.id !== id));

            const { error } = await supabase
                .from('ai_tools')
                .delete()
                .eq('id', id)
                .eq('user_id', user.id);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error("Failed to delete tool", error);
            return true; // Keep optimistic delete
        }
    };

    return { tools, loading, addTool, updateToolStatus, deleteTool, refetch: fetchTools };
}
