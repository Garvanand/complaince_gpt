import type { Gap } from '../../types';

const standardColors: Record<string, string> = {
  ISO37001: '#FF6B35',
  ISO37301: '#00C389',
  ISO27001: '#4A90FF',
  ISO9001: '#FFD32A',
};

interface GapPriorityMatrixProps {
  gaps: Gap[];
}

export default function GapPriorityMatrix({ gaps }: GapPriorityMatrixProps) {
  const w = 400;
  const h = 280;
  const pad = 40;
  const plotW = w - pad * 2;
  const plotH = h - pad * 2;

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ maxHeight: 300 }}>
        {/* Quadrant backgrounds */}
        <rect x={pad} y={pad} width={plotW / 2} height={plotH / 2} fill="rgba(0, 195, 137, 0.05)" />
        <rect x={pad + plotW / 2} y={pad} width={plotW / 2} height={plotH / 2} fill="rgba(255, 211, 42, 0.05)" />
        <rect x={pad} y={pad + plotH / 2} width={plotW / 2} height={plotH / 2} fill="rgba(74, 86, 128, 0.03)" />
        <rect x={pad + plotW / 2} y={pad + plotH / 2} width={plotW / 2} height={plotH / 2} fill="rgba(255, 107, 53, 0.05)" />

        {/* Quadrant labels */}
        <text x={pad + plotW * 0.25} y={pad + 16} textAnchor="middle" fill="var(--color-text-muted)" fontSize="9" fontWeight="600">QUICK WINS</text>
        <text x={pad + plotW * 0.75} y={pad + 16} textAnchor="middle" fill="var(--color-text-muted)" fontSize="9" fontWeight="600">STRATEGIC</text>
        <text x={pad + plotW * 0.25} y={pad + plotH - 6} textAnchor="middle" fill="var(--color-text-muted)" fontSize="9" fontWeight="600">FILL-INS</text>
        <text x={pad + plotW * 0.75} y={pad + plotH - 6} textAnchor="middle" fill="var(--color-text-muted)" fontSize="9" fontWeight="600">DEFER</text>

        {/* Axes */}
        <line x1={pad} y1={pad + plotH} x2={pad + plotW} y2={pad + plotH} stroke="var(--color-primary-600)" strokeWidth="1" />
        <line x1={pad} y1={pad} x2={pad} y2={pad + plotH} stroke="var(--color-primary-600)" strokeWidth="1" />

        {/* Axis labels */}
        <text x={pad + plotW / 2} y={h - 4} textAnchor="middle" fill="var(--color-text-secondary)" fontSize="10">Effort to Fix →</text>
        <text x={8} y={pad + plotH / 2} textAnchor="middle" fill="var(--color-text-secondary)" fontSize="10" transform={`rotate(-90, 8, ${pad + plotH / 2})`}>Impact →</text>

        {/* Mid lines */}
        <line x1={pad + plotW / 2} y1={pad} x2={pad + plotW / 2} y2={pad + plotH} stroke="var(--color-primary-600)" strokeWidth="0.5" strokeDasharray="4 4" />
        <line x1={pad} y1={pad + plotH / 2} x2={pad + plotW} y2={pad + plotH / 2} stroke="var(--color-primary-600)" strokeWidth="0.5" strokeDasharray="4 4" />

        {/* Gap dots */}
        {gaps.map((gap) => {
          const x = pad + (gap.effortScore / 10) * plotW;
          const y = pad + plotH - (gap.impactScore / 10) * plotH;
          const color = standardColors[gap.standardCode] || '#888';
          const r = gap.impact === 'critical' ? 8 : gap.impact === 'high' ? 6 : 5;
          return (
            <g key={gap.id}>
              <circle cx={x} cy={y} r={r} fill={color} opacity={0.85} stroke={color} strokeWidth="1" style={{ filter: `drop-shadow(0 0 4px ${color}60)` }}>
                <title>{`${gap.title} (${gap.standardCode})\nImpact: ${gap.impactScore}/10 | Effort: ${gap.effortScore}/10`}</title>
              </circle>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 flex-wrap">
        {Object.entries(standardColors).map(([code, color]) => (
          <div key={code} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ background: color }} />
            <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{code.replace('ISO', 'ISO ')}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
