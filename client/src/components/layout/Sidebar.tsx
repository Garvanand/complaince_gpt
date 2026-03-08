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
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          flexShrink: 0,
          gap: 10,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: '#86BC25',
            flexShrink: 0,
          }}
        />
        {!sidebarCollapsed && (
          <div style={{ overflow: 'hidden' }}>
            <div style={{
              fontFamily: "'Libre Baskerville', Georgia, serif",
              fontSize: 14, fontWeight: 700, color: '#FFFFFF', whiteSpace: 'nowrap',
            }}>
              ComplianceGPT
            </div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Risk Intelligence
            </div>
          </div>
        )}
      </div>

      {/* Nav section label */}
      {!sidebarCollapsed && (
        <div style={{ padding: '16px 14px 6px', fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
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
                style={{ flexShrink: 0, color: isActive ? '#0076A8' : 'rgba(255,255,255,0.5)' }}
              />
              {!sidebarCollapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom — Settings + Collapse */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', padding: '8px', display: 'flex', flexDirection: 'column', gap: 1 }}>
        <NavLink
          to="/settings"
          className={`nav-item ${location.pathname === '/settings' ? 'active' : ''}`}
          title={sidebarCollapsed ? 'Settings' : undefined}
          style={sidebarCollapsed ? { justifyContent: 'center', padding: '8px' } : undefined}
        >
          <Settings size={16} style={{ flexShrink: 0, color: location.pathname === '/settings' ? '#0076A8' : 'rgba(255,255,255,0.5)' }} />
          {!sidebarCollapsed && <span>Settings</span>}
        </NavLink>

        <button
          onClick={toggleSidebar}
          className="nav-item"
          style={sidebarCollapsed ? { justifyContent: 'center', padding: '8px' } : undefined}
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed
            ? <ChevronRight size={15} style={{ color: 'rgba(255,255,255,0.4)' }} />
            : <>
                <ChevronLeft size={15} style={{ color: 'rgba(255,255,255,0.4)', flexShrink: 0 }} />
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>Collapse</span>
              </>
          }
        </button>
      </div>
    </aside>
  );
}
