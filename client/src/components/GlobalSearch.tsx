import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, FileText, AlertTriangle, BookOpen, ArrowRight, Command } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js';
import { useAppStore } from '../store/useAppStore';

interface SearchItem {
  id: string;
  type: 'clause' | 'gap' | 'standard' | 'remediation' | 'page';
  title: string;
  description: string;
  path: string;
  meta?: string;
}

const staticPages: SearchItem[] = [
  { id: 'p-dash', type: 'page', title: 'Dashboard', description: 'Overview of compliance scores and KPIs', path: '/dashboard' },
  { id: 'p-assess', type: 'page', title: 'Assessment', description: 'Start a new compliance assessment', path: '/assessment' },
  { id: 'p-standards', type: 'page', title: 'Standards Library', description: 'Browse ISO 37001, 37301, 27001, 9001', path: '/standards' },
  { id: 'p-agents', type: 'page', title: 'Agent Workflow', description: 'View AI agent orchestration', path: '/agents' },
  { id: 'p-analytics', type: 'page', title: 'Analytics', description: 'Trends, benchmarks, and maturity simulation', path: '/analytics' },
  { id: 'p-reports', type: 'page', title: 'Reports', description: 'Generate and download compliance reports', path: '/reports' },
  { id: 'p-settings', type: 'page', title: 'Settings', description: 'Configure API keys and preferences', path: '/settings' },
];

const typeIcons = {
  clause: BookOpen,
  gap: AlertTriangle,
  standard: FileText,
  remediation: ArrowRight,
  page: Search,
};

const typeColors = {
  clause: 'var(--color-accent-500)',
  gap: 'var(--color-risk-critical)',
  standard: '#4A90FF',
  remediation: '#FFD32A',
  page: 'var(--color-text-secondary)',
};

export default function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { currentAssessment } = useAppStore();

  // Build search index from assessment data
  const searchItems = useMemo<SearchItem[]>(() => {
    const items: SearchItem[] = [...staticPages];

    if (currentAssessment) {
      for (const std of currentAssessment.standards) {
        items.push({
          id: `std-${std.standardCode}`,
          type: 'standard',
          title: `${std.standardCode.replace('ISO', 'ISO ')} — ${std.standardName}`,
          description: `Score: ${std.overallScore}% | Maturity Level ${std.maturityLevel}`,
          path: '/standards',
          meta: std.summary,
        });

        for (const clause of std.clauseScores) {
          items.push({
            id: `clause-${std.standardCode}-${clause.clauseId}`,
            type: 'clause',
            title: `${std.standardCode} Clause ${clause.clauseId}: ${clause.clauseTitle}`,
            description: `Score: ${clause.score}% | ${clause.status}`,
            path: '/reports',
            meta: clause.gap || clause.evidence,
          });
        }
      }

      for (const gap of currentAssessment.gaps) {
        items.push({
          id: `gap-${gap.id}`,
          type: 'gap',
          title: gap.title,
          description: `${gap.standardCode.replace('ISO', 'ISO ')} Clause ${gap.clauseId} | ${gap.impact.toUpperCase()}`,
          path: '/reports',
          meta: gap.description,
        });
      }

      for (const rem of currentAssessment.remediation) {
        items.push({
          id: `rem-${rem.id}`,
          type: 'remediation',
          title: rem.title,
          description: `Phase ${rem.phase} | ${rem.effortDays} days | ${rem.responsibleFunction}`,
          path: '/reports',
          meta: rem.description,
        });
      }
    }

    return items;
  }, [currentAssessment]);

  const fuse = useMemo(
    () =>
      new Fuse(searchItems, {
        keys: [
          { name: 'title', weight: 0.4 },
          { name: 'description', weight: 0.3 },
          { name: 'meta', weight: 0.2 },
          { name: 'type', weight: 0.1 },
        ],
        threshold: 0.4,
        includeScore: true,
      }),
    [searchItems]
  );

  const results = query.trim()
    ? fuse.search(query).slice(0, 8).map((r) => r.item)
    : staticPages;

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [open]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleSelect = (item: SearchItem) => {
    navigate(item.path);
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      handleSelect(results[selectedIndex]);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[60]"
            style={{ background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)' }}
          />

          {/* Search modal */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 w-[560px] max-w-[90vw] z-[61] rounded-2xl overflow-hidden"
            style={{
              background: 'var(--color-primary-800)',
              border: '1px solid var(--glass-border)',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6)',
            }}
          >
            {/* Input */}
            <div
              className="flex items-center gap-3 px-5 py-4"
              style={{ borderBottom: '1px solid var(--glass-border)' }}
            >
              <Search size={20} style={{ color: 'var(--color-text-muted)' }} />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search clauses, gaps, standards, pages..."
                className="flex-1 bg-transparent border-none outline-none text-base"
                style={{ color: 'var(--color-text-primary)' }}
              />
              <kbd
                className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                style={{ background: 'var(--color-primary-700)', color: 'var(--color-text-muted)', border: '1px solid var(--glass-border)' }}
              >
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-[400px] overflow-y-auto py-2">
              {results.length === 0 && (
                <div className="px-5 py-8 text-center text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  No results found for "{query}"
                </div>
              )}
              {results.map((item, i) => {
                const Icon = typeIcons[item.type];
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(i)}
                    className="w-full flex items-center gap-3 px-5 py-3 text-left transition-colors"
                    style={{
                      background: i === selectedIndex ? 'var(--color-primary-700)' : 'transparent',
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: `${typeColors[item.type]}15` }}
                    >
                      <Icon size={16} style={{ color: typeColors[item.type] }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate" style={{ color: 'var(--color-text-primary)' }}>
                        {item.title}
                      </div>
                      <div className="text-xs truncate" style={{ color: 'var(--color-text-muted)' }}>
                        {item.description}
                      </div>
                    </div>
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded capitalize flex-shrink-0"
                      style={{ background: `${typeColors[item.type]}15`, color: typeColors[item.type] }}
                    >
                      {item.type}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div
              className="flex items-center justify-between px-5 py-2.5 text-[10px]"
              style={{ borderTop: '1px solid var(--glass-border)', color: 'var(--color-text-muted)' }}
            >
              <span>↑↓ Navigate &nbsp; ↵ Select &nbsp; ESC Close</span>
              <span>{searchItems.length} items indexed</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Export a trigger button for Navbar
export function SearchTrigger({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all"
      style={{ background: 'var(--color-primary-700)', border: '1px solid var(--glass-border)' }}
    >
      <Search size={16} style={{ color: 'var(--color-text-muted)' }} />
      <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Search...</span>
      <kbd
        className="text-[10px] font-mono px-1.5 py-0.5 rounded ml-4"
        style={{ background: 'var(--color-primary-600)', color: 'var(--color-text-muted)', border: '1px solid var(--glass-border)' }}
      >
        <Command size={10} className="inline" /> K
      </kbd>
    </button>
  );
}
