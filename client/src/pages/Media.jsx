import { useState } from 'react';
import { useMedia } from '../hooks/useMedia';
import { MediaCard } from '../components/media/MediaComponents';
import { MediaPreviewModal } from '../components/media/MediaPreviewModal';
import { AddMediaModal } from '../components/media/AddMediaModal';
import { Button } from '../components/ui/Button';
import { Filter, Plus, Film, Image as ImageIcon, StickyNote } from 'lucide-react';

export default function Media() {
    const { mediaItems, addMedia, deleteMedia } = useMedia();
    const [filter, setFilter] = useState('all');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState(null);

    const filteredMedia = mediaItems.filter(item =>
        filter === 'all' || item.type === filter
    );

    const filters = [
        { id: 'all', label: 'All Media', icon: null },
        { id: 'reel', label: 'Reels', icon: Film },
        { id: 'screenshot', label: 'Screenshots', icon: ImageIcon },
        { id: 'note', label: 'Notes', icon: StickyNote },
    ];

    return (
        <div className="pt-2 space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <p className="text-gray-400 text-sm mb-1 uppercase tracking-wider">Context Memory</p>
                    <h1 className="text-3xl font-bold text-white">My Media</h1>
                    <p className="text-text-secondary mt-2 max-w-xl">
                        Everything that helped you discover or understand a tool. Save reels, screenshots, and notes to remember the "Why" behind the AI.
                    </p>
                </div>

                <Button
                    onClick={() => setIsAddModalOpen(true)}
                    className="gap-2 bg-neon-purple hover:bg-neon-purple/90 text-white border-none shadow-glow-purple"
                >
                    <Plus size={18} /> Add Media
                </Button>
            </div>

            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                {filters.map(f => {
                    const Icon = f.icon;
                    const count = f.id === 'all' ? mediaItems.length : mediaItems.filter(m => m.type === f.id).length;
                    return (
                        <button
                            key={f.id}
                            onClick={() => setFilter(f.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === f.id
                                ? 'bg-white text-black font-bold'
                                : 'bg-[#1e1e2d] text-gray-400 hover:text-white hover:bg-[#252536]'
                                }`}
                        >
                            {Icon && <Icon size={14} />}
                            {f.label}
                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${filter === f.id ? 'bg-black/10' : 'bg-white/10'}`}>
                                {count}
                            </span>
                        </button>
                    )
                })}
            </div>

            {/* Media Grid */}
            {filteredMedia.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredMedia.map((media, index) => (
                        <MediaCard
                            key={media.id}
                            media={media}
                            delay={index * 0.1}
                            onDelete={deleteMedia}
                            onClick={() => setSelectedMedia(media)}
                        />
                    ))}

                    {/* Add New Placeholder Card */}
                    <div
                        onClick={() => setIsAddModalOpen(true)}
                        className="border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-gray-500 hover:text-neon-cyan hover:border-neon-cyan/30 transition-all cursor-pointer min-h-[200px] gap-3 group"
                    >
                        <div className="p-4 rounded-full bg-white/5 group-hover:bg-neon-cyan/10 transition-colors">
                            <Plus size={24} />
                        </div>
                        <span className="text-sm font-medium">Add New Item</span>
                    </div>
                </div>
            ) : (
                <div className="text-center py-20 bg-[#1e1e2d] rounded-3xl border border-dashed border-white/5">
                    <p className="text-gray-400 mb-4">
                        {mediaItems.length === 0
                            ? 'No media yet! Start saving reels, screenshots, or notes.'
                            : 'No media found for this filter.'
                        }
                    </p>
                    {mediaItems.length > 0 && (
                        <Button variant="secondary" onClick={() => setFilter('all')}>Clear Filters</Button>
                    )}
                </div>
            )}

            {/* Add Media Modal */}
            <AddMediaModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSave={addMedia}
            />

            {/* Media Preview Modal */}
            <MediaPreviewModal
                isOpen={!!selectedMedia}
                media={selectedMedia}
                onClose={() => setSelectedMedia(null)}
            />
        </div>
    );
}
