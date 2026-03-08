import { useLocation } from 'react-router-dom';
import { Search, Sparkles, Command } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import NotificationsDropdown from '../NotificationsDropdown';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/assessment': 'Assessment',
  '/standards': 'Standards Library',
  '/agents': 'Agent Workflow',
  '/analytics': 'Analytics',
  '/reports': 'Reports',
  '/settings': 'Settings',
};

const pageDescriptions: Record<string, string> = {
  '/dashboard': 'Overview of your compliance posture',
  '/assessment': 'Run a new compliance assessment',
  '/standards': 'Browse ISO standards and clauses',
  '/agents': 'View AI agent orchestration pipeline',
  '/analytics': 'Trends, benchmarks, and simulation',
  '/reports': 'Generate and download reports',
  '/settings': 'Configure your workspace',
};

export default function Navbar() {
  const location = useLocation();
  const { isDemoMode, loadDemoData, toggleDemoMode } = useAppStore();
  const title = pageTitles[location.pathname] || 'ComplianceGPT';
  const desc = pageDescriptions[location.pathname] || '';

  const openSearch = () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
  };

  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between px-8 py-4"
      style={{
        background: 'rgba(10, 14, 26, 0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--glass-border)',
      }}
    >
      <div>
        <h1 className="text-xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>
          {title}
        </h1>
        {desc && (
          <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{desc}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Search trigger */}
        <button
          onClick={openSearch}
          className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all hover:border-[var(--color-accent-500)]"
          style={{ background: 'var(--color-primary-700)', border: '1px solid var(--glass-border)' }}
        >
          <Search size={16} style={{ color: 'var(--color-text-muted)' }} />
          <span className="text-sm hidden md:inline" style={{ color: 'var(--color-text-muted)' }}>Search...</span>
          <kbd
            className="text-[10px] font-mono px-1.5 py-0.5 rounded hidden md:inline-flex items-center gap-0.5 ml-2"
            style={{ background: 'var(--color-primary-600)', color: 'var(--color-text-muted)', border: '1px solid var(--glass-border)' }}
          >
            Ctrl K
          </kbd>
        </button>

        {/* Demo Mode Toggle */}
        <button
          onClick={isDemoMode ? toggleDemoMode : loadDemoData}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
          style={{
            background: isDemoMode
              ? 'linear-gradient(135deg, var(--color-accent-500), var(--color-accent-400))'
              : 'var(--color-primary-700)',
            color: isDemoMode ? 'var(--color-primary-900)' : 'var(--color-text-secondary)',
            border: isDemoMode ? 'none' : '1px solid var(--glass-border)',
          }}
        >
          <Sparkles size={16} />
          <span className="hidden sm:inline">{isDemoMode ? 'Demo Active' : 'Load Demo'}</span>
        </button>

        {/* Notifications */}
        <NotificationsDropdown />
      </div>
    </header>
  );
}
