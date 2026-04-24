import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { SaveToolModal } from '../tools/SaveToolModal';
import { useTools } from '../../hooks/useTools';
import { useMedia } from '../../hooks/useMedia';

export function AppLayout() {
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const { addTool } = useTools();
    const { addMedia } = useMedia();

    return (
        <div className="min-h-screen bg-[#050508] text-text-primary bg-[url('/noise.png')]">
            {/* Background Ambience */}
            <div className="fixed top-[-20%] right-[-10%] w-[800px] h-[800px] bg-neon-purple/10 blur-[150px] rounded-full pointer-events-none" />
            <div className="fixed bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-neon-cyan/5 blur-[150px] rounded-full pointer-events-none" />

            <Sidebar onOpenSaveTool={() => setIsSaveModalOpen(true)} />

            <main className="md:ml-[320px] min-h-screen p-6 md:p-8 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>

            <SaveToolModal
                isOpen={isSaveModalOpen}
                onClose={() => setIsSaveModalOpen(false)}
                onSaveTool={addTool}
                onSaveMedia={addMedia}
            />
        </div>
    );
}
