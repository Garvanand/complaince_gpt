import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  LineChart, Line, Legend, PieChart, Pie, Cell,
} from 'recharts';
import { useAppStore } from '../store/useAppStore';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { historicalTrend, industryBenchmarks } from '../data/demo-data';

const gapDistribution = [
  { name: 'Process', value: 6, color: '#FF6B35' },
  { name: 'Training', value: 2, color: '#FFD32A' },
  { name: 'Technology', value: 1, color: '#4A90FF' },
  { name: 'Documentation', value: 1, color: '#00E5A0' },
  { name: 'Policy', value: 2, color: '#FF4757' },
];

const maturityStackData = [
  { standard: 'ISO 37001', level1: 12, level2: 25, level3: 17, level4: 0, level5: 0 },
  { standard: 'ISO 37301', level1: 8, level2: 16, level3: 30, level4: 7, level5: 0 },
  { standard: 'ISO 27001', level1: 15, level2: 22, level3: 18, level4: 3, level5: 0 },
  { standard: 'ISO 9001', level1: 5, level2: 10, level3: 35, level4: 20, level5: 4 },
];

const tooltipStyle = {
  contentStyle: {
    background: 'var(--color-primary-700)',
    border: '1px solid var(--glass-border)',
    borderRadius: '12px',
    color: 'var(--color-text-primary)',
    fontSize: 12,
  },
};

