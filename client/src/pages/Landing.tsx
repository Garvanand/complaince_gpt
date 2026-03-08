import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Upload, Bot, FileText, Shield, BarChart3, Cog, ChevronDown, CheckCircle2, ChevronRight } from 'lucide-react';

const standards = [
  { code: 'ISO 37001', name: 'Anti-Bribery Management', focus: 'Bribery Prevention & Detection', clauses: 33, color: '#0076A8' },
  { code: 'ISO 37301', name: 'Compliance Management', focus: 'Regulatory Compliance', clauses: 28, color: '#86BC25' },
  { code: 'ISO 27001', name: 'Information Security', focus: 'Data Protection & Cybersecurity', clauses: 24, color: '#009CDE' },
  { code: 'ISO 9001', name: 'Quality Management', focus: 'Process Excellence & QA', clauses: 28, color: '#5C5C5C' },
];

const steps = [
  { icon: Upload, title: 'Upload Documents', desc: 'Drag & drop your governance policies, procedures, and manuals in PDF or DOCX format.' },
  { icon: Bot, title: 'AI Agents Analyze', desc: 'Seven specialized agents simultaneously assess your documents against ISO clause requirements.' },
  { icon: FileText, title: 'Receive Intelligence', desc: 'Get detailed compliance scores, gap analysis, maturity levels, and remediation roadmaps.' },
];

const genwMapping = [
  { from: 'RealmAI', to: 'Document Intelligence', icon: FileText, desc: 'RAG-powered policy knowledge base' },
  { from: 'Agent Builder', to: 'Multi-Agent Orchestration', icon: Bot, desc: 'Visual agent workflow design' },
  { from: 'Playground', to: 'Analytics Dashboard', icon: BarChart3, desc: 'No-code interactive dashboards' },
  { from: 'App Maker', to: 'Client Portal', icon: Cog, desc: 'Rapid application deployment' },
];

const previewScores = [
  { code: 'ISO 37001', score: 87, color: '#0076A8' },
  { code: 'ISO 37301', score: 92, color: '#86BC25' },
  { code: 'ISO 27001', score: 78, color: '#009CDE' },
  { code: 'ISO 9001', score: 84, color: '#5C5C5C' },
];

