import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export function useMedia() {
    const [mediaItems, setMediaItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const fetchMedia = async () => {
        if (!user) { setLoading(false); return; }
        try {
            const { data, error } = await supabase
                .from('media')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setMediaItems(data || []);
        } catch (error) {
            console.error("Failed to fetch media", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMedia();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    // Upload a file to Supabase Storage and return the public URL
    const uploadFile = async (file) => {
        if (!file || !user) return null;
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}/${Date.now()}_${Math.random().toString(36).slice(2)}.${fileExt}`;

            const { error } = await supabase.storage
                .from('media-uploads')
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (error) throw error;

            // Get public URL
            const { data: urlData } = supabase.storage
                .from('media-uploads')
                .getPublicUrl(fileName);

            return urlData.publicUrl;
        } catch (error) {
            console.error("Failed to upload file", error);
            // Fallback: use local object URL for dev
            return URL.createObjectURL(file);
        }
    };

    const addMedia = async (mediaData, file = null) => {
        if (!user) return false;
        try {
            // If there's a file, upload it first
            let contentUrl = mediaData.content;
            if (file) {
                contentUrl = await uploadFile(file);
            }

            const insertData = {
                user_id: user.id,
                type: mediaData.type || 'note',
                content: contentUrl || null,
                note: mediaData.note || null,
                linked_tools: mediaData.linked_tools || [],
                platform: mediaData.platform || null,
                created_at: new Date().toISOString()
            };

            const { data, error } = await supabase
                .from('media')
                .insert([insertData])
                .select()
                .single();

            if (error) throw error;
            setMediaItems([data, ...mediaItems]);
            return true;
        } catch (error) {
            console.error("Failed to add media", error);
            // Fallback: add locally
            const localMedia = {
                id: crypto.randomUUID(),
                user_id: user.id,
                created_at: new Date().toISOString(),
                date: 'Just now',
                ...mediaData,
            };
            setMediaItems([localMedia, ...mediaItems]);
            return true;
        }
    };

    const deleteMedia = async (id) => {
        if (!user) return false;
        try {
            // Optimistic delete
            setMediaItems(mediaItems.filter(m => m.id !== id));

            const { error } = await supabase
                .from('media')
                .delete()
                .eq('id', id)
                .eq('user_id', user.id);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error("Failed to delete media", error);
            return true; // Keep optimistic delete
        }
    };

    return { mediaItems, loading, addMedia, deleteMedia, uploadFile, refetch: fetchMedia };
}
