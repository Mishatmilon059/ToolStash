import { useState, useEffect, useRef } from 'react';
import { X, Save, Link2, Camera, FileText, Loader2, Check, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { clsx } from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';

// Platform detection logic
const PLATFORMS = [
    { id: 'instagram', label: 'Instagram', color: 'from-purple-500 to-pink-500', match: /instagram\.com|instagr\.am/i },
    { id: 'youtube', label: 'YouTube', color: 'from-red-500 to-red-700', match: /youtube\.com|youtu\.be/i },
    { id: 'facebook', label: 'Facebook', color: 'from-blue-500 to-blue-700', match: /facebook\.com|fb\.watch/i },
    { id: 'tiktok', label: 'TikTok', color: 'from-gray-900 to-pink-500', match: /tiktok\.com/i },
    { id: 'twitter', label: 'X / Twitter', color: 'from-gray-700 to-gray-900', match: /twitter\.com|x\.com/i },
];

function detectPlatform(url) {
    if (!url) return null;
    for (const p of PLATFORMS) {
        if (p.match.test(url)) return p;
    }
    // If it looks like a URL but doesn't match any platform
    try {
        new URL(url);
        return { id: 'web', label: 'Website', color: 'from-neon-cyan to-blue-500', match: null };
    } catch {
        return null;
    }
}

// Simple AI-like auto-fill for categories based on common keywords
const CATEGORY_KEYWORDS = {
    'Image': ['image', 'photo', 'art', 'design', 'draw', 'midjourney', 'dall-e', 'stable diffusion', 'flux', 'ideogram', 'leonardo'],
    'Video': ['video', 'film', 'reel', 'runway', 'pika', 'sora', 'kling', 'luma', 'animate'],
    'Audio': ['audio', 'voice', 'music', 'sound', 'speech', 'elevenlabs', 'suno', 'udio'],
    'Chatbot': ['chat', 'gpt', 'claude', 'gemini', 'llm', 'conversation', 'copilot', 'assistant'],
    'Coding': ['code', 'coding', 'developer', 'programming', 'cursor', 'github', 'replit', 'devin'],
    'Writing': ['write', 'writing', 'content', 'copy', 'blog', 'jasper', 'notion', 'grammarly'],
    'Productivity': ['productivity', 'automation', 'workflow', 'zapier', 'agent', 'task'],
};

function guessCategory(name) {
    const lower = name.toLowerCase();
    for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
        if (keywords.some(k => lower.includes(k))) return cat;
    }
    return 'Other';
}

function generateTags(name, category) {
    const tags = [category.toLowerCase()];
    const lower = name.toLowerCase();
    if (lower.includes('ai') || lower.includes('gpt') || lower.includes('gen')) tags.push('ai');
    if (lower.includes('free')) tags.push('free');
    return [...new Set(tags)];
}

function generateDescription(name, category) {
    const descriptions = {
        'Image': `AI-powered image generation and editing tool for creating visual content.`,
        'Video': `AI video creation and editing tool for content creators.`,
        'Audio': `AI audio processing tool for voice, music, and sound generation.`,
        'Chatbot': `AI conversational assistant for various tasks and queries.`,
        'Coding': `AI-powered development tool for writing and debugging code.`,
        'Writing': `AI writing assistant for content creation and editing.`,
        'Productivity': `AI productivity tool for automating workflows and tasks.`,
        'Other': `An AI-powered tool worth exploring.`,
    };
    return descriptions[category] || descriptions['Other'];
}

