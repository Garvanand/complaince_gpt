import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Plus, Bell } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import NotificationsDropdown from '../NotificationsDropdown';

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/dashboard':  { title: 'Dashboard',       subtitle: 'Compliance posture overview' },
  '/assessment': { title: 'New Assessment',  subtitle: 'Upload documents and run AI analysis' },
  '/standards':  { title: 'Standards',       subtitle: 'ISO standards library and clause explorer' },
  '/agents':     { title: 'Agent Workflow',  subtitle: 'Multi-agent orchestration pipeline' },
  '/analytics':  { title: 'Analytics',       subtitle: 'Compliance analytics and trend analysis' },
  '/reports':    { title: 'Reports',         subtitle: 'Assessment reports and findings' },
  '/settings':   { title: 'Settings',        subtitle: 'Configuration and preferences' },
};

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDemoMode, orgProfile, unreadCount } = useAppStore();
  const page = pageTitles[location.pathname] || { title: 'ComplianceGPT', subtitle: '' };

  const openSearch = () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
  };

  return (
    <header className="app-topbar">
      {/* Page title */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="page-title">{page.title}</div>
        <div className="page-subtitle">{page.subtitle}</div>
      </div>

      {/* Search */}
      <button
        onClick={openSearch}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '6px 14px',
          background: '#F2F2F2',
          border: '1px solid #E5E5E5',
          borderRadius: 999,
          color: '#767676',
          fontSize: 13,
          cursor: 'pointer',
          minWidth: 200,
          transition: 'border-color 120ms ease',
        }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = '#C4C4C4')}
        onMouseLeave={e => (e.currentTarget.style.borderColor = '#E5E5E5')}
      >
        <Search size={14} />
        <span>Search...</span>
        <kbd style={{
          marginLeft: 'auto',
          background: '#E0E0E0',
          color: '#767676',
          fontSize: 10,
          padding: '2px 6px',
          borderRadius: 3,
          fontFamily: 'var(--font-mono)',
          fontWeight: 500,
        }}>⌃K</kbd>
      </button>

      {/* Demo pill */}
      {isDemoMode && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '4px 10px',
          background: '#FFFBEB',
          border: '1px solid #FDE68A',
          borderRadius: 'var(--radius-md)',
          fontSize: 11,
          fontWeight: 600,
          color: '#92400E',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--risk-medium)', flexShrink: 0 }} />
          Demo Mode
        </div>
      )}

      {/* Org chip */}
      {orgProfile.companyName && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '4px 10px',
          background: '#E6F4FA',
          border: '1px solid #B3DFF0',
          borderRadius: 999,
          fontSize: 12,
          color: '#005A80',
          fontWeight: 500,
          maxWidth: 160,
        }}>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {orgProfile.companyName}
          </span>
        </div>
      )}

      {/* Notifications */}
      <NotificationsDropdown />

      {/* New Assessment */}
      <button
        onClick={() => navigate('/assessment')}
        className="btn btn-primary"
        style={{ gap: 6 }}
      >
        <Plus size={14} />
        <span>New Assessment</span>
      </button>
    </header>
  );
}
