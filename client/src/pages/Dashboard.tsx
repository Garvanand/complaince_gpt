import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield, AlertTriangle, CalendarDays, FileCheck,
  ArrowRight, Upload, BarChart3, TrendingUp, ChevronRight,
} from 'lucide-react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  Legend, ResponsiveContainer, Tooltip,
} from 'recharts';
import KPICard from '../components/dashboard/KPICard';
import ClauseHeatmap from '../components/analytics/ClauseHeatmap';
import RemediationTimeline from '../components/reports/RemediationTimeline';
import GapPriorityMatrix from '../components/analytics/GapPriorityMatrix';
import { StatusBadge, ScoreBadge, SectionHeader, EmptyState } from '../components/ui/EnterpriseComponents';
import { useAppStore } from '../store/useAppStore';
import { formatDate } from '../utils/helpers';

const tooltipStyle = {
  contentStyle: {
    background: 'var(--white)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    fontSize: 12,
    color: 'var(--slate-700)',
    boxShadow: 'var(--shadow-lg)',
  },
};

const standardsMeta: Record<string, { short: string; color: string }> = {
  ISO37001: { short: 'ISO 37001', color: 'var(--chart-5)' },
  ISO37301: { short: 'ISO 37301', color: 'var(--chart-1)' },
  ISO27001: { short: 'ISO 27001', color: 'var(--chart-2)' },
  ISO9001:  { short: 'ISO 9001',  color: 'var(--chart-3)' },
};

