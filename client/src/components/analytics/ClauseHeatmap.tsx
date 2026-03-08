import type { StandardAssessment } from '../../types';
import { getRiskColor } from '../../utils/helpers';

interface ClauseHeatmapProps {
  standards: StandardAssessment[];
}

export default function ClauseHeatmap({ standards }: ClauseHeatmapProps) {
  return (
    <div className="space-y-4 overflow-x-auto">
      {standards.map((std) => (
        <div key={std.standardCode}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
              {std.standardCode.replace('ISO', 'ISO ')}
            </span>
            <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              {std.standardName}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {std.clauseScores.map((clause) => {
              const color = getRiskColor(clause.score);
              return (
                <div
                  key={`${std.standardCode}-${clause.clauseId}`}
                  className="group relative"
                >
                  <div
                    className="w-12 h-10 rounded-lg flex items-center justify-center cursor-pointer transition-all hover:scale-110"
                    style={{
                      background: `${color}20`,
                      border: `1px solid ${color}40`,
                    }}
                  >
                    <span className="score-display text-[10px] font-bold" style={{ color }}>
                      {clause.score}%
                    </span>
                  </div>
                  {/* Tooltip */}
                  <div
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10"
                    style={{ background: 'var(--color-primary-700)', border: '1px solid var(--glass-border)' }}
                  >
                    <div className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                      {clause.clauseId}: {clause.clauseTitle}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span style={{ color }}>Score: {clause.score}%</span>
                      <span style={{ color: 'var(--color-text-muted)' }}>| {clause.status}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
