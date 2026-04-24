import { useState, useEffect } from 'react';
import { Shield, Users, Database, LayoutTemplate, Activity, ChevronRight, RefreshCw, Trash2, Edit3 } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { motion } from 'framer-motion';

// Separate Supabase client for Admin to fetch global data directly
// Note: RLS must be disabled or this needs a service_role key to see all users' data.
// Since RLS is currently disabled for DEV_BYPASS, the anon key works globally.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function AdminDashboard() {
    const [stats, setStats] = useState({ tools: 0, media: 0, platformCount: {} });
    const [recentTools, setRecentTools] = useState([]);
    const [recentMedia, setRecentMedia] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview'); // overview, tools, media
    const [refreshing, setRefreshing] = useState(false);

    const fetchAdminData = async () => {
        setRefreshing(true);
        try {
            // Fetch all tools globally
            const { data: toolsData, error: toolsError } = await supabase
                .from('ai_tools')
                .select('*')
                .order('created_at', { ascending: false });

            // Fetch all media globally
            const { data: mediaData, error: mediaError } = await supabase
                .from('media')
                .select('*')
                .order('created_at', { ascending: false });

            if (toolsError) throw toolsError;
            if (mediaError) throw mediaError;

            // Calculate exact platform distribution
            const platforms = {};
            mediaData.forEach(m => {
                if (m.platform) {
                    platforms[m.platform] = (platforms[m.platform] || 0) + 1;
                }
            });

            setStats({
                tools: toolsData.length,
                media: mediaData.length,
                platformCount: platforms
            });

            setRecentTools(toolsData);
            setRecentMedia(mediaData);
        } catch (error) {
            console.error("Admin fetch error:", error);
            alert("Error fetching global data: " + error.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchAdminData();
    }, []);

    const handleDeleteTool = async (id) => {
        if (!window.confirm("WARNING: This will permanently delete this tool from the global database. Continue?")) return;
        const { error } = await supabase.from('ai_tools').delete().eq('id', id);
        if (error) alert(error.message);
        else fetchAdminData();
    };

    const handleDeleteMedia = async (id) => {
        if (!window.confirm("WARNING: This will permanently delete this media item from the global database. Continue?")) return;
        const { error } = await supabase.from('media').delete().eq('id', id);
        if (error) alert(error.message);
        else fetchAdminData();
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[80vh] text-white space-y-4">
                <RefreshCw className="animate-spin text-neon-cyan" size={32} />
                <p>Establishing secure connection to Database...</p>
            </div>
        );
    }

    return (
        <div className="pt-2 pb-10 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-red-500/20 pb-6">
                <div>
                    <p className="text-red-400 text-sm mb-1 uppercase tracking-widest font-bold flex items-center gap-2">
                        <Shield size={14} /> System Administrator
                    </p>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Global Command Center</h1>
                    <p className="text-gray-400 mt-2">
                        You have unrestricted read/write access to all tables. Bypass is currently active.
                    </p>
                </div>
                <button 
                    onClick={fetchAdminData}
                    disabled={refreshing}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white transition-all disabled:opacity-50"
                >
                    <RefreshCw size={16} className={refreshing ? 'animate-spin text-neon-cyan' : ''} />
                    Refresh Data
                </button>
            </div>

            {/* Metrics Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-[#1a1a24] border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute -right-6 -top-6 text-neon-cyan/5 group-hover:text-neon-cyan/10 transition-colors duration-500">
                        <Database size={120} />
                    </div>
                    <h3 className="text-gray-400 font-medium mb-1 relative z-10">Total Tools Logged</h3>
                    <p className="text-4xl font-bold xl:text-5xl text-white relative z-10">{stats.tools}</p>
                </div>

                <div className="bg-[#1a1a24] border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute -right-6 -top-6 text-neon-purple/5 group-hover:text-neon-purple/10 transition-colors duration-500">
                        <LayoutTemplate size={120} />
                    </div>
                    <h3 className="text-gray-400 font-medium mb-1 relative z-10">Total Media Assets</h3>
                    <p className="text-4xl font-bold xl:text-5xl text-white relative z-10">{stats.media}</p>
                </div>

                <div className="bg-[#1a1a24] border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute -right-6 -top-6 text-neon-yellow/5 group-hover:text-neon-yellow/10 transition-colors duration-500">
                        <Activity size={120} />
                    </div>
                    <h3 className="text-gray-400 font-medium mb-1 relative z-10">System Status</h3>
                    <p className="text-2xl font-bold text-neon-yellow relative z-10 mt-2 flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-neon-yellow animate-pulse-slow block"></span>
                        RLS Bypassed
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/10">
                <button 
                    onClick={() => setActiveTab('overview')}
                    className={`px-6 py-3 font-medium transition-colors border-b-2 ${activeTab === 'overview' ? 'border-neon-cyan text-neon-cyan' : 'border-transparent text-gray-400 hover:text-white'}`}
                >
                    System Overview
                </button>
                <button 
                    onClick={() => setActiveTab('tools')}
                    className={`px-6 py-3 font-medium transition-colors border-b-2 ${activeTab === 'tools' ? 'border-neon-cyan text-neon-cyan' : 'border-transparent text-gray-400 hover:text-white'}`}
                >
                    Tools DB ({stats.tools})
                </button>
                <button 
                    onClick={() => setActiveTab('media')}
                    className={`px-6 py-3 font-medium transition-colors border-b-2 ${activeTab === 'media' ? 'border-neon-cyan text-neon-cyan' : 'border-transparent text-gray-400 hover:text-white'}`}
                >
                    Media DB ({stats.media})
                </button>
            </div>

            {/* Tab Contents */}
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Platform Distribution */}
                        <div className="bg-[#1a1a24] border border-white/10 rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                <Activity size={18} className="text-neon-purple" /> Media by Platform
                            </h3>
                            {Object.keys(stats.platformCount).length > 0 ? (
                                <div className="space-y-4">
                                    {Object.entries(stats.platformCount)
                                        .sort((a,b) => b[1] - a[1])
                                        .map(([platform, count]) => (
                                        <div key={platform} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                                            <span className="font-medium text-gray-200">{platform}</span>
                                            <span className="bg-black/50 px-3 py-1 rounded-full text-sm text-neon-cyan font-mono">
                                                {count} items
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-8">No external media platforms logged yet.</p>
                            )}
                        </div>

                        {/* Recent Activity Log */}
                        <div className="bg-[#1a1a24] border border-white/10 rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-white mb-6">Latest DB Inserts (Last 5)</h3>
                            <div className="space-y-3">
                                {recentTools.slice(0, 3).map(tool => (
                                    <div key={'tool-'+tool.id} className="flex items-center gap-3 text-sm p-2 rounded hover:bg-white/5">
                                        <span className="w-2 h-2 rounded-full bg-neon-cyan"></span>
                                        <span className="text-gray-400">{new Date(tool.created_at).toLocaleDateString()}</span>
                                        <span className="text-white">New Tool: <span className="font-bold">{tool.name}</span></span>
                                    </div>
                                ))}
                                {recentMedia.slice(0, 2).map(media => (
                                    <div key={'media-'+media.id} className="flex items-center gap-3 text-sm p-2 rounded hover:bg-white/5">
                                        <span className="w-2 h-2 rounded-full bg-neon-purple"></span>
                                        <span className="text-gray-400">{new Date(media.created_at).toLocaleDateString()}</span>
                                        <span className="text-white">New Media: <span className="font-bold uppercase text-[10px] px-1 bg-white/10 rounded">{media.type}</span></span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'tools' && (
                    <div className="bg-[#1a1a24] border border-white/10 rounded-2xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm cursor-default">
                                <thead className="bg-black/40 text-gray-400 capitalize">
                                    <tr>
                                        <th className="px-6 py-4 font-medium">Name</th>
                                        <th className="px-6 py-4 font-medium">Category</th>
                                        <th className="px-6 py-4 font-medium">Status</th>
                                        <th className="px-6 py-4 font-medium">Date ADDED</th>
                                        <th className="px-6 py-4 font-medium text-right">Admin Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {recentTools.map((tool) => (
                                        <tr key={tool.id} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="px-6 py-4 font-medium text-white flex items-center gap-2">
                                                {tool.name}
                                            </td>
                                            <td className="px-6 py-4 text-gray-400">{tool.category}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                                                    tool.status === 'useful' ? 'bg-green-500/10 text-green-400' :
                                                    tool.status === 'tried' ? 'bg-yellow-500/10 text-yellow-400' :
                                                    'bg-blue-500/10 text-blue-400'
                                                }`}>
                                                    {tool.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500">{new Date(tool.created_at).toLocaleString()}</td>
                                            <td className="px-6 py-4 text-right">
                                                <button 
                                                    onClick={() => handleDeleteTool(tool.id)}
                                                    className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                                    title="Force Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {recentTools.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-12 text-center text-gray-500">No tools found in the database.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'media' && (
                    <div className="bg-[#1a1a24] border border-white/10 rounded-2xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm cursor-default">
                                <thead className="bg-black/40 text-gray-400 capitalize">
                                    <tr>
                                        <th className="px-6 py-4 font-medium">Type</th>
                                        <th className="px-6 py-4 font-medium">Platform / Details</th>
                                        <th className="px-6 py-4 font-medium">Linked Tools</th>
                                        <th className="px-6 py-4 font-medium">Date ADDED</th>
                                        <th className="px-6 py-4 font-medium text-right">Admin Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {recentMedia.map((media) => (
                                        <tr key={media.id} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                                                    media.type === 'reel' ? 'bg-purple-500/10 text-purple-400' :
                                                    media.type === 'screenshot' ? 'bg-cyan-500/10 text-cyan-400' :
                                                    'bg-yellow-500/10 text-yellow-400'
                                                }`}>
                                                    {media.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    {media.platform && <span className="text-white font-medium">{media.platform}</span>}
                                                    <span className="text-gray-500 text-xs truncate max-w-[200px]">{media.content || "Text/Note context"}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1 max-w-[200px]">
                                                    {media.linked_tools?.map(t => (
                                                        <span key={t} className="px-1.5 py-0.5 bg-white/5 rounded text-[10px] text-gray-400">{t}</span>
                                                    )) || <span className="text-gray-600">-</span>}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500">{new Date(media.created_at).toLocaleString()}</td>
                                            <td className="px-6 py-4 text-right">
                                                <button 
                                                    onClick={() => handleDeleteMedia(media.id)}
                                                    className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                                    title="Force Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {recentMedia.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-12 text-center text-gray-500">No media found in the database.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