function EmptyDashboard() {
  const navigate = useNavigate();
  const { loadDemoData } = useAppStore();

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', padding: '0 16px' }}>
      {/* KPI placeholders */}
      <div className="kpi-grid" style={{ marginBottom: 24 }}>
        {['Overall Score', 'Standards Assessed', 'Critical Gaps', 'Last Assessment'].map((label) => (
          <div key={label} className="kpi-card">
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>{label}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--slate-300)', marginBottom: 4 }}>—</div>
            <div className="skeleton" style={{ height: 10, width: '60%', marginTop: 4 }} />
          </div>
        ))}
      </div>

      {/* CTAs */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 'var(--radius-md)',
            background: 'var(--blue-800)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Upload size={16} color="white" />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--slate-900)', marginBottom: 4 }}>Start New Assessment</div>
            <div style={{ fontSize: 12, color: 'var(--slate-500)', lineHeight: 1.5 }}>
              Upload governance documents and run multi-standard ISO compliance analysis.
            </div>
          </div>
          <button
            onClick={() => navigate('/assessment')}
            className="btn btn-primary"
            style={{ alignSelf: 'flex-start', marginTop: 4 }}
          >
            Start Assessment <ArrowRight size={13} />
          </button>
        </div>

        <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 'var(--radius-md)',
            background: 'var(--slate-200)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <BarChart3 size={16} color="var(--slate-600)" />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--slate-900)', marginBottom: 4 }}>Load Demo Data</div>
            <div style={{ fontSize: 12, color: 'var(--slate-500)', lineHeight: 1.5 }}>
              Explore a sample assessment for Acme Corp across all four ISO standards.
            </div>
          </div>
          <button
            onClick={loadDemoData}
            className="btn btn-secondary"
            style={{ alignSelf: 'flex-start', marginTop: 4 }}
          >
            Load Demo
          </button>
        </div>
      </div>

      {/* Standards reference table */}
      <div className="card">
        <div className="card-header">
          <SectionHeader label="Reference" title="Supported ISO Standards" />
          <button onClick={() => navigate('/standards')} className="btn btn-ghost" style={{ fontSize: 12 }}>
            View Library <ChevronRight size={13} />
          </button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Standard</th>
                <th>Title</th>
                <th>Clauses</th>
                <th>Domain</th>
              </tr>
            </thead>
            <tbody>
              {[
                { code: 'ISO 37001', name: 'Anti-Bribery Management Systems', clauses: 33, domain: 'Anti-Bribery' },
                { code: 'ISO 37301', name: 'Compliance Management Systems', clauses: 28, domain: 'Governance' },
                { code: 'ISO 27001', name: 'Information Security Management', clauses: 24, domain: 'InfoSec' },
                { code: 'ISO 9001',  name: 'Quality Management Systems', clauses: 28, domain: 'Quality' },
              ].map((s) => (
                <tr key={s.code}>
                  <td><span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: 12, color: 'var(--blue-700)' }}>{s.code}</span></td>
                  <td style={{ color: 'var(--slate-700)' }}>{s.name}</td>
                  <td style={{ color: 'var(--slate-600)' }}>{s.clauses}</td>
                  <td><span className="badge badge-pending">{s.domain}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { currentAssessment, isDemoMode } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  if (!currentAssessment) return <EmptyDashboard />;

  const a = currentAssessment;
  const criticalGaps = a.gaps.filter((g) => g.impact === 'critical').length;
  const highGaps = a.gaps.filter((g) => g.impact === 'high').length;

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div className="kpi-grid">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="kpi-card">
              <div className="skeleton" style={{ height: 12, width: '55%', marginBottom: 16 }} />
              <div className="skeleton" style={{ height: 28, width: '40%', marginBottom: 8 }} />
              <div className="skeleton" style={{ height: 10, width: '70%' }} />
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="card" style={{ height: 320 }}><div style={{ padding: 20 }}><div className="skeleton" style={{ height: 280 }} /></div></div>
          <div className="card" style={{ height: 320 }}><div style={{ padding: 20 }}><div className="skeleton" style={{ height: 280 }} /></div></div>
        </div>
      </div>
    );
  }

  const radarData = a.standards.map((s) => ({
    standard: standardsMeta[s.standardCode]?.short || s.standardCode,
    Current: s.overallScore,
    Target: 85,
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Demo banner */}
      {isDemoMode && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '8px 16px',
          background: '#FFFBEB',
          border: '1px solid #FDE68A',
          borderRadius: 'var(--radius-lg)',
          fontSize: 12,
          color: '#92400E',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--risk-medium)', flexShrink: 0 }} />
          <span><strong>Demo Mode</strong> — Displaying sample assessment data for {a.orgProfile.companyName}.</span>
          <button onClick={() => navigate('/assessment')} className="btn btn-ghost" style={{ marginLeft: 'auto', fontSize: 11, padding: '3px 8px' }}>
            Run Real Assessment <ArrowRight size={11} />
          </button>
        </div>
      )}

      {/* KPI Row */}
      <div className="kpi-grid">
        <KPICard
          title="Overall Compliance Score"
          value={a.overallScore}
          suffix="%"
          icon={<Shield size={15} />}
          color="var(--blue-700)"
          subtitle={`Maturity Level ${a.overallMaturity} — ${a.overallMaturityLabel}`}
          trend={{ value: 4, label: 'vs. last assessment' }}
        />
        <KPICard
          title="Standards Assessed"
          value={a.standards.length}
          icon={<FileCheck size={15} />}
          color="var(--chart-3)"
          subtitle={a.standards.map(s => standardsMeta[s.standardCode]?.short || s.standardCode).join(', ')}
        />
        <KPICard
          title="Critical Gaps"
          value={criticalGaps}
          icon={<AlertTriangle size={15} />}
          color="var(--risk-critical)"
          subtitle={`${highGaps} high severity, ${a.gaps.length - criticalGaps - highGaps} others`}
        />
        <KPICard
          title="Last Assessment"
          value={0}
          hideValue
          icon={<CalendarDays size={15} />}
          color="var(--slate-500)"
          subtitle={formatDate(a.timestamp)}
        />
      </div>

      {/* Standards Compliance Table + Radar */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 16 }}>

        {/* Standards table */}
        <div className="card">
          <div className="card-header">
            <SectionHeader label="Assessment Results" title="Standards Compliance Summary" />
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Standard</th>
                  <th>Score</th>
                  <th>Status</th>
                  <th>Critical Gaps</th>
                  <th>Clauses</th>
                </tr>
              </thead>
              <tbody>
                {a.standards.map((s) => {
                  const statusStr = s.overallScore >= 75 ? 'compliant' : s.overallScore >= 50 ? 'partial' : 'non-compliant';
                  const critCount = a.gaps.filter(g => g.standardCode === s.standardCode && g.impact === 'critical').length;
                  return (
                    <tr key={s.standardCode}>
                      <td>
                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: 12, color: 'var(--blue-700)' }}>
                          {standardsMeta[s.standardCode]?.short || s.standardCode}
                        </span>
                      </td>
                      <td><ScoreBadge score={s.overallScore} /></td>
                      <td><StatusBadge status={statusStr} /></td>
                      <td>
                        {critCount > 0
                          ? <span style={{ color: 'var(--risk-critical)', fontWeight: 700 }}>{critCount}</span>
                          : <span style={{ color: 'var(--status-compliant)' }}>0</span>}
                      </td>
                      <td style={{ color: 'var(--slate-500)' }}>{s.clauseScores.length}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Compliance Radar */}
        <div className="card">
          <div className="card-header">
            <SectionHeader label="Compliance Maturity" title="Current vs. Target" />
          </div>
          <div style={{ padding: '12px 16px' }}>
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={radarData} margin={{ top: 8, right: 20, bottom: 8, left: 20 }}>
                <PolarGrid stroke="var(--slate-200)" />
                <PolarAngleAxis dataKey="standard" tick={{ fill: 'var(--slate-600)', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'var(--slate-400)', fontSize: 10 }} />
                <Radar
                  name="Current"
                  dataKey="Current"
                  stroke="var(--blue-700)"
                  fill="var(--blue-700)"
                  fillOpacity={0.15}
                  strokeWidth={2}
                />
                <Radar
                  name="Target (85%)"
                  dataKey="Target"
                  stroke="var(--slate-400)"
                  fill="none"
                  strokeDasharray="4 3"
                  strokeWidth={1.5}
                />
                <Tooltip {...tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11, color: 'var(--slate-500)', paddingTop: 4 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Gap Priority Matrix + Remediation Timeline */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="card">
          <div className="card-header">
            <SectionHeader label="Risk Analysis" title="Gap Priority Matrix" description="Impact vs. implementation effort" />
          </div>
          <div className="card-body" style={{ paddingTop: 8 }}>
            <GapPriorityMatrix gaps={a.gaps} />
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <SectionHeader label="Remediation Roadmap" title="Priority Actions" />
            <button onClick={() => navigate('/reports')} className="btn btn-ghost" style={{ fontSize: 12, flexShrink: 0 }}>
              View All <ChevronRight size={12} />
            </button>
          </div>
          <div className="card-body" style={{ paddingTop: 8 }}>
            <RemediationTimeline actions={a.remediation.slice(0, 5)} />
          </div>
        </div>
      </div>

      {/* Clause Heatmap */}
      <div className="card">
        <div className="card-header">
          <SectionHeader label="Clause Analysis" title="Compliance Heatmap" description="Clause-level compliance across all assessed standards" />
          <button onClick={() => navigate('/analytics')} className="btn btn-ghost" style={{ fontSize: 12, flexShrink: 0 }}>
            Full Analytics <ChevronRight size={12} />
          </button>
        </div>
        <div className="card-body" style={{ paddingTop: 8 }}>
          <ClauseHeatmap standards={a.standards} />
        </div>
      </div>

      {/* Critical Gaps Summary */}
      {criticalGaps > 0 && (
        <div className="card">
          <div className="card-header">
            <SectionHeader
              label="Immediate Attention Required"
              title={`Critical Gaps (${criticalGaps})`}
              description="These findings require immediate remediation action"
            />
            <button onClick={() => navigate('/reports')} className="btn btn-ghost" style={{ fontSize: 12, flexShrink: 0 }}>
              View Report <ChevronRight size={12} />
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12, padding: 16 }}>
            {a.gaps.filter(g => g.impact === 'critical').map((gap) => (
              <div key={gap.id} style={{
                padding: 14,
                borderRadius: 'var(--radius-md)',
                background: 'var(--risk-critical-bg)',
                border: '1px solid var(--risk-critical-border)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span className="badge badge-critical">Critical</span>
                  <span style={{ fontSize: 11, color: 'var(--slate-500)', fontFamily: 'var(--font-mono)' }}>
                    {gap.standardCode.replace('ISO', 'ISO ')}
                  </span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--slate-800)', marginBottom: 4 }}>{gap.title}</div>
                <div style={{ fontSize: 12, color: 'var(--slate-600)', lineHeight: 1.4 }}>{gap.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
