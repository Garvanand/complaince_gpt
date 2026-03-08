import { motion } from 'framer-motion';
import { FileText, Download, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { formatDate, getRiskColor } from '../utils/helpers';
import { generateReport } from '../utils/generateReport';
import RemediationTimeline from '../components/reports/RemediationTimeline';
import EvidenceMapper from '../components/EvidenceMapper';

export default function Reports() {
  const navigate = useNavigate();
  const { currentAssessment, loadDemoData } = useAppStore();

  if (!currentAssessment) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <FileText size={48} className="mx-auto mb-4" style={{ color: 'var(--color-text-muted)' }} />
          <h2 className="font-display text-2xl font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>No Reports</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>Complete an assessment to generate compliance reports.</p>
          <div className="flex gap-4 justify-center">
            <button onClick={() => navigate('/assessment')} className="btn-glow flex items-center gap-2">Start Assessment <ArrowRight size={18} /></button>
            <button onClick={loadDemoData} className="btn-ghost">Load Demo</button>
          </div>
        </motion.div>
      </div>
    );
  }

  const a = currentAssessment;

  return (
    <div className="space-y-8">
      {/* Report card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card">
        <div className="flex items-start justify-between mb-6">
          <div>
            <span className="section-label">Latest Report</span>
            <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
              {a.orgProfile.companyName} — Compliance Assessment
            </h2>
            <div className="flex items-center gap-4 mt-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
              <span>{formatDate(a.timestamp)}</span>
              <span>{a.standards.length} Standards</span>
              <span
                className="px-2 py-0.5 rounded-full text-xs font-bold"
                style={{ background: 'rgba(134, 188, 37, 0.15)', color: 'var(--color-accent-500)' }}
              >
                Ready
              </span>
            </div>
          </div>
          <button onClick={() => generateReport(a)} className="btn-glow flex items-center gap-2">
            <Download size={16} /> Download PDF
          </button>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 rounded-xl text-center" style={{ background: 'var(--color-primary-700)' }}>
            <div className="score-display text-2xl font-bold" style={{ color: getRiskColor(a.overallScore) }}>{a.overallScore}%</div>
            <div className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>Overall Score</div>
          </div>
          {a.standards.map((s) => (
            <div key={s.standardCode} className="p-4 rounded-xl text-center" style={{ background: 'var(--color-primary-700)' }}>
              <div className="score-display text-2xl font-bold" style={{ color: getRiskColor(s.overallScore) }}>{s.overallScore}%</div>
              <div className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>{s.standardCode.replace('ISO', 'ISO ')}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Executive Summary */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card">
        <span className="section-label">Executive Summary</span>
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>AI-Generated Narrative</h3>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{a.executiveSummary}</p>
      </motion.div>

      {/* Clause findings */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card">
        <span className="section-label">Clause-Level Findings</span>
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>Detailed Assessment</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                {['Standard', 'Clause', 'Title', 'Score', 'Status', 'Gap'].map((h) => (
                  <th key={h} className="text-left py-3 px-3 text-xs font-semibold uppercase" style={{ color: 'var(--color-text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {a.standards.flatMap((s) =>
                s.clauseScores.map((c, i) => (
                  <tr
                    key={`${s.standardCode}-${c.clauseId}`}
                    className="transition-colors hover:bg-[var(--color-primary-700)]"
                    style={{ borderBottom: '1px solid var(--glass-border)', background: i % 2 === 0 ? 'transparent' : 'rgba(15, 22, 41, 0.3)' }}
                  >
                    <td className="py-2.5 px-3" style={{ color: 'var(--color-text-secondary)' }}>{s.standardCode.replace('ISO', 'ISO ')}</td>
                    <td className="py-2.5 px-3 score-display font-bold" style={{ color: 'var(--color-accent-500)' }}>{c.clauseId}</td>
                    <td className="py-2.5 px-3" style={{ color: 'var(--color-text-primary)' }}>{c.clauseTitle}</td>
                    <td className="py-2.5 px-3">
                      <span className="score-display font-bold" style={{ color: getRiskColor(c.score) }}>{c.score}%</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="text-xs px-2 py-0.5 rounded-full capitalize" style={{ background: `${getRiskColor(c.score)}15`, color: getRiskColor(c.score) }}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 max-w-[200px] truncate" style={{ color: 'var(--color-text-muted)' }}>{c.gap || '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Critical gaps */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card">
        <span className="section-label">Critical Gaps</span>
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>Immediate Attention Required</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {a.gaps.filter((g) => g.impact === 'critical').map((gap) => (
            <div key={gap.id} className="p-4 rounded-xl" style={{ background: 'rgba(255, 71, 87, 0.05)', border: '1px solid rgba(255, 71, 87, 0.2)' }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full" style={{ background: 'rgba(255, 71, 87, 0.2)', color: 'var(--color-risk-critical)' }}>Critical</span>
                <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{gap.standardCode.replace('ISO', 'ISO ')}</span>
              </div>
              <h4 className="text-sm font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>{gap.title}</h4>
              <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{gap.description}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Evidence Mapper */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        <EvidenceMapper />
      </motion.div>

      {/* Remediation roadmap */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card">
        <span className="section-label">Remediation Roadmap</span>
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>Phased Action Plan</h3>
        <RemediationTimeline actions={a.remediation} />
      </motion.div>
    </div>
  );
}
