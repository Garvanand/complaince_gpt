import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronRight, ChevronDown, BookOpen } from 'lucide-react';
import standardsData from '../data/iso-standards.json';
import type { StandardsLibrary, StandardCode } from '../types';
import { useAppStore } from '../store/useAppStore';
import { getRiskColor } from '../utils/helpers';

const data = standardsData as unknown as StandardsLibrary;
const standardCodes: StandardCode[] = ['ISO37001', 'ISO37301', 'ISO27001', 'ISO9001'];
const codeColors: Record<string, string> = { ISO37001: '#FF6B35', ISO37301: '#00C389', ISO27001: '#4A90FF', ISO9001: '#FFD32A' };

export default function Standards() {
  const [selected, setSelected] = useState<StandardCode>('ISO37001');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['Context', 'Leadership', 'Planning', 'Support', 'Operations', 'Evaluation', 'Improvement']));
  const [searchQuery, setSearchQuery] = useState('');
  const { currentAssessment } = useAppStore();

  const std = data[selected];
  const color = codeColors[selected];

  const toggleCategory = (cat: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat); else next.add(cat);
      return next;
    });
  };

  const categories = [...new Set(std.clauses.map((c) => c.category))];

  const filteredClauses = std.clauses.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.includes(searchQuery) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getClauseScore = (clauseId: string): number | null => {
    if (!currentAssessment) return null;
    const stdResult = currentAssessment.standards.find((s) => s.standardCode === selected);
    if (!stdResult) return null;
    const clause = stdResult.clauseScores.find((c) => c.clauseId === clauseId);
    return clause ? clause.score : null;
  };

  return (
    <div className="flex gap-6 min-h-[calc(100vh-160px)]">
      {/* Left sidebar */}
      <div className="w-64 flex-shrink-0 glass-card h-fit sticky top-24">
        <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>ISO Standards</h3>
        <div className="space-y-1">
          {standardCodes.map((code) => {
            const s = data[code];
            return (
              <button
                key={code}
                onClick={() => setSelected(code)}
                className="w-full text-left p-3 rounded-xl transition-all"
                style={{
                  background: selected === code ? `${codeColors[code]}10` : 'transparent',
                  border: `1px solid ${selected === code ? codeColors[code] + '40' : 'transparent'}`,
                }}
              >
                <div className="text-sm font-bold" style={{ color: codeColors[code] }}>{s.code}</div>
                <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  {s.clauses.length} clauses
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 space-y-6">
        {/* Header */}
        <motion.div
          key={selected}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="font-display text-3xl font-bold" style={{ color }}>{std.code}</div>
              <h2 className="text-lg font-semibold mt-1" style={{ color: 'var(--color-text-primary)' }}>{std.name}</h2>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Edition: {std.edition}</span>
                <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{std.clauses.length} Clauses</span>
                <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{categories.length} Categories</span>
              </div>
            </div>
            <BookOpen size={32} style={{ color }} />
          </div>
        </motion.div>

        {/* Search */}
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl" style={{ background: 'var(--color-primary-800)', border: '1px solid var(--glass-border)' }}>
          <Search size={18} style={{ color: 'var(--color-text-muted)' }} />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search clauses across all standards..."
            className="bg-transparent border-none outline-none text-sm flex-1"
            style={{ color: 'var(--color-text-primary)' }}
          />
        </div>

        {/* Clauses by category */}
        {categories.map((cat) => {
          const catClauses = filteredClauses.filter((c) => c.category === cat);
          if (catClauses.length === 0) return null;
          const expanded = expandedCategories.has(cat);

          return (
            <div key={cat}>
              <button
                onClick={() => toggleCategory(cat)}
                className="flex items-center gap-2 mb-3 group"
              >
                {expanded ? (
                  <ChevronDown size={18} style={{ color: 'var(--color-text-muted)' }} />
                ) : (
                  <ChevronRight size={18} style={{ color: 'var(--color-text-muted)' }} />
                )}
                <span className="text-sm font-semibold uppercase tracking-wider" style={{ color }}>
                  {cat}
                </span>
                <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  ({catClauses.length})
                </span>
              </button>

              {expanded && (
                <div className="space-y-2 ml-6">
                  {catClauses.map((clause) => {
                    const score = getClauseScore(clause.id);
                    return (
                      <motion.div
                        key={clause.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-4 rounded-xl transition-all hover:scale-[1.01]"
                        style={{ background: 'var(--color-primary-800)', border: '1px solid var(--glass-border)' }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="score-display text-sm font-bold" style={{ color }}>{clause.id}</span>
                              <span className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>{clause.title}</span>
                            </div>
                            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{clause.description}</p>
                          </div>
                          {score !== null && (
                            <div className="ml-4 flex-shrink-0">
                              <span
                                className="score-display text-sm font-bold px-3 py-1 rounded-lg"
                                style={{ background: `${getRiskColor(score)}15`, color: getRiskColor(score) }}
                              >
                                {score}%
                              </span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
