import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  { path: '/assessment', label: 'Assessment', icon: ClipboardCheck, badge: 'NEW' },
  { path: '/standards', label: 'Standards', icon: BookOpen },
  { path: '/agents', label: 'Agent Workflow', icon: Workflow },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/reports', label: 'Reports', icon: FileText },
];

export default function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useAppStore();
  const location = useLocation();

  return (
    <aside
      className={`app-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-white/[0.06] flex-shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-[#86BC25] flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(134,188,37,0.3)]">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden whitespace-nowrap"
              >
                <div className="text-white font-bold text-sm font-display">
                  ComplianceGPT™
                </div>
                <div className="text-[#4A5568] text-[10px] uppercase tracking-wider">
                  GenW.AI Platform
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path ||
            location.pathname.startsWith(item.path + '/');
          return (
            <NavLink key={item.path} to={item.path}>
              <div
                className={`relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-150 cursor-pointer group ${
                  isActive
                    ? 'bg-[#86BC25]/10 text-[#86BC25]'
                    : 'text-[#4A5568] hover:text-[#8C9BAE] hover:bg-white/[0.04]'
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-[#86BC25] rounded-r-full" />
                )}

                <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-[#86BC25]' : ''}`} />

                <AnimatePresence>
                  {!sidebarCollapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="text-sm font-medium whitespace-nowrap flex-1"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {item.badge && !sidebarCollapsed && (
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-[#86BC25] text-white rounded-full">
                    {item.badge}
                  </span>
                )}

                {sidebarCollapsed && (
                  <div className="absolute left-full ml-3 px-3 py-2 bg-[#1E2D5A] text-white text-sm rounded-xl whitespace-nowrap invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-150 z-50 border border-white/[0.08] pointer-events-none">
                    {item.label}
                  </div>
                )}
              </div>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom: Settings + Collapse */}
      <div className="border-t border-white/[0.06] p-2 space-y-1">
        <NavLink to="/settings">
          <div className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-150 cursor-pointer ${
            location.pathname === '/settings'
              ? 'bg-[#86BC25]/10 text-[#86BC25]'
              : 'text-[#4A5568] hover:text-[#8C9BAE] hover:bg-white/[0.04]'
          }`}>
            <Settings className="w-5 h-5 flex-shrink-0" />
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm font-medium"
                >
                  Settings
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </NavLink>

        <button
          onClick={toggleSidebar}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-[#4A5568] hover:text-[#8C9BAE] hover:bg-white/[0.04] transition-all duration-150"
        >
          {sidebarCollapsed
            ? <ChevronRight className="w-5 h-5" />
            : <ChevronLeft className="w-5 h-5" />
          }
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm font-medium"
              >
                Collapse
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </aside>
  );
}
