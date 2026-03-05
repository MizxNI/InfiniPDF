'use client';

import { useToolStore } from '@/store/useToolStore';
import { DashboardContainer } from '@/components/shared/DashboardContainer';

export default function Home() {
  const activeTool = useToolStore((state) => state.activeTool);
  const setActiveTool = useToolStore((state) => state.setActiveTool);

  return (
    <div className="min-h-screen bg-black text-zinc-100 selection:bg-zinc-800 selection:text-zinc-100">
      <main className="flex flex-col">
        {activeTool === null ? (
          <DashboardContainer />
        ) : (
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
            <div className="mb-8">
              <button
                onClick={() => setActiveTool(null)}
                className="px-4 py-2 text-sm font-medium text-zinc-300 bg-zinc-900 border border-zinc-800 rounded-md hover:bg-zinc-800 hover:text-zinc-100 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-400"
              >
                &larr; Back to Dashboard
              </button>
            </div>
            
            <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-zinc-800 rounded-xl bg-zinc-950/50 min-h-[50vh]">
              <h2 className="text-2xl font-semibold text-zinc-100 mb-2">
                Workspace Placeholder
              </h2>
              <p className="text-zinc-400">
                Active Tool: <span className="font-mono text-zinc-300 ml-2 px-2 py-1 bg-zinc-900 rounded-md">{activeTool}</span>
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
