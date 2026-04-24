import { motion } from 'framer-motion';
import { Film, Image as ImageIcon, StickyNote, Paperclip, Trash2 } from 'lucide-react';
import { useState } from 'react';

const TYPE_ICONS = {
    reel: Film,
    screenshot: ImageIcon,
    note: StickyNote
};

const TYPE_COLORS = {
    reel: 'neon-purple',
    screenshot: 'neon-cyan',
    note: 'neon-yellow'
};

export const MediaCard = ({ media, delay = 0, onDelete, onClick }) => {
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const Icon = TYPE_ICONS[media.type] || StickyNote;
    const color = TYPE_COLORS[media.type] || 'gray-400';

    const handleDelete = (e) => {
        e.stopPropagation();
        if (showConfirmDelete) {
            onDelete?.(media.id);
        } else {
            setShowConfirmDelete(true);
            setTimeout(() => setShowConfirmDelete(false), 3000);
        }
    };

    const displayDate = media.date || (media.created_at
        ? new Date(media.created_at).toLocaleDateString()
        : 'Just now');

    return (
        <motion.div
            onClick={onClick}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ delay }}
            className={`group relative bg-[#1e1e2d] border border-white/5 rounded-2xl overflow-hidden hover:border-white/20 transition-all hover:-translate-y-1 ${onClick ? 'cursor-pointer' : ''}`}
        >
            {/* Delete button */}
            <button
                onClick={handleDelete}
                className={`absolute top-3 right-3 z-20 p-1.5 rounded-lg backdrop-blur-md transition-all ${
                    showConfirmDelete
                        ? 'bg-red-500/30 text-red-400 opacity-100 border border-red-500/30'
                        : 'bg-black/40 text-white/50 opacity-0 group-hover:opacity-100 hover:text-red-400 border border-white/10'
                }`}
                title={showConfirmDelete ? 'Click again to confirm' : 'Delete'}
            >
                <Trash2 size={14} />
            </button>

            {/* Visual Content (Thumbnail) */}
            <div className="aspect-video w-full bg-black/50 relative overflow-hidden flex flex-col items-center justify-center">
                {media.content && media.type !== 'note' ? (
                    media.content.startsWith('http') && media.type === 'reel' ? (
                        <div className="flex flex-col items-center justify-center h-full w-full bg-black/60 gap-3 px-4 text-center">
                            <Film className={`text-${color} opacity-80`} size={40} />
                            <a
                                href={media.content}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-5 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-sm font-medium text-white shadow-lg transition-all flex items-center gap-2 hover:scale-105"
                                onClick={(e) => e.stopPropagation()}
                            >
                                Visit Link <Film size={14} />
                            </a>
                        </div>
                    ) : (
                        <img
                            src={media.content}
                            alt="Media content"
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                        />
                    )
                ) : (
                    <div className={`w-full h-full flex items-center justify-center bg-${color}/5`}>
                        <Icon size={48} className={`text-${color}/50`} />
                    </div>
                )}

                {/* Type Badge */}
                <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur rounded-lg border border-white/10 flex items-center gap-1.5">
                    <Icon size={12} className={`text-${color}`} />
                    <span className="text-[10px] font-medium text-white uppercase tracking-wider">{media.type}</span>
                </div>

                {/* Date */}
                <div className="absolute bottom-3 right-3 text-[10px] text-white/60 bg-black/40 px-2 py-1 rounded-full backdrop-blur">
                    {displayDate}
                </div>
            </div>

            {/* Content Body */}
            <div className="p-4 space-y-3">
                {/* Note/Description */}
                <p className="text-sm text-gray-300 line-clamp-2 min-h-[40px]">
                    {media.note || "No description added."}
                </p>

                {/* Linked Tools */}
                {media.linked_tools && media.linked_tools.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                        {media.linked_tools.map(tool => (
                            <span key={tool} className="text-[10px] px-2 py-1 bg-white/5 text-gray-400 rounded-md flex items-center gap-1">
                                <Paperclip size={10} /> {tool}
                            </span>
                        ))}
                    </div>
                )}

                {/* Legacy support */}
                {media.linkedTools && media.linkedTools.length > 0 && !media.linked_tools && (
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                        {media.linkedTools.map(tool => (
                            <span key={tool} className="text-[10px] px-2 py-1 bg-white/5 text-gray-400 rounded-md flex items-center gap-1">
                                <Paperclip size={10} /> {tool}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Platform Icon Overlay (if reel) */}
            {media.platform && (
                <div className="absolute top-12 left-3 text-[10px] px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded text-white font-bold shadow-lg flex items-center gap-1 z-10">
                    <Film size={10} /> {media.platform}
                </div>
            )}
        </motion.div>
    );
};
