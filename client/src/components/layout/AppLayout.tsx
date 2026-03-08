import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import ChatAssistant from '../dashboard/ChatAssistant';
import GlobalSearch from '../GlobalSearch';
import { useAppStore } from '../../store/useAppStore';

export default function AppLayout() {
  const { sidebarCollapsed, toggleSidebar } = useAppStore();

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    if (mq.matches && !sidebarCollapsed) toggleSidebar();
    const handler = (e: MediaQueryListEvent) => {
      if (e.matches && !sidebarCollapsed) toggleSidebar();
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-content">
        <Navbar />
        <main className="app-main">
          <div className="page-stack">
            <Outlet />
          </div>
        </main>
      </div>
      <ChatAssistant />
      <GlobalSearch />
    </div>
  );
}
