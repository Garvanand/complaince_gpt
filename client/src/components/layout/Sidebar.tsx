import { NavLink, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { navigationSections } from '../../config/navigation';

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
        <div className="sidebar-briefing">
          <div className="sidebar-briefing-label">Enterprise workspace</div>
          <div className="sidebar-briefing-title">Compliance command center</div>
          <div className="sidebar-briefing-copy">Assess posture, trace standards, and operationalize remediation from one governed workspace.</div>
        </div>
      )}

      {/* Nav items */}
      <nav style={{ flex: 1, padding: '8px', display: 'flex', flexDirection: 'column', gap: 10, overflowY: 'auto' }}>
        {navigationSections.map((section) => (
          <div key={section.label}>
            {!sidebarCollapsed && <div className="sidebar-section-label">{section.label}</div>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {section.items.map((item) => {
                const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={`nav-item ${isActive ? 'active' : ''}`}
                    title={sidebarCollapsed ? item.label : undefined}
                    style={sidebarCollapsed ? { justifyContent: 'center', padding: '10px 8px' } : undefined}
                  >
                    <item.icon
                      size={16}
                      style={{ flexShrink: 0, color: isActive ? '#86BC25' : 'rgba(255,255,255,0.6)' }}
                    />
                    {!sidebarCollapsed && (
                      <span style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                        <span>{item.label}</span>
                        <span className="nav-item-meta">{item.description}</span>
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom — Settings + Collapse */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', padding: '8px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {!sidebarCollapsed && (
          <div className="sidebar-footer-card">
            <div className="sidebar-footer-label">Governance note</div>
            <div className="sidebar-footer-copy">Use Risk Intelligence for benchmark context before finalizing remediation priorities.</div>
          </div>
        )}
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
