import { ReactNode } from 'react';
import { Sidebar, DashboardTabType } from './Sidebar';
import { Header } from '../components/Header';

interface MainLayoutProps {
  children: ReactNode;
  activeTab: DashboardTabType;
  setActiveTab: (tab: DashboardTabType) => void;
}

export function MainLayout({ children, activeTab, setActiveTab }: MainLayoutProps) {
  return (
    <div className="flex h-screen w-full bg-slate-50 font-sans overflow-hidden text-slate-800">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <Header />
        <section className="p-8 space-y-6 overflow-y-auto flex-1">
          {children}
        </section>
      </main>
    </div>
  );
}
