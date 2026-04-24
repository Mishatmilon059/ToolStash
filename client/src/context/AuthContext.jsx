import React, { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

// Set to true to bypass auth during development (uses a fake test user)
const DEV_BYPASS = true;

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            handleSession(session);
        });

        // Listen for auth changes
        const { data: { subscription } } =
            supabase.auth.onAuthStateChange((_event, session) => {
                handleSession(session);
            });

        return () => subscription.unsubscribe();
    }, []);

    const handleSession = (session) => {
        setSession(session);

        if (session?.user) {
            setUser(session.user);
        } else if (DEV_BYPASS) {
            console.log("⚠️ DEV MODE: Using Test User Bypass");
            setUser({
                id: '11111111-1111-1111-1111-111111111111',
                email: 'bypass@test.com',
                user_metadata: { display_name: 'Test Agent' }
            });
        } else {
            setUser(null);
        }

        setLoading(false);
    };

    const login = async (email, password) => {
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password
            });
            if (error) throw error;
            navigate('/');
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const signup = async (email, password, displayName) => {
        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { display_name: displayName }
                }
            });
            if (error) throw error;
            navigate('/');
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setSession(null);
        navigate('/welcome');
    };

    return (
        <AuthContext.Provider value={{ user, session, login, signup, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
