import { useEffect, useMemo, useState } from 'react';
import { ExternalLink, RefreshCw } from 'lucide-react';
import { standardsApi } from '../utils/apiClient';
import type { KnowledgeBaseOverview, StandardLibraryItem } from '../types';
import { useAppStore } from '../store/useAppStore';
import { EmptyWorkspace, MetricCard, PageHero, Panel } from '../components/ui/EnterpriseLayout';

export default function KnowledgeBase() {
  const { currentAssessment, orgProfile } = useAppStore();
  const [library, setLibrary] = useState<StandardLibraryItem[]>([]);
  const [overview, setOverview] = useState<KnowledgeBaseOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const industry = currentAssessment?.orgProfile.industrySector || orgProfile.industrySector || 'Other';

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    Promise.all([standardsApi.getLibrary(), standardsApi.getKnowledgeBase(industry)])
      .then(([libraryResponse, overviewResponse]) => {
        if (!active) return;
        setLibrary(libraryResponse.standards);
        setOverview(overviewResponse);
      })
      .catch((err) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : 'Unable to load the compliance knowledge base.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [industry]);

  const frameworkCount = useMemo(
    () => Object.values(overview?.legalFrameworkReferences || {}).reduce((count, items) => count + items.length, 0),
    [overview]
  );

  if (loading) {
    return <div className="skeleton" style={{ height: 420 }} />;
  }

  if (error || !overview) {
    return (
      <EmptyWorkspace
        title="Knowledge services unavailable"
        description={error || 'The knowledge base endpoint did not return data for this industry context.'}
        action={<button onClick={() => window.location.reload()} className="btn btn-primary">Retry</button>}
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHero
        eyebrow="Compliance intelligence"
        title="Knowledge Base"
        description={`Legal references, maturity guidance, and cross-standard mappings tailored to ${industry}.`}
        actions={<button onClick={() => window.location.reload()} className="btn btn-secondary"><RefreshCw size={14} /> Refresh</button>}
        aside={
          <div className="hero-stat-stack">
            <div className="hero-stat-label">Industry pressure</div>
            <div className="hero-stat-value">{overview.industryBenchmark.regulatoryPressure}</div>
            <div className="hero-stat-copy">Benchmark anchored to current industry selection.</div>
          </div>
        }
      />

      <div className="metric-grid">
        <MetricCard label="Supported standards" value={library.length} caption="Live clause and questionnaire coverage" tone="brand" />
        <MetricCard label="Framework references" value={frameworkCount} caption="Mapped across ISO compliance domains" />
        <MetricCard label="Common findings" value={overview.commonAuditFindings.length} caption="Observed gap archetypes in the knowledge pack" tone="warn" />
        <MetricCard label="Crosswalk mappings" value={overview.crossStandardMappings.length} caption="Clause relationships for reuse and harmonization" tone="success" />
      </div>

      <div className="enterprise-two-column">
        <Panel label="Standards library" title="Assurance content inventory" description="Each standard exposes clauses, questionnaire coverage, and category metadata.">
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Standard</th>
                  <th>Version</th>
                  <th>Clauses</th>
                  <th>Questions</th>
                  <th>Mandatory</th>
                </tr>
              </thead>
              <tbody>
                {library.map((standard) => (
                  <tr key={standard.code}>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--slate-900)' }}>{standard.fullName}</div>
                      <div style={{ fontSize: 12, color: 'var(--slate-500)' }}>{standard.code.replace('ISO', 'ISO ')}</div>
                    </td>
                    <td>{standard.version}</td>
                    <td>{standard.clauseCount}</td>
                    <td>{standard.totalQuestions}</td>
                    <td>{standard.mandatoryQuestions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel label="Maturity model" title="Readiness progression" description="Use the model to frame executive reporting and remediation sequencing.">
          <div className="insight-list">
            {overview.maturityModel.map((item) => (
              <div key={item.level} className="insight-row">
                <div className="insight-kicker">Level {item.level}</div>
                <div>
                  <div className="insight-title">{item.name}</div>
                  <div className="insight-copy">{item.description}</div>
                  <div className="insight-tags">
                    <span className="badge badge-pending">Score {item.scoreRange[0]}-{item.scoreRange[1]}</span>
                    {item.characteristics.slice(0, 2).map((characteristic) => (
                      <span key={characteristic} className="badge badge-pending">{characteristic}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="enterprise-two-column">
        <Panel label="Legal references" title="Framework map" description="Reference sources captured by the standards knowledge service.">
          <div className="insight-list">
            {Object.entries(overview.legalFrameworkReferences).map(([standardCode, references]) => (
              <div key={standardCode} className="insight-row">
                <div className="insight-kicker">{standardCode.replace('ISO', 'ISO ')}</div>
                <div>
                  <div className="insight-title">{references.length} related instruments</div>
                  <div className="insight-tags">
                    {references.slice(0, 3).map((reference, index) => (
                      <span key={`${standardCode}-${index}`} className="badge badge-pending">
                        {String(reference.name || reference.title || reference.jurisdiction || 'Reference')}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel label="Cross-standard reuse" title="Control harmonization opportunities" description="Where standards align, reuse evidence and remediation artifacts instead of rebuilding them.">
          <div className="insight-list">
            {overview.crossStandardMappings.slice(0, 8).map((mapping, index) => (
              <div key={`${mapping.sourceStandard}-${mapping.sourceClause}-${index}`} className="insight-row">
                <div className="insight-kicker">{mapping.relationship}</div>
                <div>
                  <div className="insight-title">{mapping.sourceStandard} {mapping.sourceClause} → {mapping.targetStandard} {mapping.targetClause}</div>
                  <div className="insight-copy">{mapping.rationale}</div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel label="Audit findings" title="Frequent failure patterns" description="Use these archetypes to calibrate assessment narratives and remediation playbooks.">
        <div className="enterprise-three-column">
          {overview.commonAuditFindings.map((finding, index) => (
            <div key={`${finding.standardCode}-${finding.clauseCategory}-${index}`} className="insight-card">
              <div className="insight-kicker">{finding.standardCode.replace('ISO', 'ISO ')} · {finding.criticality}</div>
              <div className="insight-title">{finding.clauseCategory}</div>
              <div className="insight-copy">Typical score: {finding.typicalScore}%. Common issues are summarized below.</div>
              <ul className="compact-list">
                {finding.commonFindings.slice(0, 3).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Panel>

      <Panel label="Benchmarks" title="Industry context" description="Benchmark data enriches narrative quality and remediation prioritization.">
        <div className="insight-row">
          <div className="insight-kicker">{overview.industryBenchmark.industry}</div>
          <div>
            <div className="insight-title">Benchmark references available for all supported standards</div>
            <div className="insight-copy">Use the benchmark set as contextual evidence, not a substitute for clause-level verification.</div>
            <div className="insight-tags">
              {Object.entries(overview.industryBenchmark.averageScores).map(([code, value]) => (
                <span key={code} className="badge badge-pending">{code.replace('ISO', 'ISO ')} {value}%</span>
              ))}
              <a href="/risk-intelligence" className="btn btn-ghost">
                Review risk intelligence <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>
      </Panel>
    </div>
  );
}