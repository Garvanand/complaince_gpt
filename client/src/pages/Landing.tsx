import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ArrowRight, BarChart3, Bot, CheckCircle2, ChevronRight, Cog, FileText, Shield, Target, Upload } from 'lucide-react';

const standards = [
  { code: 'ISO 37001', name: 'Anti-bribery', focus: 'Controls for bribery prevention, speak-up channels, third-party due diligence, and investigation readiness.', clauses: 33, color: 'var(--blue-700)' },
  { code: 'ISO 37301', name: 'Compliance management', focus: 'Obligation mapping, governance oversight, training programs, and compliance operations.', clauses: 28, color: 'var(--green)' },
  { code: 'ISO 27001', name: 'Information security', focus: 'Security governance, risk treatment, control implementation, and audit defensibility.', clauses: 24, color: 'var(--chart-2)' },
  { code: 'ISO 9001', name: 'Quality management', focus: 'Process discipline, continual improvement, service quality, and operational consistency.', clauses: 28, color: 'var(--chart-5)' },
];

const valuePillars = [
  {
    title: 'One evidence pack, multiple standards',
    desc: 'Assess a shared governance document set across ISO 37001, 37301, 27001, and 9001 without running four disconnected workstreams.',
  },
  {
    title: 'Explainable AI, not black-box scoring',
    desc: 'AI agents map evidence to clauses, surface missing controls, and explain why scores move so compliance teams can trust the output.',
  },
  {
    title: 'From finding to remediation in one flow',
    desc: 'The platform does not stop at gap detection. It prioritizes risks, models uplift, and generates audit-ready outputs for action.',
  },
];

const steps = [
  { icon: Upload, step: 'Step 1', title: 'Upload governance documents', desc: 'Bring policies, procedures, registers, committee papers, and supporting evidence into one governed workspace.' },
  { icon: Bot, step: 'Step 2', title: 'AI agents analyze ISO compliance', desc: 'Specialized agents interpret evidence, map it to clauses, validate sufficiency, and score readiness across selected standards.' },
  { icon: AlertTriangle, step: 'Step 3', title: 'Identify gaps and risks', desc: 'The platform highlights weak controls, missing evidence, clause exposure, and the issues most likely to slow certification or audit confidence.' },
  { icon: Target, step: 'Step 4', title: 'Generate remediation roadmap', desc: 'ComplianceGPT turns findings into prioritized remediation actions with ownership, effort estimates, and phased execution guidance.' },
  { icon: FileText, step: 'Step 5', title: 'Produce audit-ready compliance reports', desc: 'Generate executive summaries, clause findings, policy outputs, and reports that are ready for audit, board, and control-owner review.' },
];

const previewScores = [
  { code: 'ISO 37001', score: 61, color: 'var(--blue-700)' },
  { code: 'ISO 37301', score: 68, color: 'var(--green)' },
  { code: 'ISO 27001', score: 58, color: 'var(--chart-2)' },
  { code: 'ISO 9001', score: 74, color: 'var(--chart-5)' },
];

const heroSignals = [
  'Multi-standard clause mapping from a single upload set',
  'AI copilot explanations for scores, gaps, and next actions',
  'Readiness scoring, remediation sequencing, and audit-ready reporting',
];

const copilotQuestions = [
  'Why is my ISO 37001 score low?',
  'What should we fix first?',
  'Summarize my compliance report',
];

