import { useState } from 'react';
import { ShieldCheck, AlertTriangle, XCircle, MinusCircle, ChevronDown, ChevronRight, ArrowRightLeft } from 'lucide-react';
import { SectionHeader } from '../ui/EnterpriseComponents';
import type { EvidenceValidation, EvidenceValidationItem } from '../../types';

const validationColors: Record<string, { bg: string; color: string; label: string; icon: typeof ShieldCheck }> = {
  sufficient:   { bg: '#F0FDF4', color: '#16A34A', label: 'Sufficient',   icon: ShieldCheck },
  partial:      { bg: '#FFFBEB', color: '#D97706', label: 'Partial',      icon: MinusCircle },
  insufficient: { bg: '#FFF7ED', color: '#EA580C', label: 'Insufficient', icon: AlertTriangle },
  missing:      { bg: '#FEF2F2', color: '#DC2626', label: 'Missing',      icon: XCircle },
};

const qualityColors: Record<string, string> = {
  direct:    '#16A34A',
  indirect:  '#D97706',
  anecdotal: '#EA580C',
  none:      '#DC2626',
};

function EvidenceRow({ item }: { item: EvidenceValidationItem }) {
  const [expanded, setExpanded] = useState(false);
  const v = validationColors[item.validationResult] || validationColors.missing;
  const Icon = v.icon;

  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 12,
          padding: '12px 16px', background: 'var(--white)', cursor: 'pointer',
          textAlign: 'left', transition: 'background 80ms ease',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'var(--slate-50)'}
        onMouseLeave={e => e.currentTarget.style.background = 'var(--white)'}
      >
        <Icon size={16} style={{ color: v.color, flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600, color: '#0076A8' }}>
              {item.standardCode.replace('ISO', 'ISO ')} § {item.clauseId}
            </span>
            <span style={{
              fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
              padding: '2px 6px', borderRadius: 2, background: v.bg, color: v.color,
            }}>{v.label}</span>
            <span style={{
              fontSize: 10, fontWeight: 600, color: qualityColors[item.qualityLevel] || '#767676',
              textTransform: 'capitalize',
            }}>
              {item.qualityLevel} evidence
            </span>
          </div>
          <div style={{
            fontSize: 13, color: 'var(--slate-600)', marginTop: 2,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {item.evidenceText || 'No evidence provided'}
          </div>
        </div>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700,
          color: v.color, minWidth: 36, textAlign: 'right',
        }}>
          {item.qualityScore}%
        </div>
        {expanded ? <ChevronDown size={14} style={{ color: 'var(--slate-400)' }} /> : <ChevronRight size={14} style={{ color: 'var(--slate-400)' }} />}
      </button>

      {expanded && (
        <div style={{ padding: '0 16px 16px', borderTop: '1px solid var(--border)', background: 'var(--slate-50)' }}>
          <div style={{ paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {item.issues.length > 0 && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Issues Found</div>
                <ul style={{ margin: 0, paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {item.issues.map((issue, i) => (
                    <li key={i} style={{ fontSize: 13, color: 'var(--slate-700)', lineHeight: 1.5 }}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}
            {item.recommendation && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Recommendation</div>
                <p style={{ fontSize: 13, color: 'var(--slate-700)', lineHeight: 1.5 }}>{item.recommendation}</p>
              </div>
            )}
            {item.crossStandardReuse.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                <ArrowRightLeft size={12} style={{ color: '#0076A8' }} />
                <span style={{ fontSize: 11, fontWeight: 600, color: '#0076A8' }}>Cross-standard reuse:</span>
                {item.crossStandardReuse.map(s => (
                  <span key={s} style={{
                    fontSize: 11, fontWeight: 600, padding: '2px 6px',
                    borderRadius: 2, background: '#E6F4FA', color: '#005A80',
                  }}>{s.replace('ISO', 'ISO ')}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function EvidenceValidationPanel({ data }: { data: EvidenceValidation }) {
  const [filter, setFilter] = useState<string>('all');

  const filtered = filter === 'all'
    ? data.evidenceItems
    : data.evidenceItems.filter(i => i.validationResult === filter);

  const summaryCards = [
    { label: 'Evidence Score', value: `${data.overallEvidenceScore}%`, color: data.overallEvidenceScore >= 60 ? '#16A34A' : data.overallEvidenceScore >= 40 ? '#D97706' : '#DC2626' },
    { label: 'Sufficient', value: data.sufficientCount, color: '#16A34A' },
    { label: 'Partial', value: data.partialCount, color: '#D97706' },
    { label: 'Insufficient', value: data.insufficientCount, color: '#EA580C' },
    { label: 'Missing', value: data.missingCount, color: '#DC2626' },
    { label: 'Reuse Opportunities', value: data.crossStandardOpportunities, color: '#0076A8' },
  ];

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'sufficient', label: 'Sufficient' },
    { key: 'partial', label: 'Partial' },
    { key: 'insufficient', label: 'Insufficient' },
    { key: 'missing', label: 'Missing' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Summary KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12 }}>
        {summaryCards.map(c => (
          <div key={c.label} style={{
            textAlign: 'center', padding: '14px 8px',
            border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)',
            background: 'var(--white)',
          }}>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 24, fontWeight: 700,
              color: c.color, lineHeight: 1, marginBottom: 4,
            }}>{c.value}</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* Summary text */}
      <div style={{
        padding: '12px 16px', background: '#E6F4FA', borderRadius: 'var(--radius-lg)',
        border: '1px solid #B3DFF0', fontSize: 13, color: '#005A80', lineHeight: 1.6,
      }}>
        {data.summary}
      </div>

      {/* Filter pills */}
      <div style={{ display: 'flex', gap: 6 }}>
        {filters.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            style={{
              padding: '5px 14px', borderRadius: 999, fontSize: 12, fontWeight: 600,
              border: '1px solid',
              background: filter === f.key ? '#0076A8' : 'var(--white)',
              color: filter === f.key ? '#FFFFFF' : 'var(--slate-600)',
              borderColor: filter === f.key ? '#0076A8' : 'var(--border)',
              cursor: 'pointer', transition: 'all 120ms ease',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Evidence items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.map(item => (
          <EvidenceRow key={item.id} item={item} />
        ))}
        {filtered.length === 0 && (
          <div style={{ padding: 24, textAlign: 'center', color: 'var(--slate-400)', fontSize: 14 }}>
            No evidence items match this filter.
          </div>
        )}
      </div>
    </div>
  );
}
