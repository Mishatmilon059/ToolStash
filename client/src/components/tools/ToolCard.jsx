import { ExternalLink, Check, Star, Trash2, ArrowUpRight, FlaskConical } from 'lucide-react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';
import { useState } from 'react';

export function ToolCard({ tool, onUpdateStatus, onDelete }) {
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);

    const statusColors = {
        new: 'text-neon-cyan border-neon-cyan/50 bg-neon-cyan/5',
        tried: 'text-neon-purple border-neon-purple/50 bg-neon-purple/5',
        useful: 'text-neon-green border-neon-green/50 bg-neon-green/5',
        archived: 'text-text-muted border-text-muted/50 bg-white/5',
    };

    const handleMarkTried = (e) => {
        e.stopPropagation();
        if (tool.status === 'new') {
            onUpdateStatus?.(tool.id, 'tried');
        } else if (tool.status === 'tried') {
            onUpdateStatus?.(tool.id, 'new');
        }
    };

    const handleMarkUseful = (e) => {
        e.stopPropagation();
        if (tool.status !== 'useful') {
            onUpdateStatus?.(tool.id, 'useful');
        } else {
            onUpdateStatus?.(tool.id, 'tried');
        }
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        if (showConfirmDelete) {
            onDelete?.(tool.id);
        } else {
            setShowConfirmDelete(true);
            setTimeout(() => setShowConfirmDelete(false), 3000);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="group relative bg-[#14141F]/60 backdrop-blur-md border border-white/5 rounded-2xl p-6 transition-all duration-300 hover:border-white/10 hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] overflow-hidden"
        >
            {/* Hover Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="relative z-10 mb-4 flex justify-between items-start">
                <div className={clsx(
                    'text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-lg border',
                    statusColors[tool.status]
                )}>
                    {tool.status}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                        onClick={handleMarkTried}
                        title={tool.status === 'tried' ? 'Mark as new' : 'Mark as tried'}
                        className={clsx(
                            'p-1.5 rounded-full transition-colors',
                            tool.status === 'tried' || tool.status === 'useful'
                                ? 'bg-neon-purple/20 text-neon-purple'
                                : 'hover:bg-white/10 text-text-secondary hover:text-neon-purple'
                        )}
                    >
                        <FlaskConical size={14} />
                    </button>
                    <button
                        onClick={handleMarkUseful}
                        title={tool.status === 'useful' ? 'Unmark useful' : 'Mark as useful'}
                        className={clsx(
                            'p-1.5 rounded-full transition-colors',
                            tool.status === 'useful'
                                ? 'bg-neon-yellow/20 text-neon-yellow'
                                : 'hover:bg-white/10 text-text-secondary hover:text-neon-yellow'
                        )}
                    >
                        <Star size={14} />
                    </button>
                    <button
                        onClick={handleDelete}
                        title={showConfirmDelete ? 'Click again to confirm' : 'Delete tool'}
                        className={clsx(
                            'p-1.5 rounded-full transition-colors',
                            showConfirmDelete
                                ? 'bg-red-500/20 text-red-400 animate-pulse'
                                : 'hover:bg-white/10 text-text-secondary hover:text-red-400'
                        )}
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-neon-cyan group-hover:to-blue-400 transition-all duration-300">
                {tool.name}
            </h3>

            <p className="text-text-secondary text-sm mb-6 leading-relaxed line-clamp-2 group-hover:text-text-primary transition-colors">
                {tool.description}
            </p>

            {/* Tags */}
            {tool.tags && tool.tags.length > 0 && (
                <div className="relative z-10 flex flex-wrap gap-1.5 mb-4">
                    {tool.tags.map(tag => (
                        <span key={tag} className="text-[10px] px-2 py-0.5 bg-white/5 text-text-muted rounded-md">
                            #{tag}
                        </span>
                    ))}
                </div>
            )}

            <div className="relative z-10 pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs text-text-muted font-mono">{tool.category}</span>

                {tool.url && (
                    <a
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-neon-cyan transition-colors"
                    >
                        Visit <ArrowUpRight size={14} />
                    </a>
                )}
            </div>
        </motion.div>
    );
}
