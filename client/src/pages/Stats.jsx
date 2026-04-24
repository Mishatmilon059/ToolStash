import { useStats } from '../hooks/useStats';
import { useMockData } from '../hooks/useMockData';
import { motion } from 'framer-motion';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
    MetricCard, ActivityTable, CategoryDonut, MilestoneList, ICONS
} from '../components/dashboard/DashboardComponents';

export default function Stats() {
    const { stats, loading } = useStats();
    const { stats: mockStats } = useMockData();

    // Always use a valid stats object — never let it be null
    const s = stats || mockStats || {
        toolsSaved: 0,
        toolsTried: 0,
        usefulTools: 0,
        saveTryRatio: 0,
        learningProgress: [
            { day: 'Mon', saved: 0, tried: 0, useful: 0 },
            { day: 'Tue', saved: 0, tried: 0, useful: 0 },
            { day: 'Wed', saved: 0, tried: 0, useful: 0 },
        ],
        categoriesExplored: [
            { name: 'None', value: 1 },
        ],
        recentMilestones: [],
        recentToolsTried: [],
        recentAchievements: [],
    };

    if (loading) {
        return <div className="p-8 text-white">Loading stats...</div>;
    }

    return (
        <div className="pt-2 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-end mb-4">
                <div>
                    <p className="text-gray-400 text-sm mb-1 uppercase tracking-wider">Analytics</p>
                    <h1 className="text-3xl font-bold text-white">Learning Progress</h1>
                </div>
            </div>

            {/* 1. Widgets (Personal Growth) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    title="Tools Saved"
                    value={s.toolsSaved}
                    icon={ICONS.brain}
                    color="neon-purple"
                    delay={0.1}
                />
                <MetricCard
                    title="Tools Tried"
                    value={s.toolsTried}
                    icon={ICONS.flask}
                    color="neon-cyan"
                    delay={0.2}
                />
                <MetricCard
                    title="Useful Finds"
                    value={s.usefulTools}
                    icon={ICONS.star}
                    color="neon-green"
                    delay={0.3}
                />
                <MetricCard
                    title="Save/Try Ratio"
                    value={`${s.saveTryRatio}%`}
                    icon={ICONS.target}
                    color="neon-yellow"
                    delay={0.4}
                />
            </div>

            {/* 2. Main Graph + Donut + Timeline */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Main Graph: AI Learning Progress (6 cols) */}
                <div className="lg:col-span-6 bg-[#1e1e2d] rounded-2xl p-6 border border-white/5">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-lg font-bold text-white">AI Learning Progress</h3>
                    </div>

                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={s.learningProgress || []}>
                                <defs>
                                    <linearGradient id="gradSaved" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="gradTried" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#00f5ff" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#00f5ff" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#2b2b40" vertical={false} />
                                <XAxis dataKey="day" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#14141F', border: '1px solid #ffffff20', borderRadius: '12px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="saved" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#gradSaved)" name="Saved" />
                                <Area type="monotone" dataKey="tried" stroke="#00f5ff" strokeWidth={3} fillOpacity={1} fill="url(#gradTried)" name="Tried" />
                                <Area type="monotone" dataKey="useful" stroke="#22ff88" strokeWidth={3} fill="none" name="Useful" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Categories Donut (3 cols) */}
                <div className="lg:col-span-3">
                    <CategoryDonut data={s.categoriesExplored || []} title="AI Categories" />
                </div>

                {/* Achievement Timeline (3 cols) */}
                <div className="lg:col-span-3">
                    <MilestoneList milestones={s.recentMilestones || []} />
                </div>
            </div>

            {/* 3. Bottom Row: Activity Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Table 1: Recent Tools Tried */}
                <ActivityTable
                    title="Recent AI Tools Tried"
                    data={s.recentToolsTried || []}
                    columns={['Tool', 'Category', 'Outcome', 'Date']}
                    renderRow={(item, i) => (
                        <tr key={i} className="text-sm text-gray-300 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                            <td className="py-4 pl-2 font-medium text-white">{item.name}</td>
                            <td className="py-4 text-gray-400">{item.category}</td>
                            <td className="py-4">
                                <span className={`px-2 py-1 rounded text-xs ${item.outcome === 'Useful' ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-gray-400'}`}>
                                    {item.outcome}
                                </span>
                            </td>
                            <td className="py-4 text-gray-500">{item.date}</td>
                        </tr>
                    )}
                />

                {/* Table 2: Recent Achievements */}
                <ActivityTable
                    title="Recent Achievements"
                    data={s.recentAchievements || []}
                    columns={['Achievement', 'Type', 'Status', 'Date']}
                    renderRow={(item, i) => (
                        <tr key={i} className="text-sm text-gray-300 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                            <td className="py-4 pl-2 font-medium text-white flex items-center gap-2">
                                <span className="text-lg">🏆</span> {item.name}
                            </td>
                            <td className="py-4 text-gray-400">{item.category}</td>
                            <td className="py-4">
                                <span className="px-2 py-1 rounded text-xs bg-purple-500/20 text-purple-400">
                                    {item.outcome}
                                </span>
                            </td>
                            <td className="py-4 text-gray-500">{item.date}</td>
                        </tr>
                    )}
                />
            </div>
        </div>
    );
}
