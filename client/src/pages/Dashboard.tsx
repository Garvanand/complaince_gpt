import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, CalendarDays, FileCheck, ArrowRight, Upload, PlayCircle, Bot, Search, BarChart3, FileText, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  Legend, ResponsiveContainer, Tooltip,
} from 'recharts';
import ComplianceScoreRing from '../components/dashboard/ComplianceScoreRing';
import KPICard from '../components/dashboard/KPICard';
import ClauseHeatmap from '../components/analytics/ClauseHeatmap';
import AgentActivityFeed from '../components/agents/AgentActivityFeed';
import RemediationTimeline from '../components/reports/RemediationTimeline';
import GapPriorityMatrix from '../components/analytics/GapPriorityMatrix';
import { KPISkeleton, ChartSkeleton, CardSkeleton } from '../components/Skeleton';
import { useAppStore } from '../store/useAppStore';
import { formatDate } from '../utils/helpers';

const standardsPreview = [
  { code: 'ISO 37001', name: 'Anti-Bribery', color: '#DD6B20', clauses: 33 },
  { code: 'ISO 37301', name: 'Compliance', color: '#86BC25', clauses: 28 },
  { code: 'ISO 27001', name: 'InfoSec', color: '#00ABBD', clauses: 24 },
  { code: 'ISO 9001', name: 'Quality', color: '#FFD32A', clauses: 28 },
];

const agents = [
  { name: 'Gap Analyzer', icon: Search, status: 'idle' },
  { name: 'Risk Scorer', icon: BarChart3, status: 'idle' },
  { name: 'Clause Mapper', icon: FileText, status: 'idle' },
  { name: 'Remediation Planner', icon: CheckCircle2, status: 'idle' },
  { name: 'Maturity Assessor', icon: Shield, status: 'idle' },
  { name: 'Evidence Linker', icon: Bot, status: 'idle' },
];

