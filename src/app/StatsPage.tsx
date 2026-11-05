import { ProgressSection } from '../features/progress/ui/ProgressSection';
import { ExportSection } from '../features/export/ui/ExportSection';

/** Groups two independent features under one tab; the app shell is the only place allowed to combine them. */
export function StatsPage() {
  return (
    <>
      <h1>Stats</h1>
      <ProgressSection />
      <ExportSection />
    </>
  );
}
