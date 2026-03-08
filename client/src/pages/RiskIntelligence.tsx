import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldAlert } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { standardsApi } from '../utils/apiClient';
import type { KnowledgeBaseOverview } from '../types';
import { EmptyWorkspace, MetricCard, PageHero, Panel } from '../components/ui/EnterpriseLayout';
import { getRiskDistribution, getStandardLabel, sortGapsByPriority } from '../utils/enterpriseData';

export default function RiskIntelligence() {
  const navigate = useNavigate();
  const { currentAssessment, orgProfile } = useAppStore();
  const [overview, setOverview] = useState<KnowledgeBaseOverview | null>(null);

  const industry = currentAssessment?.orgProfile.industrySector || orgProfile.industrySector || 'Other';

  useEffect(() => {
    let active = true;
    standardsApi.getKnowledgeBase(industry).then((result) => {
      if (active) setOverview(result);
    }).catch(() => {
      if (active) setOverview(null);
    });

    return () => {
      active = false;
    };
  }, [industry]);

  if (!currentAssessment) {
    return (
      <EmptyWorkspace
        title="Risk intelligence activates after an assessment"
        description="Run a live assessment to compare current posture against industry benchmarks and regulatory pressure indicators."
        action={<button onClick={() => navigate('/assessment')} className="btn btn-primary">Run assessment</button>}
      />
    );
  }

  const sortedGaps = sortGapsByPriority(currentAssessment.gaps);
  const riskDistribution = getRiskDistribution(currentAssessment.gaps);
  const benchmarkRows = currentAssessment.standards.map((standard) => {
    const benchmark = overview?.industryBenchmark.averageScores[standard.standardCode] ?? null;
    return {
      standard: getStandardLabel(standard.standardCode),
      score: standard.overallScore,
      benchmark,
      delta: benchmark === null ? null : standard.overallScore - benchmark,
    };
  });

  const topExposure = useMemo(
    () => [...currentAssessment.standards].sort((left, right) => left.overallScore - right.overallScore)[0],
    [currentAssessment]
  );

  return (
    <div className="space-y-6">
      <PageHero
        eyebrow="Risk intelligence"
        title="Organizational exposure and benchmark context"
        description={`Assessment signals for ${currentAssessment.orgProfile.companyName || 'the organization'} benchmarked against ${industry} expectations.`}
        actions={<button onClick={() => navigate('/remediation-tracker')} className="btn btn-primary">Open remediation tracker <ArrowRight size={14} /></button>}
        aside={
          <div className="hero-stat-stack">
            <div className="hero-stat-label">Highest exposure</div>
            <div className="hero-stat-value">{topExposure ? getStandardLabel(topExposure.standardCode) : 'N/A'}</div>
            <div className="hero-stat-copy">Current weakest overall score in the standards portfolio.</div>
          </div>
        }
      />

      <div className="metric-grid">
        <MetricCard label="Critical risks" value={riskDistribution.critical} caption="Gaps requiring immediate intervention" tone="danger" />
        <MetricCard label="High risks" value={riskDistribution.high} caption="Material control or policy exposures" tone="warn" />
        <MetricCard label="Benchmark pressure" value={overview?.industryBenchmark.regulatoryPressure || 'n/a'} caption="Industry regulatory intensity indicator" tone="brand" />
        <MetricCard label="Overall score" value={`${currentAssessment.overallScore}%`} caption="Cross-standard compliance posture" tone="success" />
      </div>

      <div className="enterprise-two-column">
        <Panel label="Benchmark analysis" title="Current score vs industry average" description="Negative deltas indicate areas operating below sector baseline expectations.">
          <div className="insight-list">
            {benchmarkRows.map((row) => (
              <div key={row.standard} className="insight-row">
                <div className="insight-kicker">{row.standard}</div>
                <div style={{ flex: 1 }}>
                  <div className="insight-title">Current {row.score}% {row.benchmark !== null ? `· Benchmark ${row.benchmark}%` : ''}</div>
                  <div className="benchmark-bar">
                    <div className="benchmark-bar-fill" style={{ width: `${row.score}%` }} />
                    {row.benchmark !== null ? <div className="benchmark-bar-marker" style={{ left: `${row.benchmark}%` }} /> : null}
                  </div>
                </div>
                <div className={`delta-pill ${row.delta !== null && row.delta < 0 ? 'delta-pill-negative' : 'delta-pill-positive'}`}>
                  {row.delta === null ? 'No benchmark' : `${row.delta > 0 ? '+' : ''}${row.delta} pts`}
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel label="Priority queue" title="Top risk items" description="Ranked by severity and impact score to support executive escalation.">
          <div className="insight-list">
            {sortedGaps.slice(0, 6).map((gap) => (
              <div key={gap.id} className="insight-row">
                <div className={`insight-kicker insight-kicker-${gap.impact}`}>{gap.impact}</div>
                <div>
                  <div className="insight-title">{gap.title}</div>
                  <div className="insight-copy">{getStandardLabel(gap.standardCode)} clause {gap.clauseId} · Impact {gap.impactScore}/10 · Effort {gap.effortScore}/10</div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="enterprise-two-column">
        <Panel label="Control risk themes" title="Recurring risk categories" description="Aggregate gaps by delivery domain to guide control owner alignment.">
          <div className="enterprise-three-column">
            {['policy', 'process', 'training', 'technology', 'documentation'].map((category) => {
              const count = currentAssessment.gaps.filter((gap) => gap.category === category).length;
              return (
                <div key={category} className="insight-card">
                  <div className="insight-kicker">{category}</div>
                  <div className="insight-title">{count} open gaps</div>
                  <div className="insight-copy">Controls and remediation actions tagged to this capability domain.</div>
                </div>
              );
            })}
          </div>
        </Panel>

        <Panel label="Regulatory context" title="Pressure indicators and common fail modes" description="Reference points from the knowledge base for narrative shaping.">
          <div className="insight-list">
            {overview?.industryBenchmark.commonGaps.slice(0, 6).map((gap) => (
              <div key={gap} className="insight-row">
                <div className="insight-kicker"><ShieldAlert size={14} /></div>
                <div>
                  <div className="insight-title">{gap}</div>
                  <div className="insight-copy">Common industry exposure highlighted by the compliance knowledge base.</div>
                </div>
              </div>
            )) || <div className="insight-copy">No industry context available.</div>}
          </div>
        </Panel>
      </div>
    </div>
  );
}