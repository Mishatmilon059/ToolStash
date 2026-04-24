import { useGuide } from '../hooks/useGuide';
import { ChecklistItem, GuideCard, FaqItem } from '../components/guide/GuideComponents';
import { ShieldCheck, Sparkles } from 'lucide-react';

export default function Guide() {
    const { guideItems, toggleItem } = useGuide();

    return (
        <div className="pt-2 max-w-5xl mx-auto space-y-12">
            {/* Header */}
            <div className="text-center md:text-left">
                <p className="text-gray-400 text-sm mb-1 uppercase tracking-wider">Learning Companion</p>
                <h1 className="text-3xl font-bold text-white mb-2">Guide & Help</h1>
                <p className="text-text-secondary max-w-2xl">
                    Not documentation. Not tutorials spam. Just clear steps to help you stay focused and confident in your AI journey.
                </p>
            </div>

            {/* 1. Getting Started Path */}
            <section>
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-neon-green/10 rounded-lg text-neon-green">
                        <Sparkles size={20} />
                    </div>
                    <h2 className="text-xl font-bold text-white">Getting Started</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {guideItems.gettingStarted.map((item, i) => (
                        <ChecklistItem
                            key={item.id}
                            item={item}
                            index={i}
                            onToggle={() => toggleItem('gettingStarted', item.id, item.isCompleted)}
                        />
                    ))}
                </div>
            </section>

            {/* 2. How-To Micro Guides */}
            <section>
                <div className="flex items-center gap-3 mb-6">
                    <h2 className="text-xl font-bold text-white">Micro Guides</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {guideItems.howTo.map((guide, i) => (
                        <GuideCard key={guide.id} guide={guide} delay={i * 0.1} />
                    ))}
                </div>
            </section>

            {/* 3. FAQ & Safety */}
            <section className="bg-[#1e1e2d] rounded-2xl p-8 border border-white/5">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                        <ShieldCheck size={20} />
                    </div>
                    <h2 className="text-xl font-bold text-white">FAQ & Safety</h2>
                </div>

                <div className="space-y-2">
                    {guideItems.faq.map((item, i) => (
                        <FaqItem key={i} item={item} />
                    ))}
                </div>
            </section>
        </div>
    );
}
