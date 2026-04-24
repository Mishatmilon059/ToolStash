import { X, ExternalLink, Paperclip, Film, Image as ImageIcon, StickyNote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';

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

export function MediaPreviewModal({ isOpen, onClose, media }) {
    if (!isOpen || !media) return null;

    const Icon = TYPE_ICONS[media.type] || StickyNote;
    const color = TYPE_COLORS[media.type] || 'gray-400';
    const displayDate = media.date || (media.created_at
        ? new Date(media.created_at).toLocaleDateString()
        : 'Just now');

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    onClick={onClose}
                />

                {/* Modal Container */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-bg-card border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex-shrink-0 p-4 border-b border-white/10 flex justify-between items-center bg-black/50 backdrop-blur-md z-10">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg bg-${color}/10 text-${color}`}>
                                <Icon size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white tracking-wide">
                                    {media.type.charAt(0).toUpperCase() + media.type.slice(1)} Preview
                                </h3>
                                <p className="text-xs text-gray-400 flex items-center gap-2">
                                    <span>{displayDate}</span>
                                    {media.platform && (
                                        <>
                                            <span>•</span>
                                            <span className={`text-[10px] px-1.5 py-0.5 rounded bg-gradient-to-r ${media.platform === 'YouTube' ? 'from-red-500 to-red-700' : 'from-purple-500 to-pink-500'} text-white font-bold inline-flex items-center gap-1`}>
                                                <Film size={8} /> {media.platform}
                                            </span>
                                        </>
                                    )}
                                </p>
                            </div>
                        </div>
                        <button 
                            onClick={onClose} 
                            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all border border-white/5 hover:border-white/20"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content Scrollable Area */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-gradient-to-b from-transparent to-black/20">
                        {/* 1. If it's a Reel / Link */}
                        {media.type === 'reel' && media.content?.startsWith('http') && (
                            <div className="flex flex-col items-center justify-center py-20 bg-black/40 rounded-2xl border border-white/5 shadow-inner">
                                <div className={`w-24 h-24 rounded-full bg-${color}/10 flex items-center justify-center mb-6 animate-pulse-slow`}>
                                    <Film size={40} className={`text-${color}`} />
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-2 text-center max-w-lg">
                                    This visual content is hosted externally on {media.platform || 'the web'}
                                </h2>
                                <p className="text-gray-400 text-center max-w-md mb-8">
                                    Click the button below to open the original link in a new tab.
                                </p>
                                <a
                                    href={media.content}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`px-8 py-4 bg-${color}/20 hover:bg-${color}/30 border border-${color}/50 rounded-full text-lg font-bold text-white shadow-[0_0_30px_rgba(var(--color-${color}),0.2)] transition-all flex items-center gap-3 hover:scale-105 active:scale-95`}
                                >
                                    Visit Full Link <ExternalLink size={20} />
                                </a>
                            </div>
                        )}

                        {/* 2. If it's a Screenshot / Image */}
                        {media.type === 'screenshot' && media.content && (
                            <div className="flex items-center justify-center rounded-2xl overflow-hidden border border-white/5 bg-black/40 shadow-inner">
                                <img 
                                    src={media.content} 
                                    alt="Full preview" 
                                    className="max-w-full max-h-[60vh] object-contain rounded-2xl"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'flex';
                                    }}
                                />
                                <div className="hidden flex-col items-center justify-center py-20 text-center">
                                    <ImageIcon size={48} className="text-gray-500 mb-4 opacity-50" />
                                    <p className="text-gray-400 font-medium">Image could not be loaded.</p>
                                    <p className="text-gray-600 text-sm mt-1">The URL might be broken or expired.</p>
                                </div>
                            </div>
                        )}

                        {/* 3. If it's a Note (or fallback for missing content) */}
                        {media.type === 'note' && (
                            <div className="min-h-[40vh] p-8 rounded-2xl bg-[#2a2a3e]/50 border border-white/5 shadow-inner backdrop-blur-sm">
                                <div className="prose prose-invert max-w-none">
                                    <p className="text-xl leading-relaxed text-gray-200 whitespace-pre-wrap font-medium">
                                        {media.note || "No note content available."}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Description (Used for reels and screenshots) */}
                        {media.type !== 'note' && media.note && (
                            <div className="mt-6 p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <StickyNote size={14} className="text-gray-400" /> Description / Note
                                </h4>
                                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                                    {media.note}
                                </p>
                            </div>
                        )}

                        {/* Linked Tools */}
                        {(media.linked_tools?.length > 0 || media.linkedTools?.length > 0) && (
                            <div className="mt-6">
                                <h4 className="text-sm font-bold text-white shadow-sm mb-3 flex items-center gap-2">
                                    <Paperclip size={14} className="text-gray-400" /> Linked Tools
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {(media.linked_tools || media.linkedTools).map(tool => (
                                        <span 
                                            key={tool} 
                                            className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg text-sm border border-white/10 transition-colors flex items-center gap-2"
                                        >
                                            <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan/70"></div>
                                            {tool}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex-shrink-0 p-4 border-t border-white/10 flex justify-end gap-3 bg-black/30 backdrop-blur-md">
                        {media.content?.startsWith('http') && (
                            <Button 
                                onClick={() => window.open(media.content, '_blank')}
                                className="bg-white/5 hover:bg-white/10 text-white border-white/10 gap-2"
                            >
                                <ExternalLink size={16} /> Open Link
                            </Button>
                        )}
                        <Button variant="primary" onClick={onClose} className="px-8 shadow-glow-cyan bg-neon-cyan text-black hover:bg-[#00d0dd]">
                            Close
                        </Button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
