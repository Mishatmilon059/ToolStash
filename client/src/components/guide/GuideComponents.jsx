import { motion } from 'framer-motion';
import { CheckCircle2, Circle, ArrowRight, BookOpen, ShieldCheck, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

// --- Checklist Item for Getting Started ---
export const ChecklistItem = ({ item, index, onToggle }) => (
    <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1 }}
        className={`flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer ${item.isCompleted
            ? 'bg-neon-green/5 border-neon-green/20'
            : 'bg-[#1e1e2d] border-white/5 hover:border-white/10'
            }`}
        onClick={onToggle}
    >
        <div className={`p-1 rounded-full ${item.isCompleted ? 'text-neon-green' : 'text-gray-500'}`}>
            {item.isCompleted ? <CheckCircle2 size={24} /> : <Circle size={24} />}
        </div>

        <div className="flex-1">
            <h4 className={`font-medium ${item.isCompleted ? 'text-white line-through opacity-50' : 'text-white'}`}>
                {item.text}
            </h4>
        </div>

        {item.action && !item.isCompleted && (
            <Link to={item.action} onClick={(e) => e.stopPropagation()} className="px-3 py-1.5 text-xs bg-white/5 hover:bg-white/10 text-white rounded-lg border border-white/10 transition-colors">
                Do it
            </Link>
        )}
    </motion.div>
);

// --- Micro Guide Card ---
export const GuideCard = ({ guide, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className="bg-[#1e1e2d] hover:bg-[#252536] border border-white/5 rounded-2xl p-6 cursor-pointer group transition-all"
    >
        <div className="flex justify-between items-start mb-4">
            <div className="text-4xl">{guide.icon}</div>
            <div className="bg-white/5 rounded-full p-2 group-hover:bg-neon-purple/20 group-hover:text-neon-purple transition-colors">
                <ArrowRight size={16} />
            </div>
        </div>

        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-neon-purple transition-colors">
            {guide.title}
        </h3>

        <div className="flex items-center gap-2 text-sm text-gray-500">
            <BookOpen size={14} />
            <span>{guide.steps} steps</span>
        </div>
    </motion.div>
);

// --- FAQ Item ---
export const FaqItem = ({ item }) => (
    <div className="border-b border-white/5 py-4 last:border-0">
        <h4 className="flex items-center gap-3 text-white font-medium mb-2">
            <HelpCircle size={16} className="text-neon-cyan" />
            {item.q}
        </h4>
        <p className="text-sm text-gray-400 pl-7 leading-relaxed">
            {item.a}
        </p>
    </div>
);