const stats = [
  { value: '500+', label: 'Organizations Assessed' },
  { value: '37+', label: 'Standards Covered' },
  { value: '80%', label: 'Faster Assessments' },
  { value: '<2hrs', label: 'Average Duration' },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen overflow-y-auto" style={{ background: '#FFFFFF' }}>

      {/* ── Black Top Nav ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        height: 56, background: '#000000',
        display: 'flex', alignItems: 'center', padding: '0 40px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 6, height: 6, borderRadius: '50%', background: '#86BC25',
          }} />
          <span style={{
            fontFamily: "'Libre Baskerville', Georgia, serif",
            fontSize: 17, fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.02em',
          }}>
            ComplianceGPT
          </span>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 32, fontSize: 14, fontWeight: 500 }}>
          <a href="#how-it-works" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#FFFFFF'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}>
            How It Works
          </a>
          <a href="#standards" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#FFFFFF'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}>
            Standards
          </a>
          <a href="#platform" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#FFFFFF'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}>
            Platform
          </a>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              background: '#0076A8', color: '#FFFFFF',
              fontWeight: 600, fontSize: 14, padding: '8px 24px',
              borderRadius: 999, border: 'none', cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#005A80'}
            onMouseLeave={e => e.currentTarget.style.background = '#0076A8'}
          >
            Launch App
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        paddingTop: 56, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: 56, left: 0, right: 0, height: 3,
          background: 'linear-gradient(90deg, #86BC25, #0076A8)',
        }} />

        <div style={{
          maxWidth: 1200, margin: '0 auto', padding: '80px 48px',
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center',
          width: '100%',
        }}>
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
              <span style={{
                fontSize: 11, fontWeight: 700, letterSpacing: '0.12em',
                textTransform: 'uppercase', color: '#0076A8',
                background: '#E6F4FA', padding: '4px 12px', borderRadius: 2,
              }}>Built on GenW.AI™</span>
              <span style={{
                fontSize: 11, fontWeight: 700, letterSpacing: '0.12em',
                textTransform: 'uppercase', color: '#5C5C5C',
                background: '#F2F2F2', padding: '4px 12px', borderRadius: 2,
              }}>Hacksplosion 2026</span>
            </div>

            <h1 style={{
              fontFamily: "'Libre Baskerville', Georgia, serif",
              fontSize: 52, lineHeight: 1.12, fontWeight: 400,
              color: '#1A1A1A', marginBottom: 24, letterSpacing: '-0.02em',
            }}>
              AI-Powered<br />
              Multi-Standard<br />
              <span style={{ color: '#0076A8' }}>Governance Intelligence</span>
            </h1>

            <p style={{
              fontSize: 18, lineHeight: 1.7, color: '#5C5C5C',
              maxWidth: 480, marginBottom: 36,
            }}>
              Upload your governance documents. Seven AI agents simultaneously assess compliance
              across ISO 37001, 37301, 27001 & 9001 — delivering instant readiness intelligence.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 40 }}>
              <button
                onClick={() => navigate('/assessment')}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: '#0076A8', color: '#FFFFFF',
                  fontWeight: 600, fontSize: 16, padding: '14px 32px',
                  borderRadius: 999, border: 'none', cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#005A80'}
                onMouseLeave={e => e.currentTarget.style.background = '#0076A8'}
              >
                Start Assessment <ArrowRight size={18} />
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: 'transparent', color: '#2D2D2D',
                  fontWeight: 600, fontSize: 16, padding: '14px 32px',
                  borderRadius: 999, border: '1px solid #C4C4C4', cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#F2F2F2'; e.currentTarget.style.borderColor = '#9E9E9E'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = '#C4C4C4'; }}
              >
                View Demo
              </button>
            </div>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {standards.map(s => (
                <span key={s.code} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  fontSize: 13, fontWeight: 600, color: s.color,
                  padding: '4px 12px', border: `1px solid ${s.color}30`,
                  borderRadius: 2, background: `${s.color}08`,
                }}>
                  <CheckCircle2 size={13} /> {s.code}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
          >
            <div style={{
              background: '#FAFAFA', border: '1px solid #E5E5E5',
              borderRadius: 8, padding: 32, position: 'relative',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#0076A8', marginBottom: 4 }}>
                    Live Preview
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#1A1A1A' }}>Compliance Overview</div>
                  <div style={{ fontSize: 13, color: '#767676' }}>Sample multi-standard assessment</div>
                </div>
                <Shield size={32} style={{ color: '#0076A8', opacity: 0.3 }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                {previewScores.map((s, i) => (
                  <motion.div
                    key={s.code}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    style={{
                      background: '#FFFFFF', border: '1px solid #E5E5E5',
                      borderRadius: 6, padding: 20, textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#767676', marginBottom: 8 }}>
                      {s.code}
                    </div>
                    <div style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 36, fontWeight: 700, color: s.color,
                      lineHeight: 1, marginBottom: 12,
                    }}>
                      {s.score}%
                    </div>
                    <div style={{ height: 3, borderRadius: 2, background: '#E5E5E5', overflow: 'hidden' }}>
                      <motion.div
                        style={{ height: '100%', borderRadius: 2, background: s.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${s.score}%` }}
                        transition={{ delay: 0.8, duration: 1.2, ease: 'easeOut' }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)' }}
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown size={20} color="#9E9E9E" />
        </motion.div>
      </section>

      {/* ── Stats ── */}
      <section style={{ padding: '48px 40px', background: '#F2F2F2', borderTop: '1px solid #E5E5E5', borderBottom: '1px solid #E5E5E5' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32 }}>
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              viewport={{ once: true }}
              style={{ textAlign: 'center' }}
            >
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 36, fontWeight: 700, color: '#1A1A1A', lineHeight: 1, marginBottom: 4,
              }}>{s.value}</div>
              <div style={{ fontSize: 13, color: '#767676', fontWeight: 500 }}>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" style={{ padding: '96px 40px', background: '#FFFFFF' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase',
              color: '#0076A8', marginBottom: 12,
            }}>How It Works</div>
            <h2 style={{
              fontFamily: "'Libre Baskerville', Georgia, serif",
              fontSize: 36, fontWeight: 400, color: '#1A1A1A', lineHeight: 1.2,
            }}>
              Three steps to compliance intelligence
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.12 }}
                viewport={{ once: true }}
                style={{
                  padding: 36, borderTop: '3px solid #0076A8',
                  background: '#FAFAFA', position: 'relative',
                }}
              >
                <div style={{
                  fontSize: 48, fontWeight: 700, color: '#E5E5E5',
                  fontFamily: "'Libre Baskerville', serif",
                  position: 'absolute', top: 16, right: 20, lineHeight: 1,
                }}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div style={{
                  width: 44, height: 44, borderRadius: 4,
                  background: '#0076A8', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 20,
                }}>
                  <step.icon size={20} color="white" />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1A1A1A', marginBottom: 8 }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: 15, lineHeight: 1.6, color: '#5C5C5C' }}>
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Standards ── */}
      <section id="standards" style={{ padding: '96px 40px', background: '#F2F2F2' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase',
              color: '#0076A8', marginBottom: 12,
            }}>Standards Coverage</div>
            <h2 style={{
              fontFamily: "'Libre Baskerville', Georgia, serif",
              fontSize: 36, fontWeight: 400, color: '#1A1A1A', lineHeight: 1.2,
            }}>
              Multi-standard intelligence
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
            {standards.map((s, i) => (
              <motion.div
                key={s.code}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                viewport={{ once: true }}
                style={{
                  background: '#FFFFFF', border: '1px solid #E5E5E5',
                  borderRadius: 6, padding: 28, cursor: 'pointer',
                  transition: 'box-shadow 0.2s, transform 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div>
                    <div style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 20, fontWeight: 700, color: s.color, marginBottom: 2,
                    }}>{s.code}</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A' }}>{s.name}</div>
                  </div>
                  <span style={{
                    fontSize: 12, fontWeight: 700, color: '#767676',
                    fontFamily: "'JetBrains Mono', monospace",
                    background: '#F2F2F2', padding: '4px 10px', borderRadius: 2,
                  }}>{s.clauses} clauses</span>
                </div>
                <p style={{ fontSize: 14, color: '#767676', marginBottom: 12 }}>{s.focus}</p>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  fontSize: 13, fontWeight: 600, color: '#0076A8',
                }}>
                  Explore clauses <ChevronRight size={14} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Platform ── */}
      <section id="platform" style={{ padding: '96px 40px', background: '#FFFFFF' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase',
              color: '#0076A8', marginBottom: 12,
            }}>Platform Integration</div>
            <h2 style={{
              fontFamily: "'Libre Baskerville', Georgia, serif",
              fontSize: 36, fontWeight: 400, color: '#1A1A1A', lineHeight: 1.2, marginBottom: 8,
            }}>
              Built for GenW.AI™
            </h2>
            <p style={{ fontSize: 17, color: '#767676', maxWidth: 500, margin: '0 auto' }}>
              Native deployment on Deloitte's enterprise AI platform
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
            {genwMapping.map((item, i) => (
              <motion.div
                key={item.from}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                viewport={{ once: true }}
                style={{
                  background: '#FAFAFA', border: '1px solid #E5E5E5',
                  borderRadius: 6, padding: 24, display: 'flex', gap: 16, alignItems: 'flex-start',
                }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: 4,
                  background: '#E6F4FA', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <item.icon size={18} color="#0076A8" />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#0076A8' }}>GenW {item.from}</span>
                    <ArrowRight size={12} color="#9E9E9E" />
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#1A1A1A' }}>{item.to}</span>
                  </div>
                  <p style={{ fontSize: 14, color: '#767676', lineHeight: 1.5 }}>{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '96px 40px', background: '#000000' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 style={{
              fontFamily: "'Libre Baskerville', Georgia, serif",
              fontSize: 36, fontWeight: 400, color: '#FFFFFF', lineHeight: 1.2, marginBottom: 16,
            }}>
              Ready to transform compliance?
            </h2>
            <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.6)', marginBottom: 36, maxWidth: 500, margin: '0 auto 36px' }}>
              Join 500+ organizations using AI-powered governance intelligence to go from policy to proof.
            </p>
            <button
              onClick={() => navigate('/assessment')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: '#0076A8', color: '#FFFFFF',
                fontWeight: 600, fontSize: 16, padding: '16px 40px',
                borderRadius: 999, border: 'none', cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#005A80'}
              onMouseLeave={e => e.currentTarget.style.background = '#0076A8'}
            >
              Start Your Assessment <ArrowRight size={18} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        padding: '24px 40px', background: '#000000',
        borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 4 }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#86BC25' }} />
          <span style={{
            fontFamily: "'Libre Baskerville', Georgia, serif",
            fontSize: 14, fontWeight: 700, color: '#FFFFFF',
          }}>ComplianceGPT™</span>
        </div>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
          From Policy to Proof — Built on GenW.AI™ | Hacksplosion 2026
        </p>
      </footer>
    </div>
  );
}
