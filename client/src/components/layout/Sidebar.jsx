import { Link, useLocation } from 'react-router-dom';
import { Home, Package, Award, Settings, Plus, LogOut, Menu, Shield } from 'lucide-react';
import { clsx } from 'clsx';
import { Button } from '../ui/Button';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

export function Sidebar({ onOpenSaveTool }) {
    const location = useLocation();
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const { user, logout } = useAuth();

    // Default fallback if user is loading or null
    const displayUser = user ? {
        name: user.user_metadata?.display_name || user.email?.split('@')[0] || 'User',
        avatar: user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${user.email || 'User'}&background=00F0FF&color=fff`
    } : { name: 'Guest', avatar: 'https://ui-avatars.com/api/?name=Guest&background=333&color=fff' };

    const navItems = [
        { icon: Home, label: 'Home', path: '/' },
        { icon: Package, label: 'My Media', path: '/media' },
        { icon: Award, label: 'Achievements', path: '/achievements' },
        { icon: Settings, label: 'Guide', path: '/guide' },
        { icon: Shield, label: 'Admin', path: '/admin' },
    ];

    const isActive = (path) => {
        if (path === '/' && location.pathname !== '/') return false;
        return location.pathname.startsWith(path);
    };

    const NavLink = ({ item, isMobile = false }) => (
        <Link
            to={item.path}
            onClick={() => isMobile && setIsMobileOpen(false)}
            className={clsx(
                'flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden',
                isActive(item.path)
                    ? 'bg-gradient-to-r from-neon-cyan/10 to-transparent border-l-2 border-neon-cyan'
                    : 'hover:bg-white/5 text-text-muted hover:text-white'
            )}
        >
            {/* Active Glow Background */}
            {isActive(item.path) && (
                <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 bg-neon-cyan/5 blur-md"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
            )}

            <item.icon
                size={22}
                className={clsx(
                    'transition-all duration-300 relative z-10',
                    isActive(item.path)
                        ? 'text-neon-cyan drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]'
                        : 'group-hover:text-white group-hover:scale-110'
                )}
            />
            <span className={clsx("font-medium tracking-wide relative z-10", isActive(item.path) ? "text-white" : "")}>
                {item.label}
            </span>
        </Link>
    );

    return (
        <>
            {/* Mobile Trigger */}
            <div className="md:hidden fixed top-4 left-4 z-50">
                <button
                    onClick={() => setIsMobileOpen(true)}
                    className="p-2 bg-bg-card/80 backdrop-blur-md rounded-lg border border-white/10 text-white shadow-lg"
                >
                    <Menu size={24} />
                </button>
            </div>

            {/* Desktop Sidebar (Glass Panel) */}
            <aside className="fixed left-4 top-4 bottom-4 w-72 bg-[#0A0A0F]/90 backdrop-blur-xl border border-white/5 rounded-3xl flex flex-col z-40 hidden md:flex shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
                {/* Glow Effect Background */}
                <div className="absolute top-0 left-0 w-full h-32 bg-neon-cyan/5 blur-[100px] pointer-events-none" />

                <div className="p-8 pb-4">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-cyan to-blue-600 flex items-center justify-center shadow-glow-cyan group-hover:scale-105 transition-transform duration-300">
                            <span className="text-white text-xl font-bold">T</span>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white tracking-tight">ToolStash</h1>
                            <p className="text-[10px] text-text-secondary uppercase tracking-[0.2em]">Beta v1.0</p>
                        </div>
                    </Link>
                </div>

                <div className="px-6 mb-8 mt-2">
                    <Button
                        className="w-full gap-3 py-6 shadow-[0_0_30px_rgba(0,240,255,0.15)] bg-gradient-to-r from-neon-cyan to-blue-500 hover:scale-[1.02] active:scale-95 transition-all duration-300 border-none group relative overflow-hidden"
                        size="md"
                        onClick={onOpenSaveTool}
                    >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        <Plus size={20} className="text-bg-dark relative z-10" strokeWidth={3} />
                        <span className="text-bg-dark font-bold text-sm uppercase tracking-wider relative z-10">New Save</span>
                    </Button>
                </div>

                <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
                    {navItems.map((item) => (
                        <NavLink key={item.path} item={item} />
                    ))}
                </nav>

                {/* User Profile Section */}
                <div className="p-4 mt-auto mx-4 mb-4">
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3 hover:bg-white/10 transition-colors cursor-pointer group">
                        <img src={displayUser.avatar} alt="User" className="w-10 h-10 rounded-full border-2 border-neon-purple shadow-glow-purple" />
                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-white truncate">{displayUser.name}</h4>
                            <p className="text-xs text-text-secondary">Free Plan</p>
                        </div>
                        <button onClick={logout} className="text-text-muted hover:text-white transition-colors" title="Log out">
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isMobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileOpen(false)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
                        />
                        <motion.div
                            initial={{ x: -100 + '%' }}
                            animate={{ x: 0 }}
                            exit={{ x: -100 + '%' }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed left-0 top-0 bottom-0 w-80 bg-bg-card z-50 md:hidden border-r border-white/10 p-4"
                        >
                            {/* Mobile Content */}
                            <div className="flex justify-between items-center mb-8 p-4">
                                <h1 className="text-2xl font-bold text-white">ToolStash</h1>
                                <button onClick={() => setIsMobileOpen(false)} className="p-2 bg-white/5 rounded-full"><Plus className="rotate-45 text-white" /></button>
                            </div>
                            <div className="space-y-2 px-2">
                                {navItems.map((item) => (
                                    <NavLink key={item.path} item={item} isMobile />
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
