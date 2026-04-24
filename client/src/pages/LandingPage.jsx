import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Link2, Brain, Camera, Sparkles, Zap, Shield, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/Button';

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: (i = 0) => ({
        opacity: 1, y: 0,
        transition: { delay: i * 0.15, duration: 0.6, ease: 'easeOut' }
    })
};

const FEATURES = [
    {
        icon: Link2,
        color: 'neon-cyan',
        title: 'Smart Link Paste',
        desc: 'Paste any link — Instagram reel, YouTube video, tweet — and we auto-detect the platform. You just name the AI tool.',
    },
    {
        icon: Brain,
        color: 'neon-purple',
        title: 'AI Assistant',
        desc: 'A built-in assistant that auto-categorizes, auto-tags, links media to tools, and keeps your library perfectly organized.',
    },
    {
        icon: Camera,
        color: 'neon-green',
        title: 'Quick Capture',
        desc: 'Drop a screenshot, paste text, or upload an image. No forms, no mandatory fields — the AI fills in the blanks.',
    },
];

const STEPS = [
    { num: '01', title: 'Paste or Drop', desc: 'Paste a link, upload a screenshot, or jot a quick note about an AI tool you found.' },
    { num: '02', title: 'Name It', desc: 'Just tell us the tool name. That\'s the only thing you need to type.' },
    { num: '03', title: 'AI Organizes', desc: 'Our assistant auto-fills category, tags, description, and links everything together.' },
    { num: '04', title: 'Track & Grow', desc: 'Watch your AI knowledge library grow with stats, achievements, and milestones.' },
];

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-[#050508] text-white overflow-hidden">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-30%] left-[-15%] w-[900px] h-[900px] bg-neon-purple/15 blur-[200px] rounded-full" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[700px] h-[700px] bg-neon-cyan/10 blur-[180px] rounded-full" />
                <div className="absolute top-[40%] left-[50%] w-[500px] h-[500px] bg-neon-green/5 blur-[150px] rounded-full" />
            </div>

            {/* Navbar */}
            <nav className="relative z-20 flex items-center justify-between px-6 md:px-16 py-6 max-w-7xl mx-auto">
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-cyan to-blue-600 flex items-center justify-center shadow-glow-cyan group-hover:scale-105 transition-transform">
                        <span className="text-white text-xl font-bold">T</span>
                    </div>
                    <span className="text-2xl font-bold tracking-tight">ToolStash</span>
                </Link>
                <div className="flex items-center gap-4">
                    <Link to="/">
                        <Button className="gap-2 px-6 bg-gradient-to-r from-neon-cyan to-blue-500 border-none hover:shadow-glow-cyan hover:scale-105 transition-all">
                            Launch App <ArrowRight size={16} />
                        </Button>
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative z-10 max-w-5xl mx-auto px-6 pt-16 md:pt-28 pb-20 text-center">
                <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-text-secondary mb-8 backdrop-blur-sm"
                >
                    <Sparkles size={14} className="text-neon-yellow" />
                    Your AI discovery journey starts here
                </motion.div>

                <motion.h1 variants={fadeUp} initial="hidden" animate="show" custom={1}
                    className="text-5xl md:text-7xl font-bold leading-tight mb-6 tracking-tight"
                >
                    Remember Every
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-blue-400 to-neon-purple">
                        AI Tool
                    </span>{' '}
                    You Find
                </motion.h1>

                <motion.p variants={fadeUp} initial="hidden" animate="show" custom={2}
                    className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed"
                >
                    Paste a link, drop a screenshot, or type a name — and let the built-in AI assistant
                    organize everything for you. Zero friction. Zero forms. Just save and go.
                </motion.p>

                <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Link to="/">
                        <Button className="text-lg px-8 py-4 bg-gradient-to-r from-neon-cyan to-blue-500 border-none hover:shadow-glow-cyan hover:scale-105 transition-all gap-3 font-bold">
                            Open ToolStash <ArrowRight size={20} />
                        </Button>
                    </Link>
                </motion.div>

                {/* Floating Preview Mockup */}
                <motion.div variants={fadeUp} initial="hidden" animate="show" custom={4}
                    className="mt-20 relative"
                >
                    <div className="relative mx-auto max-w-4xl rounded-2xl bg-[#14141F]/80 border border-white/10 backdrop-blur-xl shadow-[0_0_80px_-20px_rgba(0,240,255,0.15)] overflow-hidden">
                        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/5">
                            <div className="w-3 h-3 rounded-full bg-red-500/80" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                            <div className="w-3 h-3 rounded-full bg-green-500/80" />
                            <span className="ml-3 text-xs text-text-muted font-mono">toolstash.app</span>
                        </div>
                        <div className="p-6 md:p-10">
                            {/* Simulated paste input */}
                            <div className="mb-6 flex items-center gap-3 bg-black/40 rounded-xl border border-white/10 px-5 py-4">
                                <Link2 size={20} className="text-neon-cyan" />
                                <span className="text-text-muted flex-1">Paste any link here...</span>
                                <span className="px-3 py-1 text-xs font-bold bg-neon-cyan/10 text-neon-cyan rounded-lg border border-neon-cyan/30">⌘V</span>
                            </div>
                            {/* Simulated tool cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[
                                    { name: 'ChatGPT', cat: 'Chatbot', status: 'useful', color: 'neon-green' },
                                    { name: 'Midjourney', cat: 'Image', status: 'new', color: 'neon-cyan' },
                                    { name: 'Runway Gen-3', cat: 'Video', status: 'tried', color: 'neon-purple' },
                                ].map((t, i) => (
                                    <motion.div key={t.name}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 1.2 + i * 0.2 }}
                                        className="bg-white/5 border border-white/5 rounded-xl p-4 hover:border-white/15 transition-colors"
                                    >
                                        <div className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border w-fit mb-3 text-${t.color} border-${t.color}/40 bg-${t.color}/10`}>
                                            {t.status}
                                        </div>
                                        <h4 className="text-white font-bold mb-1">{t.name}</h4>
                                        <p className="text-xs text-text-muted font-mono">{t.cat}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                    {/* Gradient glow under mockup */}
                    <div className="absolute -bottom-10 left-1/4 right-1/4 h-20 bg-neon-cyan/20 blur-[60px] rounded-full" />
                </motion.div>
            </section>

            {/* Features Section */}
            <section className="relative z-10 max-w-6xl mx-auto px-6 py-24">
                <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <p className="text-neon-cyan text-sm font-bold uppercase tracking-widest mb-3">Why ToolStash?</p>
                    <h2 className="text-4xl md:text-5xl font-bold">
                        Built for{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple">Zero Friction</span>
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {FEATURES.map((f, i) => (
                        <motion.div key={f.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.15 }}
                            className="group relative bg-[#14141F]/60 backdrop-blur-md border border-white/5 rounded-2xl p-8 hover:border-white/15 transition-all hover:-translate-y-1"
                        >
                            <div className={`absolute top-0 right-0 w-32 h-32 bg-${f.color}/5 blur-[60px] rounded-full pointer-events-none group-hover:bg-${f.color}/10 transition-colors`} />
                            <div className={`w-14 h-14 rounded-xl bg-${f.color}/10 border border-${f.color}/20 flex items-center justify-center mb-6`}>
                                <f.icon size={24} className={`text-${f.color}`} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
                            <p className="text-text-secondary leading-relaxed">{f.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* How It Works */}
            <section className="relative z-10 max-w-5xl mx-auto px-6 py-24">
                <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <p className="text-neon-green text-sm font-bold uppercase tracking-widest mb-3">Simple as 1-2-3-4</p>
                    <h2 className="text-4xl md:text-5xl font-bold">How It Works</h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {STEPS.map((s, i) => (
                        <motion.div key={s.num}
                            initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="flex gap-6 items-start p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-colors"
                        >
                            <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-neon-cyan to-neon-purple">{s.num}</span>
                            <div>
                                <h4 className="text-lg font-bold text-white mb-1">{s.title}</h4>
                                <p className="text-text-secondary text-sm leading-relaxed">{s.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Final CTA */}
            <section className="relative z-10 max-w-4xl mx-auto px-6 py-24 text-center">
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    className="relative bg-gradient-to-br from-[#14141F] to-[#0A0A1A] rounded-3xl p-12 md:p-16 border border-white/10 overflow-hidden"
                >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-40 bg-neon-cyan/10 blur-[100px] rounded-full" />

                    <div className="relative z-10">
                        <div className="flex items-center justify-center gap-2 mb-6">
                            <Zap size={20} className="text-neon-yellow" />
                            <span className="text-sm text-neon-yellow font-bold uppercase tracking-wider">Start in 30 seconds</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">
                            Ready to Organize Your AI World?
                        </h2>
                        <p className="text-text-secondary text-lg max-w-xl mx-auto mb-10">
                            Stop losing AI tools in bookmarks and screenshots. Start building your personal AI knowledge base — for free.
                        </p>
                        <Link to="/">
                            <Button className="text-lg px-10 py-4 bg-gradient-to-r from-neon-cyan to-blue-500 border-none shadow-glow-cyan hover:scale-105 transition-all gap-3 font-bold">
                                Open Your Stash <ChevronRight size={20} />
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 border-t border-white/5 py-8 text-center text-text-muted text-sm">
                <p>© 2026 ToolStash. Built with ❤️ for AI explorers.</p>
            </footer>
        </div>
    );
}
