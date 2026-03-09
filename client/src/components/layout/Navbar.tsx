import { useLocation, useNavigate } from 'react-router-dom';
import { Monitor, Moon, Plus, Search, Sparkles, Sun } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import type { ThemeMode } from '../../store/useAppStore';
import NotificationsDropdown from '../NotificationsDropdown';
import { pageMetaByPath } from '../../config/navigation';

function resolvePage(pathname: string) {
  if (pageMetaByPath[pathname]) return pageMetaByPath[pathname];
  const matched = Object.entries(pageMetaByPath).find(([path]) => pathname.startsWith(path + '/'));
  return matched?.[1] || { title: 'ComplianceGPT', subtitle: 'Enterprise compliance intelligence workspace' };
}

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDemoMode, orgProfile, currentAssessment, selectedStandards, themeMode, setThemeMode } = useAppStore();
  const page = resolvePage(location.pathname);

  const openSearch = () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
  };

  const activeStandardCount = currentAssessment?.standards.length || selectedStandards.length;
  const themeOrder: ThemeMode[] = ['light', 'dark', 'system'];
  const nextThemeMode = themeOrder[(themeOrder.indexOf(themeMode) + 1) % themeOrder.length];
  const themeMeta: Record<ThemeMode, { icon: typeof Sun; label: string }> = {
    light: { icon: Sun, label: 'Light' },
    dark: { icon: Moon, label: 'Dark' },
    system: { icon: Monitor, label: 'System' },
  };
  const ThemeIcon = themeMeta[themeMode].icon;

  return (
    <header className="app-topbar">
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="topbar-meta">
          <div className="section-label" style={{ marginBottom: 0 }}>Enterprise analytics platform</div>
          <div className="page-title">{page.title}</div>
          <div className="topbar-context">{page.subtitle}</div>
        </div>
      </div>

      <button
        onClick={openSearch}
        className="topbar-search"
      >
        <Search size={14} />
        <span>Search standards, gaps, policies...</span>
        <kbd className="topbar-search-kbd">Ctrl K</kbd>
      </button>

      {activeStandardCount > 0 && (
        <div className="topbar-chip topbar-chip-neutral">
          <Sparkles size={13} />
          <span>{activeStandardCount} standards in scope</span>
        </div>
      )}

      {/* Demo pill */}
      {isDemoMode && (
        <div className="topbar-chip topbar-chip-warn">
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--risk-medium)', flexShrink: 0 }} />
          Demo Mode
        </div>
      )}

      {/* Org chip */}
      {orgProfile.companyName && (
        <div className="topbar-chip topbar-chip-brand">
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {orgProfile.companyName}
          </span>
        </div>
      )}

      <button
        onClick={() => setThemeMode(nextThemeMode)}
        className="topbar-theme-switcher"
        title={`Theme: ${themeMeta[themeMode].label}. Click to switch to ${themeMeta[nextThemeMode].label}.`}
        aria-label={`Theme mode ${themeMeta[themeMode].label}. Click to switch to ${themeMeta[nextThemeMode].label}.`}
      >
        <ThemeIcon size={15} />
        <span>{themeMeta[themeMode].label}</span>
      </button>

      <NotificationsDropdown />

      <button
        onClick={() => navigate('/assessment')}
        className="btn btn-primary topbar-primary-action"
        style={{ gap: 6 }}
      >
        <Plus size={14} />
        <span>New Assessment</span>
      </button>
    </header>
  );
}
