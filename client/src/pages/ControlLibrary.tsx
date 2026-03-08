import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { standardsApi } from '../utils/apiClient';
import type { StandardCode } from '../types';
import { EmptyWorkspace, MetricCard, PageHero, Panel } from '../components/ui/EnterpriseLayout';
import { getAssessedStandardCodes, getControlCoverage, getStandardLabel, getStandardStatus, standardColors } from '../utils/enterpriseData';

interface LoadedControlSet {
  code: string;
  fullName: string;
  clauses: Array<{ id: string; title: string; description: string; category: string; weight?: number }>;
}

export default function ControlLibrary() {
  const navigate = useNavigate();
  const { currentAssessment } = useAppStore();
  const [selected, setSelected] = useState<'ALL' | StandardCode>('ALL');
  const [controls, setControls] = useState<LoadedControlSet[]>([]);

  useEffect(() => {
    let active = true;
    const codes = getAssessedStandardCodes(currentAssessment);

    Promise.all(codes.map((code) => standardsApi.getClauses(code)))
      .then((responses) => {
        if (!active) return;
        setControls(responses.map((response) => ({ code: response.code, fullName: response.fullName || response.name, clauses: response.clauses })));
      })
      .catch(() => {
        if (active) setControls([]);
      });

    return () => {
      active = false;
    };
  }, [currentAssessment]);

  if (!currentAssessment) {
    return (
      <EmptyWorkspace
        title="Control library is generated from assessed standards"
        description="Run an assessment to overlay clause-level performance on the live standards library."
        action={<button onClick={() => navigate('/assessment')} className="btn btn-primary">Start assessment</button>}
      />
    );
  }

  const visibleControls = controls.filter((controlSet) => selected === 'ALL' || controlSet.code === selected);
  const totalControls = visibleControls.reduce((count, controlSet) => count + controlSet.clauses.length, 0);
  const weakestStandard = [...currentAssessment.standards].sort((left, right) => left.overallScore - right.overallScore)[0];

  return (
    <div className="space-y-6">
      <PageHero
        eyebrow="Control intelligence"
        title="Control Library"
        description="Clause inventory, implementation overlay, and category-level control coverage across the assessed standards set."
        aside={
          <div className="hero-stat-stack">
            <div className="hero-stat-label">Weakest coverage</div>
            <div className="hero-stat-value">{weakestStandard ? getStandardLabel(weakestStandard.standardCode) : 'N/A'}</div>
            <div className="hero-stat-copy">Review low-scoring clauses before approving remediation plans.</div>
          </div>
        }
      />

      <div className="metric-grid">
        <MetricCard label="Control points" value={totalControls} caption="Live clauses loaded from the standards service" tone="brand" />
        <MetricCard label="Standards loaded" value={controls.length} caption="Control inventories currently in the workspace" />
        <MetricCard label="Implemented controls" value={currentAssessment.standards.reduce((sum, standard) => sum + getControlCoverage(standard).implemented, 0)} caption="Clauses scoring 85% or higher" tone="success" />
        <MetricCard label="Coverage gaps" value={currentAssessment.gaps.length} caption="Open deficiencies linked to control obligations" tone="warn" />
      </div>

      <Panel label="Standard filter" title="View control families" description="Switch between all standards or inspect one control framework at a time.">
        <div className="filter-row">
          <button className={`filter-chip ${selected === 'ALL' ? 'active' : ''}`} onClick={() => setSelected('ALL')}>All standards</button>
          {currentAssessment.standards.map((standard) => (
            <button
              key={standard.standardCode}
              className={`filter-chip ${selected === standard.standardCode ? 'active' : ''}`}
              onClick={() => setSelected(standard.standardCode as StandardCode)}
            >
              {getStandardLabel(standard.standardCode)}
            </button>
          ))}
        </div>
      </Panel>

      <div className="enterprise-two-column">
        <Panel label="Coverage overview" title="Implementation by standard" description="Derived from clause scores on the latest assessment.">
          <div className="insight-list">
            {currentAssessment.standards.map((standard) => {
              const coverage = getControlCoverage(standard);
              return (
                <div key={standard.standardCode} className="insight-row">
                  <div className="insight-kicker" style={{ color: standardColors[standard.standardCode] }}>{getStandardLabel(standard.standardCode)}</div>
                  <div style={{ flex: 1 }}>
                    <div className="insight-title">{coverage.implementedPct}% implemented · {coverage.partial} partial · {coverage.missing} missing</div>
                    <div className="benchmark-bar">
                      <div className="benchmark-bar-fill" style={{ width: `${coverage.implementedPct}%`, background: standardColors[standard.standardCode] }} />
                    </div>
                  </div>
                  <span className={`badge badge-${getStandardStatus(standard.overallScore) === 'non-compliant' ? 'critical' : getStandardStatus(standard.overallScore)}`}>{getStandardStatus(standard.overallScore)}</span>
                </div>
              );
            })}
          </div>
        </Panel>

        <Panel label="Category scan" title="Most represented control domains" description="Use category density to identify broad operating model themes.">
          <div className="enterprise-three-column">
            {Array.from(new Set(visibleControls.flatMap((controlSet) => controlSet.clauses.map((clause) => clause.category)))).map((category) => {
              const count = visibleControls.reduce((sum, controlSet) => sum + controlSet.clauses.filter((clause) => clause.category === category).length, 0);
              return (
                <div key={category} className="insight-card">
                  <div className="insight-kicker">{category}</div>
                  <div className="insight-title">{count} controls</div>
                  <div className="insight-copy">Cross-standard clause count for this control family.</div>
                </div>
              );
            })}
          </div>
        </Panel>
      </div>

      <Panel label="Control inventory" title="Clause-level implementation register" description="Mapped directly to live standards content and the latest assessment overlay.">
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Standard</th>
                <th>Clause</th>
                <th>Category</th>
                <th>Control title</th>
                <th>Status</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {visibleControls.flatMap((controlSet) => {
                const overlay = currentAssessment.standards.find((standard) => standard.standardCode === controlSet.code);
                return controlSet.clauses.map((clause) => {
                  const clauseOverlay = overlay?.clauseScores.find((item) => item.clauseId === clause.id);
                  const score = clauseOverlay?.score ?? null;
                  return (
                    <tr key={`${controlSet.code}-${clause.id}`}>
                      <td>{getStandardLabel(controlSet.code)}</td>
                      <td>{clause.id}</td>
                      <td>{clause.category}</td>
                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--slate-900)' }}>{clause.title}</div>
                        <div style={{ fontSize: 12, color: 'var(--slate-500)' }}>{clause.description}</div>
                      </td>
                      <td>{clauseOverlay ? <span className={`badge badge-${getStandardStatus(score || 0) === 'non-compliant' ? 'critical' : getStandardStatus(score || 0)}`}>{getStandardStatus(score || 0)}</span> : 'Not assessed'}</td>
                      <td>{score === null ? '—' : `${score}%`}</td>
                    </tr>
                  );
                });
              })}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}