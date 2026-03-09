import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BarChart3, Bot, CheckCircle2, ChevronRight, Cog, FileText, Shield, Upload } from 'lucide-react';

const standards = [
  { code: 'ISO 37001', name: 'Anti-Bribery Management', focus: 'Bribery prevention, speaking-up, and third-party oversight', clauses: 33, color: 'var(--blue-700)' },
  { code: 'ISO 37301', name: 'Compliance Management', focus: 'Obligations management, governance, and culture', clauses: 28, color: 'var(--green)' },
  { code: 'ISO 27001', name: 'Information Security', focus: 'Security governance, risk treatment, and operations', clauses: 24, color: 'var(--chart-2)' },
  { code: 'ISO 9001', name: 'Quality Management', focus: 'Process excellence, control discipline, and improvement', clauses: 28, color: 'var(--chart-5)' },
];

const steps = [
  { icon: Upload, title: 'Ingest evidence', desc: 'Upload policies, procedures, registers, and committee materials in a secure workspace.' },
  { icon: Bot, title: 'Run orchestration', desc: 'Specialized agents parse evidence, map clauses, validate sufficiency, and score readiness.' },
  { icon: FileText, title: 'Act on outcomes', desc: 'Receive executive summaries, risk exposure views, and phased remediation plans.' },
];

const genwMapping = [
  { from: 'RealmAI', to: 'Document intelligence', icon: FileText, desc: 'RAG-powered retrieval for evidence and policy context.' },
  { from: 'Agent Builder', to: 'Multi-agent orchestration', icon: Bot, desc: 'Visual workflow design for compliance assessments and follow-through.' },
  { from: 'Playground', to: 'Analytics workspace', icon: BarChart3, desc: 'Interactive executive views, heatmaps, and trend analysis.' },
  { from: 'App Maker', to: 'Client portal', icon: Cog, desc: 'Rapid deployment of a secure enterprise-facing compliance application.' },
];

const previewScores = [
  { code: 'ISO 37001', score: 87, color: 'var(--blue-700)' },
  { code: 'ISO 37301', score: 92, color: 'var(--green)' },
  { code: 'ISO 27001', score: 78, color: 'var(--chart-2)' },
  { code: 'ISO 9001', score: 84, color: 'var(--chart-5)' },
];

