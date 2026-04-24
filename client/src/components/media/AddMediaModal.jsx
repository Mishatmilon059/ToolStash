import { useState, useRef } from 'react';
import { X, Save, Film, Image as ImageIcon, StickyNote, Camera, FileText, Link2, Loader2, Check } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { clsx } from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';

export function AddMediaModal({ isOpen, onClose, onSave }) {
    const [mediaType, setMediaType] = useState('note');
    const [note, setNote] = useState('');
    const [link, setLink] = useState('');
    const [linkedTool, setLinkedTool] = useState('');
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const fileInputRef = useRef(null);

    const resetForm = () => {
        setMediaType('note');
        setNote('');
        setLink('');
        setLinkedTool('');
        setFile(null);
        setFileName('');
        setSaving(false);
        setSaved(false);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleSave = async () => {
        setSaving(true);

        const mediaData = {
            type: mediaType,
            note: note.trim() || null,
            linked_tools: linkedTool.trim() ? [linkedTool.trim()] : [],
        };

        if (mediaType === 'reel' && link.trim()) {
            mediaData.content = link.trim();
            // Try to detect platform
            if (/instagram/i.test(link)) mediaData.platform = 'Instagram';
            else if (/youtube|youtu\.be/i.test(link)) mediaData.platform = 'YouTube';
            else if (/tiktok/i.test(link)) mediaData.platform = 'TikTok';
            else if (/facebook|fb/i.test(link)) mediaData.platform = 'Facebook';
            else if (/twitter|x\.com/i.test(link)) mediaData.platform = 'X';
        }

        if (mediaType === 'screenshot' && file) {
            mediaData.content = URL.createObjectURL(file);
        }

        await onSave?.(mediaData);

        await new Promise(r => setTimeout(r, 400));
        setSaving(false);
        setSaved(true);
        setTimeout(() => handleClose(), 1000);
    };

    const handleFileSelect = (e) => {
        const f = e.target.files?.[0];
        if (f) {
            setFile(f);
            setFileName(f.name);
        }
    };

    const canSave = () => {
        if (mediaType === 'note') return note.trim().length > 0;
        if (mediaType === 'reel') return link.trim().length > 0;
        if (mediaType === 'screenshot') return file !== null;
        return false;
    };

    if (!isOpen) return null;

    const types = [
        { id: 'note', label: 'Note', icon: StickyNote, color: 'neon-yellow' },
        { id: 'reel', label: 'Reel / Link', icon: Film, color: 'neon-purple' },
        { id: 'screenshot', label: 'Screenshot', icon: ImageIcon, color: 'neon-cyan' },
    ];

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-bg-dark/80 backdrop-blur-sm"
                    onClick={handleClose}
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-md bg-bg-card border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-white/10 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-white">Add Media</h2>
                        <button onClick={handleClose} className="text-text-secondary hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5">
                            <X size={20} />
                        </button>
                    </div>

                    {saved ? (
                        <div className="p-12 text-center">
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                                className="w-16 h-16 mx-auto mb-4 rounded-full bg-neon-green/20 flex items-center justify-center"
                            >
                                <Check size={32} className="text-neon-green" />
                            </motion.div>
                            <h3 className="text-xl font-bold text-white">Saved!</h3>
                        </div>
                    ) : (
                        <div className="p-6 space-y-5">
                            {/* Type selector */}
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-2">Media Type</label>
                                <div className="flex gap-2">
                                    {types.map(t => (
                                        <button
                                            key={t.id}
                                            onClick={() => setMediaType(t.id)}
                                            className={clsx(
                                                'flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl text-sm font-medium transition-all border',
                                                mediaType === t.id
                                                    ? `bg-${t.color}/10 border-${t.color}/30 text-${t.color}`
                                                    : 'bg-white/5 border-white/5 text-text-secondary hover:text-white hover:border-white/15'
                                            )}
                                        >
                                            <t.icon size={18} />
                                            {t.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Type-specific content */}
                            {mediaType === 'note' && (
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-2">Your note</label>
                                    <textarea
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        placeholder="Write a thought, discovery, or reminder..."
                                        rows={4}
                                        autoFocus
                                        className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-yellow/50 transition-all placeholder:text-text-muted resize-none"
                                    />
                                </div>
                            )}

                            {mediaType === 'reel' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-2">Reel or video link</label>
                                        <div className="relative">
                                            <Link2 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                                            <input
                                                type="url"
                                                value={link}
                                                onChange={(e) => setLink(e.target.value)}
                                                placeholder="https://instagram.com/reel/..."
                                                autoFocus
                                                className="w-full bg-black/30 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-neon-purple/50 transition-all placeholder:text-text-muted"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-2">Description (optional)</label>
                                        <input
                                            type="text"
                                            value={note}
                                            onChange={(e) => setNote(e.target.value)}
                                            placeholder="What's this reel about?"
                                            className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/20 transition-all placeholder:text-text-muted"
                                        />
                                    </div>
                                </div>
                            )}

                            {mediaType === 'screenshot' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-2">Upload image</label>
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center cursor-pointer hover:border-neon-cyan/30 hover:bg-neon-cyan/5 transition-all group"
                                        >
                                            {file ? (
                                                <div className="space-y-1">
                                                    <Check size={24} className="text-neon-green mx-auto" />
                                                    <p className="text-white text-sm font-medium">{fileName}</p>
                                                    <p className="text-text-muted text-xs">Click to change</p>
                                                </div>
                                            ) : (
                                                <div className="space-y-1">
                                                    <Camera size={24} className="text-text-muted mx-auto group-hover:text-neon-cyan transition-colors" />
                                                    <p className="text-text-secondary text-sm">Click to upload</p>
                                                </div>
                                            )}
                                        </div>
                                        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-2">Caption (optional)</label>
                                        <input
                                            type="text"
                                            value={note}
                                            onChange={(e) => setNote(e.target.value)}
                                            placeholder="What does this screenshot show?"
                                            className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/20 transition-all placeholder:text-text-muted"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Linked tool (shared) */}
                            <Input
                                label="Link to AI tool (optional)"
                                placeholder="e.g. ChatGPT, Runway..."
                                value={linkedTool}
                                onChange={(e) => setLinkedTool(e.target.value)}
                                className="bg-black/30"
                            />

                            {/* Actions */}
                            <div className="pt-2 flex justify-end gap-3">
                                <Button variant="ghost" onClick={handleClose}>Cancel</Button>
                                <Button
                                    onClick={handleSave}
                                    disabled={!canSave() || saving}
                                    className="gap-2 shadow-glow-purple bg-neon-purple hover:bg-purple-600 border-none"
                                >
                                    {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                    {saving ? 'Saving...' : 'Save Media'}
                                </Button>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
