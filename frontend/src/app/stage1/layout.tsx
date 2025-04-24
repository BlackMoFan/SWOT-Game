import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

export const metadata = {
  title: 'Stage 1 - Analytics & Due Diligence',
};

export default function StageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <TopBar />

        {/* Page Content */}
        <div className="flex-1 p-6 bg-gray-100">{children}</div>
      </div>
    </div>
  );
}