export default function Analytics() {
  const navigate = useNavigate();
  const { currentAssessment, loadDemoData } = useAppStore();

  if (!currentAssessment) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="font-display text-2xl font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>No Data Available</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>Complete an assessment or load demo data to view analytics.</p>
          <div className="flex gap-4 justify-center">
            <button onClick={() => navigate('/assessment')} className="btn-glow flex items-center gap-2">Start Assessment <ArrowRight size={18} /></button>
            <button onClick={loadDemoData} className="btn-ghost">Load Demo</button>
          </div>
        </motion.div>
      </div>
    );
  }

  const benchmarkData = currentAssessment.standards.map((s) => ({
    standard: s.standardCode.replace('ISO', 'ISO '),
    yours: s.overallScore,
    benchmark: industryBenchmarks[s.standardCode] || 70,
  }));

  return (
    <div className="space-y-8">
      {/* Row 1: Maturity stacked bars */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card">
        <span className="section-label">Standards Coverage</span>
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>Maturity Level Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={maturityStackData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-primary-600)" />
            <XAxis dataKey="standard" tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} />
            <YAxis tick={{ fill: 'var(--color-text-muted)', fontSize: 10 }} />
            <Tooltip {...tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 11, color: 'var(--color-text-secondary)' }} />
            <Bar dataKey="level1" stackId="a" fill="#FF4757" name="Level 1" radius={[0, 0, 0, 0]} />
            <Bar dataKey="level2" stackId="a" fill="#FF6B35" name="Level 2" />
            <Bar dataKey="level3" stackId="a" fill="#FFD32A" name="Level 3" />
            <Bar dataKey="level4" stackId="a" fill="#00C389" name="Level 4" />
            <Bar dataKey="level5" stackId="a" fill="#00E5A0" name="Level 5" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Row 2: Trend + Gap donut */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card">
          <span className="section-label">Compliance Trend</span>
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>Score Over Time</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={historicalTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-primary-600)" />
              <XAxis dataKey="month" tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fill: 'var(--color-text-muted)', fontSize: 10 }} />
              <Tooltip {...tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11, color: 'var(--color-text-secondary)' }} />
              <Line type="monotone" dataKey="ISO37001" stroke="#FF6B35" strokeWidth={2} dot={{ r: 3 }} name="ISO 37001" />
              <Line type="monotone" dataKey="ISO37301" stroke="#00C389" strokeWidth={2} dot={{ r: 3 }} name="ISO 37301" />
              <Line type="monotone" dataKey="ISO27001" stroke="#4A90FF" strokeWidth={2} dot={{ r: 3 }} name="ISO 27001" />
              <Line type="monotone" dataKey="ISO9001" stroke="#FFD32A" strokeWidth={2} dot={{ r: 3 }} name="ISO 9001" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card">
          <span className="section-label">Gap Distribution</span>
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>By Category</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={gapDistribution}
                cx="50%" cy="50%"
                innerRadius={70} outerRadius={100}
                paddingAngle={3}
                dataKey="value"
                label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {gapDistribution.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip {...tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Row 3: Benchmark comparison */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card">
        <span className="section-label">Industry Benchmark</span>
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>Your Score vs Industry Average</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={benchmarkData} barGap={8}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-primary-600)" />
            <XAxis dataKey="standard" tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} />
            <YAxis domain={[0, 100]} tick={{ fill: 'var(--color-text-muted)', fontSize: 10 }} />
            <Tooltip {...tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 11, color: 'var(--color-text-secondary)' }} />
            <Bar dataKey="yours" fill="var(--color-accent-500)" name="Your Score" radius={[4, 4, 0, 0]} />
            <Bar dataKey="benchmark" fill="var(--color-primary-600)" name="Industry Avg" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Row 4: Maturity Progression Simulator */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp size={18} style={{ color: 'var(--color-accent-500)' }} />
          <span className="section-label">Innovative Feature</span>
        </div>
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>Maturity Progression Simulator</h3>
        <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
          Simulate how your compliance scores will improve as you implement remediation phases.
        </p>
        <MaturitySimulator standards={currentAssessment.standards} />
      </motion.div>

      {/* Row 5: Cross-standard overlaps */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card">
        <span className="section-label">Cross-Standard Analysis</span>
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>Clause Overlap Opportunities</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { pair: 'ISO 37001 ↔ ISO 37301', overlaps: 14, savings: '23 person-days' },
            { pair: 'ISO 37001 ↔ ISO 27001', overlaps: 8, savings: '12 person-days' },
            { pair: 'ISO 37301 ↔ ISO 9001', overlaps: 11, savings: '16 person-days' },
          ].map((item) => (
            <div key={item.pair} className="p-4 rounded-xl" style={{ background: 'var(--color-primary-700)', border: '1px solid var(--glass-border)' }}>
              <div className="text-sm font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>{item.pair}</div>
              <div className="score-display text-2xl font-bold" style={{ color: 'var(--color-accent-500)' }}>{item.overlaps}</div>
              <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>overlapping clauses</div>
              <div className="text-xs mt-2" style={{ color: 'var(--color-accent-400)' }}>Potential savings: {item.savings}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

/* Maturity Progression Simulator */
function MaturitySimulator({ standards }: { standards: { standardCode: string; overallScore: number }[] }) {
  const [phase, setPhase] = useState(0);
  const phases = ['Current', 'Phase 1 (+30d)', 'Phase 2 (+90d)', 'Phase 3 (+180d)'];
  const improvements = [0, 12, 22, 35];

  const simData = standards.map((s) => ({
    standard: s.standardCode.replace('ISO', 'ISO '),
    score: Math.min(100, s.overallScore + improvements[phase]),
  }));

  const overallSim = Math.round(simData.reduce((sum, d) => sum + d.score, 0) / simData.length);

  return (
    <div>
      <div className="flex gap-2 mb-6 flex-wrap">
        {phases.map((p, i) => (
          <button
            key={p}
            onClick={() => setPhase(i)}
            className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={{
              background: phase === i ? 'rgba(0, 195, 137, 0.15)' : 'var(--color-primary-700)',
              border: `1px solid ${phase === i ? 'var(--color-accent-500)' : 'var(--glass-border)'}`,
              color: phase === i ? 'var(--color-accent-400)' : 'var(--color-text-secondary)',
            }}
          >
            {p}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="p-4 rounded-xl text-center" style={{ background: 'rgba(0, 195, 137, 0.1)', border: '1px solid var(--color-accent-500)' }}>
          <div className="text-3xl font-bold score-display" style={{ color: 'var(--color-accent-500)' }}>{overallSim}%</div>
          <div className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>Projected Overall</div>
        </div>
        {simData.map((d) => (
          <div key={d.standard} className="p-4 rounded-xl text-center" style={{ background: 'var(--color-primary-700)', border: '1px solid var(--glass-border)' }}>
            <div className="text-2xl font-bold score-display" style={{ color: d.score >= 75 ? 'var(--color-accent-400)' : d.score >= 60 ? '#FFD32A' : '#FF6B35' }}>
              {d.score}%
            </div>
            <div className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>{d.standard}</div>
          </div>
        ))}
      </div>
      {phase > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 p-3 rounded-xl text-sm" style={{ background: 'rgba(0, 195, 137, 0.05)', border: '1px solid rgba(0, 195, 137, 0.1)', color: 'var(--color-accent-400)' }}>
          ↑ Projected improvement of <strong>+{improvements[phase]}%</strong> after completing {phases[phase]} remediation actions
        </motion.div>
      )}
    </div>
  );
}