export function SaveToolModal({ isOpen, onClose, onSaveTool, onSaveMedia }) {
    const [tab, setTab] = useState('link'); // 'link' | 'capture'
    const [step, setStep] = useState(1);    // 1: paste link, 2: name the tool, 3: confirm
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const fileInputRef = useRef(null);

    // Link tab state
    const [url, setUrl] = useState('');
    const [detectedPlatform, setDetectedPlatform] = useState(null);
    const [toolName, setToolName] = useState('');

    // Capture tab state
    const [captureType, setCaptureType] = useState('text'); // 'text' | 'image'
    const [captureText, setCaptureText] = useState('');
    const [captureFile, setCaptureFile] = useState(null);
    const [captureFileName, setCaptureFileName] = useState('');
    const [captureToolName, setCaptureToolName] = useState('');

    // Reset on open
    // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect
    useEffect(() => {
        if (isOpen) {
            setTab('link');
            setStep(1);
            setUrl('');
            setDetectedPlatform(null);
            setToolName('');
            setCaptureText('');
            setCaptureFile(null);
            setCaptureFileName('');
            setCaptureToolName('');
            setSaving(false);
            setSaved(false);
        }
    }, [isOpen]);

    // Auto-detect platform when URL changes
    // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect
    useEffect(() => {
        const platform = detectPlatform(url);
        setDetectedPlatform(platform);
        if (platform && step === 1) {
            setStep(2);
        }
        if (!url) {
            setStep(1);
            setDetectedPlatform(null);
        }
    }, [url]);

    const handleLinkSave = async () => {
        if (!toolName.trim()) return;
        setSaving(true);

        const category = guessCategory(toolName);
        const tags = generateTags(toolName, category);
        const description = generateDescription(toolName, category);

        // Save as tool
        onSaveTool?.({
            name: toolName.trim(),
            description,
            category,
            status: 'new',
            url: url.trim(),
            tags,
        });

        // Save as media entry too
        const mediaType = detectedPlatform?.id === 'youtube' ? 'reel' :
            detectedPlatform?.id === 'instagram' ? 'reel' :
                detectedPlatform?.id === 'tiktok' ? 'reel' : 'note';

        onSaveMedia?.({
            type: mediaType,
            content: url.trim(),
            note: `Discovered ${toolName} via ${detectedPlatform?.label || 'web link'}`,
            linked_tools: [toolName.trim()],
            platform: detectedPlatform?.label || 'Web',
        });

        await new Promise(r => setTimeout(r, 600)); // brief visual delay
        setSaving(false);
        setSaved(true);
        setTimeout(() => onClose(), 1200);
    };

    const handleCaptureSave = async () => {
        setSaving(true);
        const name = captureToolName.trim() || 'Unnamed Tool';
        const category = guessCategory(name);

        if (captureType === 'text' && captureText.trim()) {
            onSaveMedia?.({
                type: 'note',
                content: null,
                note: captureText.trim(),
                linked_tools: name !== 'Unnamed Tool' ? [name] : [],
            });
        }

        if (captureType === 'image' && captureFile) {
            // For the frontend, we'll create an object URL for the image
            const imageUrl = URL.createObjectURL(captureFile);
            onSaveMedia?.({
                type: 'screenshot',
                content: imageUrl,
                note: `Screenshot of ${name}`,
                linked_tools: name !== 'Unnamed Tool' ? [name] : [],
            });
        }

        // If a tool name was given, also save it as a tool
        if (name !== 'Unnamed Tool') {
            onSaveTool?.({
                name,
                description: generateDescription(name, category),
                category,
                status: 'new',
                url: '',
                tags: generateTags(name, category),
            });
        }

        await new Promise(r => setTimeout(r, 600));
        setSaving(false);
        setSaved(true);
        setTimeout(() => onClose(), 1200);
    };

    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setCaptureFile(file);
            setCaptureFileName(file.name);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-bg-dark/80 backdrop-blur-sm"
                    onClick={onClose}
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-lg bg-bg-card border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-white/10 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Sparkles className="text-neon-cyan" size={20} />
                            Smart Save
                        </h2>
                        <button onClick={onClose} className="text-text-secondary hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-white/10">
                        <button
                            onClick={() => setTab('link')}
                            className={clsx(
                                'flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-medium transition-all',
                                tab === 'link'
                                    ? 'text-neon-cyan border-b-2 border-neon-cyan bg-neon-cyan/5'
                                    : 'text-text-secondary hover:text-white'
                            )}
                        >
                            <Link2 size={16} /> Paste Link
                        </button>
                        <button
                            onClick={() => setTab('capture')}
                            className={clsx(
                                'flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-medium transition-all',
                                tab === 'capture'
                                    ? 'text-neon-purple border-b-2 border-neon-purple bg-neon-purple/5'
                                    : 'text-text-secondary hover:text-white'
                            )}
                        >
                            <Camera size={16} /> Quick Capture
                        </button>
                    </div>

                    {/* Success State */}
                    {saved ? (
                        <div className="p-12 text-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-16 h-16 mx-auto mb-4 rounded-full bg-neon-green/20 flex items-center justify-center"
                            >
                                <Check size={32} className="text-neon-green" />
                            </motion.div>
                            <h3 className="text-xl font-bold text-white mb-1">Saved!</h3>
                            <p className="text-text-secondary text-sm">AI assistant organized everything for you ✨</p>
                        </div>
                    ) : (
                        <div className="p-6">
                            {/* ===== LINK TAB ===== */}
                            {tab === 'link' && (
                                <div className="space-y-5">
                                    {/* Step 1: Paste URL */}
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-2">Paste any link</label>
                                        <div className="relative">
                                            <Link2 size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                                            <input
                                                type="url"
                                                placeholder="https://instagram.com/reel/..."
                                                value={url}
                                                onChange={(e) => setUrl(e.target.value)}
                                                autoFocus
                                                className="w-full bg-black/30 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white focus:outline-none focus:border-neon-cyan/50 focus:shadow-[0_0_20px_rgba(0,240,255,0.1)] transition-all placeholder:text-text-muted"
                                            />
                                        </div>
                                    </div>

                                    {/* Platform badge */}
                                    {detectedPlatform && (
                                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                                            className="flex items-center gap-3"
                                        >
                                            <span className={`px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r ${detectedPlatform.color} shadow-lg`}>
                                                {detectedPlatform.label}
                                            </span>
                                            <span className="text-xs text-neon-green flex items-center gap-1">
                                                <Check size={14} /> Platform detected
                                            </span>
                                        </motion.div>
                                    )}

                                    {/* Step 2: Tool name */}
                                    {step >= 2 && (
                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                            <Input
                                                label="What's the AI tool name?"
                                                placeholder="e.g. ChatGPT, Midjourney, Runway..."
                                                value={toolName}
                                                onChange={(e) => setToolName(e.target.value)}
                                                className="bg-black/30"
                                            />
                                            <p className="text-[11px] text-text-muted mt-2 flex items-center gap-1">
                                                <Sparkles size={10} className="text-neon-yellow" />
                                                AI will auto-fill category, tags, and description
                                            </p>
                                        </motion.div>
                                    )}

                                    {/* Auto-fill preview */}
                                    {toolName.trim().length > 1 && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                            className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-2"
                                        >
                                            <p className="text-xs text-text-muted uppercase tracking-wider font-bold">AI will auto-fill:</p>
                                            <div className="flex flex-wrap gap-2">
                                                <span className="px-2.5 py-1 text-xs rounded-lg bg-neon-purple/10 text-neon-purple border border-neon-purple/20">
                                                    {guessCategory(toolName)}
                                                </span>
                                                {generateTags(toolName, guessCategory(toolName)).map(t => (
                                                    <span key={t} className="px-2.5 py-1 text-xs rounded-lg bg-white/5 text-text-secondary border border-white/10">
                                                        #{t}
                                                    </span>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Save */}
                                    <div className="pt-2 flex justify-end gap-3">
                                        <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                                        <Button
                                            onClick={handleLinkSave}
                                            disabled={!toolName.trim() || !url.trim() || saving}
                                            className="gap-2 shadow-glow-cyan"
                                        >
                                            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                            {saving ? 'Saving...' : 'Save to Stash'}
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* ===== CAPTURE TAB ===== */}
                            {tab === 'capture' && (
                                <div className="space-y-5">
                                    {/* Capture type toggle */}
                                    <div className="flex bg-black/30 rounded-xl p-1 gap-1">
                                        <button
                                            onClick={() => setCaptureType('text')}
                                            className={clsx(
                                                'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all',
                                                captureType === 'text'
                                                    ? 'bg-white/10 text-white'
                                                    : 'text-text-secondary hover:text-white'
                                            )}
                                        >
                                            <FileText size={16} /> Text / Note
                                        </button>
                                        <button
                                            onClick={() => setCaptureType('image')}
                                            className={clsx(
                                                'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all',
                                                captureType === 'image'
                                                    ? 'bg-white/10 text-white'
                                                    : 'text-text-secondary hover:text-white'
                                            )}
                                        >
                                            <Camera size={16} /> Screenshot / Image
                                        </button>
                                    </div>

                                    {/* Text capture */}
                                    {captureType === 'text' && (
                                        <div>
                                            <label className="block text-sm font-medium text-text-secondary mb-2">Your note or thought</label>
                                            <textarea
                                                value={captureText}
                                                onChange={(e) => setCaptureText(e.target.value)}
                                                placeholder="e.g. Found an AI that removes background from videos automatically..."
                                                rows={4}
                                                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-purple/50 transition-all placeholder:text-text-muted resize-none"
                                            />
                                        </div>
                                    )}

                                    {/* Image capture */}
                                    {captureType === 'image' && (
                                        <div>
                                            <label className="block text-sm font-medium text-text-secondary mb-2">Upload screenshot or image</label>
                                            <div
                                                onClick={() => fileInputRef.current?.click()}
                                                className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center cursor-pointer hover:border-neon-purple/30 hover:bg-neon-purple/5 transition-all group"
                                            >
                                                {captureFile ? (
                                                    <div className="space-y-2">
                                                        <div className="w-12 h-12 mx-auto rounded-xl bg-neon-green/10 flex items-center justify-center">
                                                            <Check size={24} className="text-neon-green" />
                                                        </div>
                                                        <p className="text-white font-medium text-sm">{captureFileName}</p>
                                                        <p className="text-text-muted text-xs">Click to change</p>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-2">
                                                        <div className="w-12 h-12 mx-auto rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-neon-purple/10 transition-colors">
                                                            <Camera size={24} className="text-text-muted group-hover:text-neon-purple transition-colors" />
                                                        </div>
                                                        <p className="text-text-secondary text-sm">Click to upload or drag & drop</p>
                                                        <p className="text-text-muted text-xs">PNG, JPG, WEBP (max 10MB)</p>
                                                    </div>
                                                )}
                                            </div>
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleFileSelect}
                                            />
                                        </div>
                                    )}

                                    {/* Optional tool name */}
                                    <Input
                                        label="AI Tool Name (optional)"
                                        placeholder="e.g. Runway, Claude..."
                                        value={captureToolName}
                                        onChange={(e) => setCaptureToolName(e.target.value)}
                                        className="bg-black/30"
                                    />
                                    <p className="text-[11px] text-text-muted -mt-3 flex items-center gap-1">
                                        <Sparkles size={10} className="text-neon-yellow" />
                                        Leave empty — AI will try to detect it later
                                    </p>

                                    {/* Save */}
                                    <div className="pt-2 flex justify-end gap-3">
                                        <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                                        <Button
                                            onClick={handleCaptureSave}
                                            disabled={saving || (captureType === 'text' && !captureText.trim()) || (captureType === 'image' && !captureFile)}
                                            className="gap-2 bg-neon-purple hover:bg-purple-600 shadow-glow-purple border-none"
                                        >
                                            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                            {saving ? 'Saving...' : 'Capture & Save'}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
