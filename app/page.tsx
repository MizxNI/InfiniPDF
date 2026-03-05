'use client';

import { useToolStore } from '@/store/useToolStore';
import { DashboardContainer } from '@/components/shared/DashboardContainer';
import { ToolWorkspaceView } from '@/components/shared/ToolWorkspaceView';

export default function Home() {
  const activeTool = useToolStore((state) => state.activeTool);

  return (
    <div className="min-h-screen bg-black text-zinc-100 selection:bg-zinc-800 selection:text-zinc-100">
      <main className="flex flex-col">
        {activeTool === null ? (
          <DashboardContainer />
        ) : (
          <ToolWorkspaceView />
        )}
      </main>
    </div>
  );
}
