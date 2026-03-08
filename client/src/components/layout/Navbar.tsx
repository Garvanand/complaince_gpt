import { useLocation, useNavigate } from 'react-router-dom';
import { Search, PlayCircle, Plus } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import NotificationsDropdown from '../NotificationsDropdown';

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/dashboard':  { title: 'Dashboard',      subtitle: 'Overview of your compliance posture' },
  '/assessment': { title: 'Assessment',     subtitle: 'Upload documents and run AI analysis' },
  '/standards':  { title: 'Standards',      subtitle: 'ISO standards library and clause explorer' },
  '/agents':     { title: 'Agent Workflow', subtitle: 'Multi-agent orchestration visualization' },
  '/analytics':  { title: 'Analytics',      subtitle: 'Deep compliance analytics and trends' },
  '/reports':    { title: 'Reports',        subtitle: 'Assessment history and generated reports' },
  '/settings':   { title: 'Settings',       subtitle: 'Configuration and preferences' },
};

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDemoMode, loadDemoData } = useAppStore();
  const page = pageTitles[location.pathname] || { title: 'ComplianceGPT', subtitle: '' };

  const openSearch = () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
  };

  return (
    <header className="app-topbar">
      {/* Page title */}
      <div className="flex-1 min-w-0">
        <h1 className="text-white font-bold text-lg leading-tight truncate">
          {page.title}
        </h1>
        <p className="text-[#4A5568] text-xs truncate">{page.subtitle}</p>
      </div>

      {/* Search */}
      <button
        onClick={openSearch}
        className="hidden md:flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-[#8C9BAE] hover:border-white/[0.15] transition-colors text-sm min-w-[200px]"
      >
        <Search className="w-4 h-4" />
        <span>Search...</span>
        <kbd className="ml-auto bg-white/[0.08] text-[#4A5568] text-xs px-2 py-0.5 rounded font-mono">
          Ctrl K
        </kbd>
      </button>

      {/* Demo mode pill */}
      {isDemoMode && (
        <div className="flex items-center gap-2 bg-[#86BC25]/10 border border-[#86BC25]/25 rounded-full px-3 py-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#86BC25] animate-pulse" />
          <span className="text-[#86BC25] text-xs font-bold uppercase tracking-widest">
            Demo
          </span>
        </div>
      )}

      {/* Load Demo button */}
      {!isDemoMode && (
        <button
          onClick={loadDemoData}
          className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.18] text-[#8C9BAE] hover:text-white rounded-xl px-4 py-2.5 text-sm transition-all duration-150"
        >
          <PlayCircle className="w-4 h-4" />
          <span className="hidden sm:inline">Load Demo</span>
        </button>
      )}

      {/* Notifications */}
      <NotificationsDropdown />

      {/* Start Assessment CTA */}
      <button
        onClick={() => navigate('/assessment')}
        className="flex items-center gap-2 bg-[#86BC25] hover:bg-[#A8D048] text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all duration-150 shadow-[0_0_20px_rgba(134,188,37,0.25)] hover:shadow-[0_0_30px_rgba(134,188,37,0.4)]"
      >
        <Plus className="w-4 h-4" />
        <span className="hidden sm:inline">New Assessment</span>
      </button>
    </header>
  );
}