const analyticsViews = [
  { icon: BarChart3, title: 'Compliance maturity', desc: 'Track current posture by standard, identify weak domains, and see the overall readiness trend.' },
  { icon: AlertTriangle, title: 'Clause risk exposure', desc: 'Surface the clauses and control areas creating the highest operational and audit pressure.' },
  { icon: Target, title: 'Remediation priorities', desc: 'Rank quick wins versus strategic fixes using severity, effort, and expected score uplift.' },
  { icon: Cog, title: 'Benchmark comparisons', desc: 'Compare internal posture against sector expectations and understand where management attention is most needed.' },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-shell">
      <nav className="landing-nav">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'linear-gradient(135deg, var(--teal), var(--green))' }} />
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, color: 'var(--slate-900)' }}>ComplianceGPT</div>
        </div>

        <div className="landing-links" style={{ alignItems: 'center' }}>
          <a href="#how-it-works" style={{ color: 'var(--slate-600)', textDecoration: 'none', fontWeight: 600 }}>How it works</a>
          <a href="#copilot" style={{ color: 'var(--slate-600)', textDecoration: 'none', fontWeight: 600 }}>Copilot</a>
          <a href="#analytics" style={{ color: 'var(--slate-600)', textDecoration: 'none', fontWeight: 600 }}>Analytics</a>
          <a href="#standards" style={{ color: 'var(--slate-600)', textDecoration: 'none', fontWeight: 600 }}>Standards</a>
          <button onClick={() => navigate('/dashboard')} className="btn btn-primary">Launch app</button>
        </div>
      </nav>

      <section className="landing-hero">
        <div className="landing-container landing-hero-grid">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <span className="landing-eyebrow">
              <Shield size={14} /> AI-powered multi-standard compliance intelligence
            </span>

            <h1 className="landing-title">
              AI-Powered ISO
              <br />
              Compliance Intelligence
            </h1>

            <p className="landing-copy">
              Automatically assess governance readiness, detect gaps, and generate remediation plans across multiple ISO standards using AI agents.
            </p>

            <p className="landing-copy landing-copy-secondary">
              Upload policies and governance documents. ComplianceGPT analyzes them against ISO 37001, 37301, 27001, and 9001 frameworks to produce readiness scores, risk insights, and remediation roadmaps.
            </p>

            <div className="landing-actions">
              <button onClick={() => navigate('/assessment')} className="btn btn-primary">Start assessment <ArrowRight size={16} /></button>
              <button onClick={() => navigate('/dashboard')} className="btn btn-secondary">View enterprise analytics</button>
            </div>

            <div className="landing-proof-row" style={{ marginTop: 22 }}>
              {heroSignals.map((signal) => (
                <div key={signal} className="landing-proof-card">
                  <CheckCircle2 size={14} />
                  <span>{signal}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="landing-preview">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 18 }}>
              <div>
                <div className="summary-stat-label" style={{ color: 'var(--blue-700)' }}>Assessment outcome preview</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--slate-900)', marginTop: 4 }}>Multi-standard readiness snapshot</div>
                <div className="summary-stat-copy">One upload set translated into scores, risks, and actions for enterprise stakeholders.</div>
              </div>
              <Shield size={28} style={{ color: 'var(--blue-700)' }} />
            </div>

            <div className="landing-score-grid">
              {previewScores.map((item, index) => (
                <motion.div
                  key={item.code}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18 + index * 0.08 }}
                  className="landing-card"
                  style={{ padding: 18 }}
                >
                  <div className="summary-stat-label" style={{ color: item.color }}>{item.code}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 800, color: item.color, lineHeight: 1, marginTop: 8 }}>{item.score}%</div>
                  <div style={{ height: 8, borderRadius: 999, background: 'var(--slate-100)', overflow: 'hidden', marginTop: 14 }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${item.score}%` }} transition={{ delay: 0.5 + index * 0.08, duration: 0.8 }} style={{ height: '100%', borderRadius: 999, background: item.color }} />
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="landing-preview-list">
              <div className="landing-preview-item">
                <div className="landing-preview-item-label">AI finding</div>
                <div className="landing-preview-item-copy">Third-party due diligence and whistleblower controls are suppressing ISO 37001 readiness.</div>
              </div>
              <div className="landing-preview-item">
                <div className="landing-preview-item-label">Priority action</div>
                <div className="landing-preview-item-copy">Fix top training and speak-up gaps first to raise cross-standard coverage with the fastest effort-to-impact ratio.</div>
              </div>
              <div className="landing-preview-item">
                <div className="landing-preview-item-label">Executive output</div>
                <div className="landing-preview-item-copy">Generate a board-ready summary, clause findings register, and phased remediation roadmap in the same workflow.</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="landing-section">
        <div className="landing-container">
          <div style={{ marginBottom: 28 }}>
            <div className="section-label">Product differentiation</div>
            <h2 className="enterprise-hero-title" style={{ marginTop: 10, marginBottom: 0 }}>Why ComplianceGPT stands out</h2>
            <p className="enterprise-hero-copy landing-section-lead" style={{ marginTop: 10 }}>Designed for enterprise compliance teams and obvious enough for judges to understand in under a minute.</p>
          </div>

          <div className="landing-section-grid">
            {valuePillars.map((item, index) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.06 }} className="landing-feature">
                <div className="landing-kicker">Differentiator {index + 1}</div>
                <div className="action-card-title" style={{ marginTop: 10 }}>{item.title}</div>
                <div className="action-card-copy" style={{ marginTop: 10 }}>{item.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="landing-section">
        <div className="landing-container">
          <div style={{ marginBottom: 28 }}>
            <div className="section-label">How it works</div>
            <h2 className="enterprise-hero-title" style={{ marginTop: 10, marginBottom: 0 }}>A guided workflow from document upload to audit-ready output</h2>
            <p className="enterprise-hero-copy landing-section-lead" style={{ marginTop: 10 }}>The product narrative is simple: upload evidence, let AI do the heavy mapping, then act on the findings with confidence.</p>
          </div>

          <div className="landing-step-grid">
            {steps.map((item, index) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} className="landing-feature">
                <div className="landing-step-top">
                  <div className="landing-step-index">{item.step}</div>
                </div>
                <div style={{ width: 44, height: 44, borderRadius: 16, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, var(--teal), var(--green))', color: 'white', marginBottom: 16 }}>
                  <item.icon size={20} />
                </div>
                <div className="action-card-title">{item.title}</div>
                <div className="action-card-copy" style={{ marginTop: 8 }}>{item.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="copilot" className="landing-section">
        <div className="landing-container">
          <div style={{ marginBottom: 28 }}>
            <div className="section-label">AI Compliance Copilot</div>
            <h2 className="enterprise-hero-title" style={{ marginTop: 10, marginBottom: 0 }}>Ask compliance questions in plain language</h2>
            <p className="enterprise-hero-copy landing-section-lead" style={{ marginTop: 10 }}>The copilot explains scores, prioritizes fixes, and summarizes reports so executives and control owners do not need to interpret raw clause tables on their own.</p>
          </div>

          <div className="landing-split-grid">
            <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="landing-feature">
              <div className="landing-kicker">Ask questions like</div>
              <div className="landing-question-list">
                {copilotQuestions.map((question) => (
                  <div key={question} className="landing-question-chip">
                    <Bot size={16} />
                    <span>{question}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.08 }} className="landing-preview landing-preview-copilot">
              <div className="landing-kicker">Copilot response style</div>
              <div className="action-card-title" style={{ marginTop: 10 }}>Clear answers tied to evidence and next actions</div>
              <div className="action-card-copy" style={{ marginTop: 10 }}>
                ComplianceGPT explains why a score is low, which missing controls matter most, what should be fixed first, and how remediation will change readiness over time.
              </div>
              <div className="landing-preview-list" style={{ marginTop: 18 }}>
                <div className="landing-preview-item">
                  <div className="landing-preview-item-label">Why is the score low?</div>
                  <div className="landing-preview-item-copy">Insufficient due diligence evidence, no active whistleblower mechanism, and incomplete risk assessment controls are suppressing compliance maturity.</div>
                </div>
                <div className="landing-preview-item">
                  <div className="landing-preview-item-label">What should we fix first?</div>
                  <div className="landing-preview-item-copy">Start with high-severity, cross-standard actions like training, speak-up channels, and risk assessment because they improve multiple frameworks at once.</div>
                </div>
                <div className="landing-preview-item">
                  <div className="landing-preview-item-label">Can you summarize the report?</div>
                  <div className="landing-preview-item-copy">Yes. The copilot converts technical findings into board-friendly narratives, control-owner tasks, and remediation summaries.</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="analytics" className="landing-section">
        <div className="landing-container">
          <div style={{ marginBottom: 28 }}>
            <div className="section-label">Enterprise analytics</div>
            <h2 className="enterprise-hero-title" style={{ marginTop: 10, marginBottom: 0 }}>Dashboards built for enterprise decision-making</h2>
            <p className="enterprise-hero-copy landing-section-lead" style={{ marginTop: 10 }}>The analytics workspace is not cosmetic. It helps leadership understand compliance maturity, clause exposure, and where remediation investment will matter most.</p>
          </div>

          <div className="landing-section-grid">
            {analyticsViews.map((item, index) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.06 }} className="landing-feature">
                <div style={{ width: 44, height: 44, borderRadius: 16, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'var(--blue-50)', color: 'var(--blue-700)', marginBottom: 16 }}>
                  <item.icon size={20} />
                </div>
                <div className="action-card-title">{item.title}</div>
                <div className="action-card-copy" style={{ marginTop: 8 }}>{item.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="standards" className="landing-section">
        <div className="landing-container">
          <div style={{ marginBottom: 28 }}>
            <div className="section-label">Standards coverage</div>
            <h2 className="enterprise-hero-title" style={{ marginTop: 10, marginBottom: 0 }}>Support for the standards enterprise teams care about most</h2>
            <p className="enterprise-hero-copy landing-section-lead" style={{ marginTop: 10 }}>ComplianceGPT highlights how one governance environment performs across anti-bribery, compliance management, security, and quality frameworks.</p>
          </div>

          <div className="landing-mapping-grid">
            {standards.map((standard, index) => (
              <motion.div key={standard.code} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.06 }} className="landing-standard">
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
                  <div>
                    <div className="summary-stat-label" style={{ color: standard.color }}>{standard.code}</div>
                    <div className="action-card-title" style={{ marginTop: 8 }}>{standard.name}</div>
                    <div className="action-card-copy" style={{ marginTop: 8 }}>{standard.focus}</div>
                  </div>
                  <span className="badge badge-pending">{standard.clauses} clauses</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 18, color: 'var(--blue-700)', fontSize: 13, fontWeight: 700 }}>
                  Multi-standard assessment ready <ChevronRight size={14} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-section">
        <div className="landing-container">
          <div className="landing-cta">
            <div className="section-label" style={{ color: 'rgba(255,255,255,0.7)' }}>Launch readiness</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(34px, 4vw, 52px)', lineHeight: 1.05, marginTop: 12 }}>Start your compliance assessment in minutes.</h2>
            <p style={{ marginTop: 14, maxWidth: 720, color: 'rgba(255,255,255,0.76)', fontSize: 16, lineHeight: 1.8 }}>
              Upload governance evidence, generate multi-standard readiness intelligence, and give enterprise stakeholders a clear remediation path without waiting for a manual review cycle.
            </p>
            <div className="landing-actions" style={{ marginTop: 24 }}>
              <button onClick={() => navigate('/assessment')} className="btn btn-primary">Start your compliance assessment <ArrowRight size={16} /></button>
              <button onClick={() => navigate('/dashboard')} className="btn btn-secondary">Open enterprise dashboard</button>
            </div>
          </div>

          <div className="landing-footer">
            ComplianceGPT | AI-powered ISO compliance intelligence for enterprise governance teams.
          </div>
        </div>
      </section>
    </div>
  );
}