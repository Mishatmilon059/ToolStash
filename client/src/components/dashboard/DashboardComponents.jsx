import { motion } from 'framer-motion';
import { MoreVertical, Star, Brain, FlaskConical, Target, Rocket, Zap, Trophy } from 'lucide-react';
import {
    PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer,
    AreaChart, Area, XAxis, YAxis, CartesianGrid
} from 'recharts';

export const ICONS = {
    brain: Brain,
    flask: FlaskConical,
    star: Star,
    target: Target,
    rocket: Rocket,
    zap: Zap,
    trophy: Trophy
};

// --- Reusable Metric Card ---
export const MetricCard = ({ title, value, icon: Icon, color, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className="bg-[#1e1e2d] rounded-2xl p-6 relative overflow-hidden group border border-white/5 hover:border-white/10 transition-colors"
    >
        {/* Glow Effect */}
        <div className={`absolute top-0 right-0 p-16 bg-${color}/5 rounded-full blur-[40px] pointer-events-none group-hover:bg-${color}/10 transition-colors`} />

        <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
                <h4 className="text-gray-400 text-sm font-medium mb-1">{title}</h4>
                <h2 className="text-3xl font-bold text-white">{value}</h2>
            </div>
            <div className={`p-3 rounded-xl bg-opacity-20 bg-${color} text-${color}`}>
                <Icon size={24} color={`var(--color-${color})`} />
            </div>
        </div>

        {/* Simple Sparkline */}
        <div className="h-10 w-full mt-2 relative opacity-50">
            <svg viewBox="0 0 100 20" className="w-full h-full" preserveAspectRatio="none">
                <path d="M0 15 Q 10 5, 20 12 T 40 8 T 60 15 T 80 5 T 100 12" fill="none" stroke={color === 'neon-purple' ? '#B200FF' : '#00F0FF'} strokeWidth="2" />
            </svg>
        </div>
    </motion.div>
);

// --- Activity Table (Generic) ---
export const ActivityTable = ({ data, title, columns, renderRow }) => (
    <div className="bg-[#1e1e2d] rounded-2xl p-6 border border-white/5 h-full">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white">{title}</h3>
            <button className="text-xs px-3 py-1 bg-[#2b2b40] rounded-lg text-white hover:bg-[#32324a]">View All</button>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="text-gray-400 text-xs uppercase border-b border-white/5">
                        {columns.map((col, i) => (
                            <th key={i} className={`pb-3 ${i === 0 ? 'pl-2' : ''}`}>{col}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, i) => renderRow(item, i))}
                </tbody>
            </table>
        </div>
    </div>
);

// --- Donut Chart ---
export const CategoryDonut = ({ data, title }) => {
    const COLORS = ['#8b5cf6', '#00f5ff', '#22ff88', '#f59e0b', '#ef4444'];

    return (
        <div className="bg-[#1e1e2d] rounded-2xl p-6 border border-white/5 h-full flex flex-col">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold text-white">{title}</h3>
                <MoreVertical size={16} className="text-gray-500" />
            </div>

            <div className="flex-1 flex flex-col items-center justify-center min-h-[220px]">
                <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                        <Pie
                            data={data}
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <RechartsTooltip
                            contentStyle={{ backgroundColor: '#1e1e2d', border: '1px solid #ffffff10', borderRadius: '12px' }}
                            itemStyle={{ color: '#fff' }}
                        />
                    </PieChart>
                </ResponsiveContainer>
                {/* Center Text */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none mt-10">
                    <div className="text-center">
                        <span className="text-2xl font-bold text-white block">{data.length}</span>
                        <span className="text-xs text-gray-400 uppercase">Categories</span>
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="space-y-3 mt-4">
                {data.slice(0, 3).map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                            <span className="text-gray-400">{item.name}</span>
                        </div>
                        <span className="text-white font-medium">{item.percentage}%</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

// --- Milestone List (Replacing Map) ---
export const MilestoneList = ({ milestones }) => (
    <div className="bg-[#1e1e2d] rounded-2xl p-6 border border-white/5 h-full">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white">Recent Milestones</h3>
        </div>

        <div className="relative border-l border-white/10 ml-3 space-y-8 py-2">
            {milestones.map((m, i) => (
                <div key={i} className="relative pl-8">
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#1e1e2d] border border-neon-purple flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-neon-purple animate-pulse" />
                    </div>
                    <div className="flex justify-between items-start">
                        <div>
                            <h4 className="text-white font-bold">{m.title}</h4>
                            <span className="text-xs text-gray-500">{m.date}</span>
                        </div>
                        <span className="text-xl">{m.icon}</span>
                    </div>
                </div>
            ))}
        </div>
    </div>
);
