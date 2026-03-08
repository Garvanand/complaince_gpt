import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, CalendarDays, FileCheck, Clock, ArrowRight } from 'lucide-react';
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

export default function Dashboard() {
  const navigate = useNavigate();
  const { currentAssessment, isDemoMode, loadDemoData } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  if (!currentAssessment) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center"
            style={{ background: 'rgba(0, 195, 137, 0.1)' }}>
            <Shield size={36} style={{ color: 'var(--color-accent-500)' }} />
          </div>
          <h2 className="font-display text-2xl font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>
            No Assessment Yet
          </h2>
          <p className="text-sm mb-6 max-w-md" style={{ color: 'var(--color-text-secondary)' }}>
            Start a new compliance assessment or load demo data to explore the dashboard.
          </p>
          <div className="flex items-center gap-4 justify-center">
            <button onClick={() => navigate('/assessment')} className="btn-glow flex items-center gap-2">
              Start Assessment <ArrowRight size={18} />
            </button>
            <button onClick={loadDemoData} className="btn-ghost flex items-center gap-2">
              Load Demo Data
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const a = currentAssessment;
  const criticalGaps = a.gaps.filter((g) => g.impact === 'critical').length;

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
    <div className="space-y-8">
      {isDemoMode && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card flex items-center gap-3 py-3 px-5"
          style={{ borderColor: 'var(--color-accent-500)', borderWidth: 1 }}
        >
          <span className="text-sm" style={{ color: 'var(--color-accent-400)' }}>
            Demo Mode — Showing sample data for {a.orgProfile.companyName}
          </span>
        </motion.div>
      )}

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card flex items-center gap-6">
          <ComplianceScoreRing score={a.overallScore} maturityLevel={a.overallMaturity} size={120} showMaturity={false} />
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
              Overall Score
            </span>
            <div className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
              Level {a.overallMaturity} — {a.overallMaturityLabel}
            </div>
          </div>
        </div>
        <KPICard title="Standards Assessed" value={a.standards.length} icon={<FileCheck size={20} />} subtitle="Active ISO standards" delay={200} />
        <KPICard title="Critical Gaps" value={criticalGaps} icon={<AlertTriangle size={20} />} color="var(--color-risk-critical)" subtitle="Requires immediate action" delay={400} />
        <KPICard title="Last Assessment" value={0} icon={<CalendarDays size={20} />} subtitle={formatDate(a.timestamp)} delay={600} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card"
        >
          <span className="section-label">Compliance Maturity by Standard</span>
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
            Current vs Target
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="var(--color-primary-600)" />
              <PolarAngleAxis dataKey="standard" tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'var(--color-text-muted)', fontSize: 10 }} />
              <Radar name="Current" dataKey="current" stroke="var(--color-accent-500)" fill="var(--color-accent-500)" fillOpacity={0.2} strokeWidth={2} />
              <Radar name="Target" dataKey="target" stroke="var(--color-text-muted)" fill="none" strokeDasharray="5 5" strokeWidth={1.5} />
              <Tooltip contentStyle={{ background: 'var(--color-primary-700)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'var(--color-text-primary)' }} />
              <Legend wrapperStyle={{ color: 'var(--color-text-secondary)', fontSize: 12 }} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Gap Priority Matrix */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card"
        >
          <span className="section-label">Gap Priority Matrix</span>
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
            Impact vs Effort
          </h3>
          <GapPriorityMatrix gaps={a.gaps} />
        </motion.div>
      </div>

      {/* Heatmap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card"
      >
        <span className="section-label">Clause-by-Clause Compliance</span>
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
          Heatmap
        </h3>
        <ClauseHeatmap standards={a.standards} />
      </motion.div>

      {/* Agent Feed + Remediation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card"
        >
          <span className="section-label">Agent Activity</span>
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
            Recent Agent Actions
          </h3>
          <AgentActivityFeed />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="glass-card"
        >
          <span className="section-label">Remediation Roadmap</span>
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
            Priority Actions
          </h3>
          <RemediationTimeline actions={a.remediation.slice(0, 5)} />
        </motion.div>
      </div>
    </div>
  );
}
