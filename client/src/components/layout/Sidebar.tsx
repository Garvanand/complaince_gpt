import { NavLink } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { navigationSections } from '../../config/navigation';

export default function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useAppStore();

  return (
    <aside className={`app-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-brand">
        <div className="sidebar-brand-mark">CG</div>
        {!sidebarCollapsed && (
          <>
            <div className="sidebar-brand-title">ComplianceGPT</div>
            <div className="sidebar-brand-copy">Enterprise analytics workspace for ISO posture, control exposure, and remediation execution.</div>
          </>
        )}
      </div>

      <nav style={{ flex: 1, padding: '8px', display: 'flex', flexDirection: 'column', gap: 10, overflowY: 'auto' }}>
        {navigationSections.map((section) => (
          <div key={section.label}>
            {!sidebarCollapsed && <div className="sidebar-section-label">{section.label}</div>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {section.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                  title={sidebarCollapsed ? item.label : undefined}
                  style={sidebarCollapsed ? { justifyContent: 'center', padding: '10px 8px' } : undefined}
                >
                  {({ isActive }) => (
                    <>
                      <item.icon
                        size={16}
                        style={{ flexShrink: 0, color: isActive ? 'var(--teal-dark)' : 'var(--slate-500)' }}
                      />
                      {!sidebarCollapsed && (
                        <span style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                          <span>{item.label}</span>
                          <span className="nav-item-meta">{item.description}</span>
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div style={{ borderTop: '1px solid rgba(19, 35, 58, 0.08)', padding: '10px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {!sidebarCollapsed && (
          <div className="sidebar-footer-card">
            <div className="sidebar-footer-label">Guided workflow</div>
            <div className="sidebar-footer-copy">Run Assessment, review Dashboard, then finalize actions in Remediation Tracker.</div>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="nav-item"
          style={sidebarCollapsed ? { justifyContent: 'center', padding: '8px' } : undefined}
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed
            ? <ChevronRight size={15} style={{ color: 'var(--slate-500)' }} />
            : <>
                <ChevronLeft size={15} style={{ color: 'var(--slate-500)', flexShrink: 0 }} />
                <span style={{ color: 'var(--slate-500)', fontSize: 12 }}>Collapse navigation</span>
              </>
          }
        </button>
      </div>
    </aside>
  );
}
