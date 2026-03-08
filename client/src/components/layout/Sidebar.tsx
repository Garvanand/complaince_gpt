import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  ClipboardCheck,
  BookOpen,
  Workflow,
  BarChart3,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/assessment', label: 'Assessment', icon: ClipboardCheck },
  { path: '/standards', label: 'Standards', icon: BookOpen },
  { path: '/agents', label: 'Agent Workflow', icon: Workflow },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/reports', label: 'Reports', icon: FileText },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useAppStore();

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarCollapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed left-0 top-0 h-screen z-40 flex flex-col"
      style={{ background: 'var(--color-primary-800)', borderRight: '1px solid var(--glass-border)' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6 min-h-[80px]">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, var(--color-accent-500), var(--color-accent-400))' }}>
          <Shield size={20} className="text-[var(--color-primary-900)]" />
        </div>
        {!sidebarCollapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="font-display text-lg font-bold whitespace-nowrap"
            style={{ color: 'var(--color-text-primary)' }}
          >
            ComplianceGPT
          </motion.span>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'text-[var(--color-accent-400)]'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`
            }
            style={({ isActive }) =>
              isActive
                ? { background: 'rgba(0, 195, 137, 0.1)', boxShadow: 'inset 0 0 20px rgba(0, 195, 137, 0.05)' }
                : {}
            }
          >
            <item.icon size={20} className="flex-shrink-0" />
            {!sidebarCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm font-medium whitespace-nowrap"
              >
                {item.label}
              </motion.span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Collapse button */}
      <button
        onClick={toggleSidebar}
        className="mx-3 mb-4 p-2.5 rounded-xl transition-all duration-200 flex items-center justify-center"
        style={{ color: 'var(--color-text-muted)', border: '1px solid var(--glass-border)' }}
      >
        {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>
    </motion.aside>
  );
}
