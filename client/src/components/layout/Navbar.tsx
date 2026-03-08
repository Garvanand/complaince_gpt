import { useLocation } from 'react-router-dom';
import { Bell, Search, Sparkles } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/assessment': 'Assessment',
  '/standards': 'Standards Library',
  '/agents': 'Agent Workflow',
  '/analytics': 'Analytics',
  '/reports': 'Reports',
  '/settings': 'Settings',
};

export default function Navbar() {
  const location = useLocation();
  const { isDemoMode, loadDemoData, toggleDemoMode } = useAppStore();
  const title = pageTitles[location.pathname] || 'ComplianceGPT';

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
      </div>

      <div className="flex items-center gap-4">
        {/* Search bar */}
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-xl"
          style={{ background: 'var(--color-primary-700)', border: '1px solid var(--glass-border)' }}
        >
          <Search size={16} style={{ color: 'var(--color-text-muted)' }} />
          <input
            type="text"
            placeholder="Search clauses, gaps..."
            className="bg-transparent border-none outline-none text-sm w-48"
            style={{ color: 'var(--color-text-primary)' }}
          />
        </div>

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
          {isDemoMode ? 'Demo Active' : 'Load Demo'}
        </button>

        {/* Notifications */}
        <button
          className="relative p-2.5 rounded-xl transition-all"
          style={{ background: 'var(--color-primary-700)', border: '1px solid var(--glass-border)' }}
        >
          <Bell size={18} style={{ color: 'var(--color-text-secondary)' }} />
          <span
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center"
            style={{ background: 'var(--color-risk-critical)', color: 'white' }}
          >
            3
          </span>
        </button>
      </div>
    </header>
  );
}
