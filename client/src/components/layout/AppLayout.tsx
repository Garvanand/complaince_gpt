import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import ChatAssistant from '../dashboard/ChatAssistant';
import GlobalSearch from '../GlobalSearch';
import { useAppStore } from '../../store/useAppStore';

export default function AppLayout() {
  const { sidebarCollapsed, toggleSidebar } = useAppStore();

  // Auto-collapse sidebar on small screens
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
    <div className="flex min-h-screen" style={{ background: 'var(--color-primary-900)' }}>
      <Sidebar />
      <motion.main
        initial={false}
        animate={{ marginLeft: sidebarCollapsed ? 72 : 260 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="flex-1 flex flex-col min-h-screen"
      >
        <Navbar />
        <div className="flex-1 p-4 md:p-8">
          <Outlet />
        </div>
      </motion.main>
      <ChatAssistant />
      <GlobalSearch />
    </div>
  );
}
