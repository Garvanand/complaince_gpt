import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import ChatAssistant from '../dashboard/ChatAssistant';
import { useAppStore } from '../../store/useAppStore';

export default function AppLayout() {
  const { sidebarCollapsed } = useAppStore();

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
        <div className="flex-1 p-8">
          <Outlet />
        </div>
      </motion.main>
      <ChatAssistant />
    </div>
  );
}
