/**
 * Enterprise shared UI components
 * StatusBadge, RiskChip, ScoreBadge, SectionHeader, EmptyState, LoadingRows
 */

import type { ReactNode } from 'react';

/* ── StatusBadge ────────────────────────────────────────── */
type StatusValue = 'compliant' | 'partial' | 'non-compliant' | 'not-assessed' | 'pending';

export function StatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase().replace(/_/g, '-') as StatusValue;

  const map: Record<StatusValue, { label: string; cls: string }> = {
    compliant:     { label: 'Compliant',     cls: 'badge badge-compliant' },
    partial:       { label: 'Partial',       cls: 'badge badge-partial' },
    'non-compliant': { label: 'Non-Compliant', cls: 'badge badge-noncompliant' },
    'not-assessed':  { label: 'Not Assessed',  cls: 'badge badge-pending' },
    pending:       { label: 'Pending',       cls: 'badge badge-pending' },
  };

  const entry = map[normalized] || { label: status, cls: 'badge badge-pending' };
  return <span className={entry.cls}>{entry.label}</span>;
}

/* ── RiskChip ───────────────────────────────────────────── */
type RiskLevel = 'critical' | 'high' | 'medium' | 'low';

export function RiskChip({ level }: { level: string }) {
  const norm = level.toLowerCase() as RiskLevel;
  const map: Record<RiskLevel, string> = {
    critical: 'badge badge-critical',
    high:     'badge badge-high',
    medium:   'badge badge-medium',
    low:      'badge badge-low',
  };
  return (
    <span className={map[norm] || 'badge badge-pending'}>
      {level.charAt(0).toUpperCase() + level.slice(1)}
    </span>
  );
}

/* ── ScoreBadge ─────────────────────────────────────────── */
export function ScoreBadge({ score }: { score: number }) {
  let color = 'var(--status-compliant)';
  let bg = 'var(--status-compliant-bg)';
  if (score < 50) { color = 'var(--risk-critical)'; bg = 'var(--risk-critical-bg)'; }
  else if (score < 70) { color = 'var(--risk-medium)'; bg = 'var(--risk-medium-bg)'; }

  return (
    <span
      className="score-display"
      style={{
        display: 'inline-block',
        padding: '2px 8px',
        background: bg,
        color,
        borderRadius: 'var(--radius-sm)',
        fontSize: 12,
        fontWeight: 700,
      }}
    >
      {score}%
    </span>
  );
}

/* ── SectionHeader ──────────────────────────────────────── */
interface SectionHeaderProps {
  label?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function SectionHeader({ label, title, description, action }: SectionHeaderProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 16 }}>
      <div>
        {label && <span className="section-label">{label}</span>}
        <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--slate-900)', lineHeight: 1.3 }}>{title}</h3>
        {description && <p style={{ fontSize: 12, color: 'var(--slate-500)', marginTop: 2 }}>{description}</p>}
      </div>
      {action && <div style={{ flexShrink: 0 }}>{action}</div>}
    </div>
  );
}

/* ── EmptyState ─────────────────────────────────────────── */
interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
      textAlign: 'center',
      gap: 8,
    }}>
      {icon && (
        <div style={{ color: 'var(--slate-400)', marginBottom: 4 }}>{icon}</div>
      )}
      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--slate-700)' }}>{title}</div>
      {description && (
        <div style={{ fontSize: 12, color: 'var(--slate-500)', maxWidth: 320 }}>{description}</div>
      )}
      {action && <div style={{ marginTop: 8 }}>{action}</div>}
    </div>
  );
}

/* ── LoadingRow ─────────────────────────────────────────── */
export function LoadingRows({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, r) => (
        <tr key={r}>
          {Array.from({ length: cols }).map((_, c) => (
            <td key={c} style={{ padding: '10px 12px' }}>
              <div className="skeleton" style={{ height: 14, borderRadius: 3 }} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

/* ── InfoTooltip ────────────────────────────────────────── */
export function InfoTooltip({ text }: { text: string }) {
  return (
    <span
      data-tooltip={text}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 14,
        height: 14,
        borderRadius: '50%',
        background: 'var(--slate-200)',
        color: 'var(--slate-500)',
        fontSize: 10,
        fontWeight: 700,
        cursor: 'default',
        flexShrink: 0,
      }}
    >
      ?
    </span>
  );
}