function EmptyDashboard() {
  const navigate = useNavigate();
  const { loadDemoData } = useAppStore();

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* KPI row — placeholder */}
      <div className="kpi-grid">
        {['Overall Score', 'Standards', 'Critical Gaps', 'Last Assessment'].map((label) => (
          <div key={label} className="kpi-card">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#4A5568] mb-2">{label}</p>
            <p className="text-3xl font-bold font-mono text-[#1E2D5A]">—</p>
          </div>
        ))}
      </div>

      {/* Main CTA cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-[#86BC25]/[0.08] to-transparent border border-[#86BC25]/20 rounded-2xl p-8 flex flex-col"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#86BC25] flex items-center justify-center mb-5 shadow-[0_0_30px_rgba(134,188,37,0.3)]">
            <Upload className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Start New Assessment</h3>
          <p className="text-sm text-[#8C9BAE] mb-6 flex-1">
            Upload your governance documents and let our AI agents analyze compliance across all four ISO standards simultaneously.
          </p>
          <button
            onClick={() => navigate('/assessment')}
            className="flex items-center gap-2 bg-[#86BC25] hover:bg-[#A8D048] text-white font-bold text-sm px-5 py-3 rounded-xl transition-all w-fit shadow-[0_0_20px_rgba(134,188,37,0.25)]"
          >
            Start Assessment <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8 flex flex-col"
        >
          <div className="w-12 h-12 rounded-2xl bg-white/[0.06] flex items-center justify-center mb-5">
            <PlayCircle className="w-5 h-5 text-[#8C9BAE]" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Explore Demo Data</h3>
          <p className="text-sm text-[#8C9BAE] mb-6 flex-1">
            Load sample assessment results for Acme Corp to explore the full dashboard, analytics, and reporting experience.
          </p>
          <button
            onClick={loadDemoData}
            className="flex items-center gap-2 bg-white/[0.06] hover:bg-white/[0.10] border border-white/[0.08] text-white font-bold text-sm px-5 py-3 rounded-xl transition-all w-fit"
          >
            Load Demo <PlayCircle className="w-4 h-4" />
          </button>
        </motion.div>
      </div>

      {/* Standards overview — always visible */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-white font-bold text-sm">Supported Standards</p>
            <p className="text-[#4A5568] text-xs">Multi-standard assessment coverage</p>
          </div>
          <button
            onClick={() => navigate('/standards')}
            className="text-xs text-[#86BC25] hover:text-[#A8D048] font-medium flex items-center gap-1 transition-colors"
          >
            View Library <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {standardsPreview.map((s) => (
            <div key={s.code} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-center">
              <p className="text-lg font-bold font-mono" style={{ color: s.color }}>{s.code.replace('ISO ', '')}</p>
              <p className="text-xs text-[#8C9BAE] mt-1">{s.name}</p>
              <p className="text-[10px] text-[#4A5568] mt-2">{s.clauses} clauses</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Agent status */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6"
      >
        <div className="mb-5">
          <p className="text-white font-bold text-sm">AI Agent Pipeline</p>
          <p className="text-[#4A5568] text-xs">Agents activate when assessment begins</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {agents.map((agent) => (
            <div key={agent.name} className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-3 text-center">
              <agent.icon className="w-5 h-5 text-[#4A5568] mx-auto mb-2" />
              <p className="text-xs text-[#8C9BAE] font-medium">{agent.name}</p>
              <p className="text-[10px] text-[#1E2D5A] mt-1 uppercase tracking-wider font-bold">Idle</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { currentAssessment, isDemoMode } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  if (!currentAssessment) return <EmptyDashboard />;

  const a = currentAssessment;
  const criticalGaps = a.gaps.filter((g) => g.impact === 'critical').length;

  if (loading) {
    return (
      <div className="p-6 md:p-8 space-y-8">
        <div className="kpi-grid">
          {[...Array(4)].map((_, i) => <KPISkeleton key={i} />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartSkeleton height={340} />
          <ChartSkeleton height={340} />
        </div>
        <ChartSkeleton height={250} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  const radarData = a.standards.map((s) => ({
    standard: s.standardCode.replace('ISO', ''),
    current: s.overallScore,
    target: 85,
  }));

  return (
    <div className="p-6 md:p-8 space-y-8">
      {isDemoMode && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 py-3 px-5 bg-[#86BC25]/[0.06] border border-[#86BC25]/20 rounded-2xl"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-[#86BC25] animate-pulse" />
          <span className="text-sm text-[#86BC25]">
            Demo Mode — showing sample data for {a.orgProfile.companyName}
          </span>
        </motion.div>
      )}

      {/* KPI Row */}
      <div className="kpi-grid">
        <div className="kpi-card flex-row items-center gap-5">
          <ComplianceScoreRing score={a.overallScore} maturityLevel={a.overallMaturity} size={100} showMaturity={false} />
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#4A5568]">
              Overall Score
            </span>
            <div className="text-sm mt-1 text-[#8C9BAE]">
              Level {a.overallMaturity} — {a.overallMaturityLabel}
            </div>
          </div>
        </div>
        <div className="kpi-card">
          <KPICard title="Standards Assessed" value={a.standards.length} icon={<FileCheck size={20} />} subtitle="Active ISO standards" delay={200} />
        </div>
        <div className="kpi-card">
          <KPICard title="Critical Gaps" value={criticalGaps} icon={<AlertTriangle size={20} />} color="var(--color-risk-critical)" subtitle="Requires immediate action" delay={400} />
        </div>
        <div className="kpi-card">
          <KPICard title="Last Assessment" value={0} icon={<CalendarDays size={20} />} subtitle={formatDate(a.timestamp)} delay={600} />
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6"
        >
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#86BC25] mb-1">Compliance Maturity</p>
          <h3 className="text-base font-bold text-white mb-4">Current vs Target</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.06)" />
              <PolarAngleAxis dataKey="standard" tick={{ fill: '#8C9BAE', fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#4A5568', fontSize: 10 }} />
              <Radar name="Current" dataKey="current" stroke="#86BC25" fill="#86BC25" fillOpacity={0.2} strokeWidth={2} />
              <Radar name="Target" dataKey="target" stroke="#4A5568" fill="none" strokeDasharray="5 5" strokeWidth={1.5} />
              <Tooltip contentStyle={{ background: '#0C1220', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: '#fff' }} />
              <Legend wrapperStyle={{ color: '#8C9BAE', fontSize: 12 }} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6"
        >
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#86BC25] mb-1">Gap Priority Matrix</p>
          <h3 className="text-base font-bold text-white mb-4">Impact vs Effort</h3>
          <GapPriorityMatrix gaps={a.gaps} />
        </motion.div>
      </div>

      {/* Heatmap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6"
      >
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#86BC25] mb-1">Clause Compliance</p>
        <h3 className="text-base font-bold text-white mb-4">Heatmap</h3>
        <ClauseHeatmap standards={a.standards} />
      </motion.div>

      {/* Agent Feed + Remediation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6"
        >
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#86BC25] mb-1">Agent Activity</p>
          <h3 className="text-base font-bold text-white mb-4">Recent Agent Actions</h3>
          <AgentActivityFeed />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6"
        >
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#86BC25] mb-1">Remediation Roadmap</p>
          <h3 className="text-base font-bold text-white mb-4">Priority Actions</h3>
          <RemediationTimeline actions={a.remediation.slice(0, 5)} />
        </motion.div>
      </div>
    </div>
  );
}
