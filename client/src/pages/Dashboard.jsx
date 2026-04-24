import { useState } from 'react';
import { Search, Filter, Sparkles } from 'lucide-react';
import { ToolCard } from '../components/tools/ToolCard';
import { Button } from '../components/ui/Button';
import { useTools } from '../hooks/useTools';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dashboard() {
    const { tools, loading, updateToolStatus, deleteTool } = useTools();
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('all');

    if (loading || !user) return <div className="text-white pt-20 text-center">Loading Dashboard...</div>;

    const filteredTools = tools.filter(tool => {
        const matchesSearch = tool.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tool.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filter === 'all' || tool.status === filter;
        return matchesSearch && matchesFilter;
    });

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const statusCounts = {
        all: tools.length,
        new: tools.filter(t => t.status === 'new').length,
        tried: tools.filter(t => t.status === 'tried').length,
        useful: tools.filter(t => t.status === 'useful').length,
    };

    return (
        <div className="pt-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                        My Stash <Sparkles className="text-neon-yellow animate-pulse-slow" size={24} />
                    </h1>
                    <p className="text-text-secondary">Welcome back, <span className="text-neon-cyan font-bold">{user.user_metadata?.display_name || user.email?.split('@')[0]}</span>. managing {tools.length} AI tools.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <div className="relative group w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-neon-cyan transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Search library..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-[#0A0A0F] border border-white/10 rounded-xl px-12 py-3.5 text-white focus:outline-none focus:border-neon-cyan/50 focus:shadow-[0_0_20px_rgba(0,240,255,0.1)] transition-all placeholder:text-text-muted"
                        />
                    </div>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-4 mb-4 custom-scrollbar">
                {['all', 'new', 'tried', 'useful'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 border flex items-center gap-2 ${filter === status
                            ? 'bg-neon-cyan/10 border-neon-cyan text-neon-cyan shadow-glow-cyan'
                            : 'bg-transparent border-white/10 text-text-secondary hover:border-white/30 hover:text-white'
                            }`}
                    >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${filter === status ? 'bg-neon-cyan/20' : 'bg-white/10'}`}>
                            {statusCounts[status]}
                        </span>
                    </button>
                ))}
            </div>

            {/* Tools Grid */}
            {filteredTools.length > 0 ? (
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    variants={container}
                    initial="hidden"
                    animate="show"
                >
                    <AnimatePresence>
                        {filteredTools.map((tool) => (
                            <ToolCard
                                key={tool.id}
                                tool={tool}
                                onUpdateStatus={updateToolStatus}
                                onDelete={deleteTool}
                            />
                        ))}
                    </AnimatePresence>
                </motion.div>
            ) : (
                <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/5 border-dashed">
                    <p className="text-text-secondary text-lg mb-2">
                        {tools.length === 0
                            ? 'Your stash is empty! Click "New Save" in the sidebar to add your first AI tool.'
                            : 'No tools found matching your search.'
                        }
                    </p>
                    {tools.length > 0 && (
                        <Button className="mt-4" onClick={() => { setSearchQuery(''); setFilter('all'); }}>
                            Reset Filters
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}