const stats = [
  { value: '500+', label: 'Organizations assessed' },
  { value: '37+', label: 'Standards covered' },
  { value: '80%', label: 'Faster assessments' },
  { value: '<2hrs', label: 'Average duration' },
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
          <a href="#workflow" style={{ color: 'var(--slate-600)', textDecoration: 'none', fontWeight: 600 }}>Workflow</a>
          <a href="#standards" style={{ color: 'var(--slate-600)', textDecoration: 'none', fontWeight: 600 }}>Standards</a>
          <a href="#platform" style={{ color: 'var(--slate-600)', textDecoration: 'none', fontWeight: 600 }}>Platform</a>
          <button onClick={() => navigate('/dashboard')} className="btn btn-primary">Launch app</button>
        </div>
      </nav>

      <section className="landing-hero">
        <div className="landing-container landing-hero-grid">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <span className="landing-eyebrow">
              <Shield size={14} /> Enterprise compliance intelligence built on GenW.AI
            </span>

            <h1 className="landing-title">
              From policy evidence
              <br />
              to executive proof.
            </h1>

            <p className="landing-copy">
              ComplianceGPT turns uploaded governance material into multi-standard readiness intelligence, gap analysis,
              remediation plans, and board-ready reporting across ISO 37001, 37301, 27001, and 9001.
            </p>

            <div className="landing-actions">
              <button onClick={() => navigate('/assessment')} className="btn btn-primary">Start assessment <ArrowRight size={16} /></button>
              <button onClick={() => navigate('/dashboard')} className="btn btn-secondary">View analytics workspace</button>
            </div>

            <div className="landing-pill-row" style={{ marginTop: 22 }}>
              {standards.map((standard) => (
                <span key={standard.code} className="badge badge-pending" style={{ background: `${standard.color}12`, color: standard.color, border: `1px solid ${standard.color}26` }}>
                  <CheckCircle2 size={13} /> {standard.code}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="landing-preview">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 18 }}>
              <div>
                <div className="summary-stat-label" style={{ color: 'var(--blue-700)' }}>Live preview</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--slate-900)', marginTop: 4 }}>Portfolio readiness snapshot</div>
                <div className="summary-stat-copy">Sample multi-standard assessment across governance, compliance, and security domains.</div>
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
          </motion.div>
        </div>
      </section>

      <section className="landing-section">
        <div className="landing-container">
          <div className="landing-stat-grid">
            {stats.map((item, index) => (
              <motion.div key={item.label} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.06 }} className="landing-card" style={{ padding: 22, textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 800, color: 'var(--slate-900)', lineHeight: 1 }}>{item.value}</div>
                <div className="summary-stat-copy" style={{ marginTop: 8 }}>{item.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="workflow" className="landing-section">
        <div className="landing-container">
          <div style={{ marginBottom: 28 }}>
            <div className="section-label">Workflow</div>
            <h2 className="enterprise-hero-title" style={{ marginTop: 10, marginBottom: 0 }}>Three stages from intake to remediation</h2>
            <p className="enterprise-hero-copy" style={{ marginTop: 10 }}>A single workspace for evidence intake, AI scoring, and post-assessment execution.</p>
          </div>

          <div className="landing-section-grid">
            {steps.map((item, index) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} className="landing-feature">
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

      <section id="standards" className="landing-section">
        <div className="landing-container">
          <div style={{ marginBottom: 28 }}>
            <div className="section-label">Standards coverage</div>
            <h2 className="enterprise-hero-title" style={{ marginTop: 10, marginBottom: 0 }}>One evidence pack, multiple assurance views</h2>
            <p className="enterprise-hero-copy" style={{ marginTop: 10 }}>Cross-standard mappings reduce duplicate work and surface where controls can be reused.</p>
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
                  Explore coverage <ChevronRight size={14} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="platform" className="landing-section">
        <div className="landing-container">
          <div style={{ marginBottom: 28 }}>
            <div className="section-label">Platform integration</div>
            <h2 className="enterprise-hero-title" style={{ marginTop: 10, marginBottom: 0 }}>Built to land naturally inside GenW.AI</h2>
            <p className="enterprise-hero-copy" style={{ marginTop: 10 }}>The product maps directly onto Deloitte’s internal AI platform capabilities rather than layering on disconnected tools.</p>
          </div>

          <div className="landing-mapping-grid">
            {genwMapping.map((item, index) => (
              <motion.div key={item.from} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.06 }} className="landing-mapping">
                <div style={{ display: 'flex', gap: 14 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 14, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'var(--blue-50)', color: 'var(--blue-700)', flexShrink: 0 }}>
                    <item.icon size={18} />
                  </div>
                  <div>
                    <div className="summary-stat-label" style={{ color: 'var(--blue-700)' }}>GenW {item.from}</div>
                    <div className="action-card-title" style={{ marginTop: 8 }}>{item.to}</div>
                    <div className="action-card-copy" style={{ marginTop: 8 }}>{item.desc}</div>
                  </div>
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
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(34px, 4vw, 52px)', lineHeight: 1.05, marginTop: 12 }}>Move from policy documents to defensible compliance intelligence.</h2>
            <p style={{ marginTop: 14, maxWidth: 720, color: 'rgba(255,255,255,0.76)', fontSize: 16, lineHeight: 1.8 }}>
              Start a guided assessment, populate the dashboard with live posture data, and use the copilot to explain gaps, obligations, and remediation priorities.
            </p>
            <div className="landing-actions" style={{ marginTop: 24 }}>
              <button onClick={() => navigate('/assessment')} className="btn btn-primary">Start your assessment <ArrowRight size={16} /></button>
              <button onClick={() => navigate('/dashboard')} className="btn btn-secondary">Open executive dashboard</button>
            </div>
          </div>

          <div className="landing-footer">
            ComplianceGPT | From policy to proof | Enterprise governance analytics built for GenW.AI.
          </div>
        </div>
      </section>
    </div>
  );
}