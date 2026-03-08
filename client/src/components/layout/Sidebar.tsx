import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, ClipboardCheck, BookOpen, Workflow,
  BarChart3, FileText, Settings, ChevronLeft, ChevronRight, Shield,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

const navItems = [
  { path: '/dashboard',  label: 'Dashboard',       icon: LayoutDashboard },
  { path: '/assessment', label: 'Assessment',       icon: ClipboardCheck },
  { path: '/standards',  label: 'Standards',        icon: BookOpen },
  { path: '/agents',     label: 'Agent Workflow',   icon: Workflow },
  { path: '/analytics',  label: 'Analytics',        icon: BarChart3 },
  { path: '/reports',    label: 'Reports',          icon: FileText },
];

export default function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useAppStore();
  const location = useLocation();

  return (
    <aside className={`app-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
      {/* Logo */}
      <div
        style={{
          height: 'var(--topbar-height)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 14px',
          borderBottom: '1px solid var(--border)',
          flexShrink: 0,
          gap: 10,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 6,
            background: 'var(--blue-800)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Shield size={15} color="white" />
        </div>
        {!sidebarCollapsed && (
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--slate-900)', whiteSpace: 'nowrap' }}>
              ComplianceGPT
            </div>
            <div style={{ fontSize: 10, color: 'var(--slate-500)', whiteSpace: 'nowrap', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Risk Intelligence
            </div>
          </div>
        )}
      </div>

      {/* Nav section label */}
      {!sidebarCollapsed && (
        <div style={{ padding: '16px 14px 6px', fontSize: 10, fontWeight: 600, color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Navigation
        </div>
      )}

      {/* Nav items */}
      <nav style={{ flex: 1, padding: '6px 8px', display: 'flex', flexDirection: 'column', gap: 1, overflowY: 'auto' }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive ? 'active' : ''}`}
              title={sidebarCollapsed ? item.label : undefined}
              style={sidebarCollapsed ? { justifyContent: 'center', padding: '8px' } : undefined}
            >
              <item.icon
                size={16}
                style={{ flexShrink: 0, color: isActive ? 'var(--blue-700)' : 'var(--slate-500)' }}
              />
              {!sidebarCollapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom — Settings + Collapse */}
      <div style={{ borderTop: '1px solid var(--border)', padding: '8px', display: 'flex', flexDirection: 'column', gap: 1 }}>
        <NavLink
          to="/settings"
          className={`nav-item ${location.pathname === '/settings' ? 'active' : ''}`}
          title={sidebarCollapsed ? 'Settings' : undefined}
          style={sidebarCollapsed ? { justifyContent: 'center', padding: '8px' } : undefined}
        >
          <Settings size={16} style={{ flexShrink: 0, color: location.pathname === '/settings' ? 'var(--blue-700)' : 'var(--slate-500)' }} />
          {!sidebarCollapsed && <span>Settings</span>}
        </NavLink>

        <button
          onClick={toggleSidebar}
          className="nav-item"
          style={sidebarCollapsed ? { justifyContent: 'center', padding: '8px' } : undefined}
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed
            ? <ChevronRight size={15} style={{ color: 'var(--slate-400)' }} />
            : <>
                <ChevronLeft size={15} style={{ color: 'var(--slate-400)', flexShrink: 0 }} />
                <span style={{ color: 'var(--slate-500)', fontSize: 12 }}>Collapse</span>
              </>
          }
        </button>
      </div>
    </aside>
  );
}
