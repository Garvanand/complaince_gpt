import { NavLink, useLocation } from 'react-router-dom';
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
  const { sidebarCollapsed, toggleSidebar, currentAssessment } = useAppStore();
  const location = useLocation();

  // Dynamic badges based on assessment data
  const getBadge = (path: string): string | null => {
    if (!currentAssessment) return null;
    if (path === '/analytics') {
      const gapCount = currentAssessment.gaps?.length ?? 0;
      return gapCount > 0 ? `${gapCount}` : null;
    }
    if (path === '/reports') {
      const stdCount = currentAssessment.standards?.length ?? 0;
      return stdCount > 0 ? `${stdCount}` : null;
    }
    return null;
  };

  // Breadcrumb text
  const breadcrumb = navItems.find((n) => n.path === location.pathname)?.label;

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

      {/* Breadcrumb */}
      {!sidebarCollapsed && breadcrumb && (
        <div className="px-5 pb-3">
          <p className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--color-text-muted)' }}>
            Navigation &rsaquo; <span style={{ color: 'var(--color-accent-400)' }}>{breadcrumb}</span>
          </p>
        </div>
      )}

      {/* Nav Items */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const badge = getBadge(item.path);
          return (
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
                  className="text-sm font-medium whitespace-nowrap flex-1"
                >
                  {item.label}
                </motion.span>
              )}
              {badge && (
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
                  style={{
                    background: 'rgba(0, 195, 137, 0.15)',
                    color: 'var(--color-accent-400)',
                    border: '1px solid rgba(0, 195, 137, 0.3)',
                  }}
                >
                  {badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Score indicator */}
      {!sidebarCollapsed && currentAssessment && (
        <div className="mx-3 mb-3 p-3 rounded-xl" style={{ background: 'rgba(0, 195, 137, 0.08)', border: '1px solid rgba(0, 195, 137, 0.15)' }}>
          <p className="text-[10px] uppercase tracking-wide mb-1" style={{ color: 'var(--color-text-muted)' }}>
            Overall Score
          </p>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold" style={{ color: 'var(--color-accent-400)' }}>
              {currentAssessment.overallScore}%
            </span>
            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--color-primary-700)' }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${currentAssessment.overallScore}%`,
                  background: 'linear-gradient(90deg, var(--color-accent-500), var(--color-accent-400))',
                }}
              />
            </div>
          </div>
        </div>
      )}

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
