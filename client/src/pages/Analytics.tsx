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
  { name: 'Process', value: 6, color: '#DD6B20' },
  { name: 'Training', value: 2, color: '#FFD32A' },
  { name: 'Technology', value: 1, color: '#00ABBD' },
  { name: 'Documentation', value: 1, color: '#A8D048' },
  { name: 'Policy', value: 2, color: '#E53E3E' },
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
            <Bar dataKey="level1" stackId="a" fill="#E53E3E" name="Level 1" radius={[0, 0, 0, 0]} />
            <Bar dataKey="level2" stackId="a" fill="#DD6B20" name="Level 2" />
            <Bar dataKey="level3" stackId="a" fill="#FFD32A" name="Level 3" />
            <Bar dataKey="level4" stackId="a" fill="#86BC25" name="Level 4" />
            <Bar dataKey="level5" stackId="a" fill="#A8D048" name="Level 5" radius={[4, 4, 0, 0]} />
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
              <Line type="monotone" dataKey="ISO37001" stroke="#DD6B20" strokeWidth={2} dot={{ r: 3 }} name="ISO 37001" />
              <Line type="monotone" dataKey="ISO37301" stroke="#86BC25" strokeWidth={2} dot={{ r: 3 }} name="ISO 37301" />
              <Line type="monotone" dataKey="ISO27001" stroke="#00ABBD" strokeWidth={2} dot={{ r: 3 }} name="ISO 27001" />
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

/* Maturity Progression Simulator — Gap-based "What If" Analysis */
function MaturitySimulator({ standards }: { standards: { standardCode: string; overallScore: number }[] }) {
  const { currentAssessment } = useAppStore();
  const gaps = currentAssessment?.gaps ?? [];
  const remediations = currentAssessment?.remediation ?? [];
  const [selectedGapIds, setSelectedGapIds] = useState<Set<string>>(new Set());

  const toggleGap = (id: string) => {
    setSelectedGapIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const selectPhase = (phase: 'immediate' | 'short-term' | 'medium-term') => {
    const phaseOrder = { immediate: 1, 'short-term': 2, 'medium-term': 3 };
    const ids = new Set<string>();
    remediations.forEach((r) => {
      if (phaseOrder[r.phase as keyof typeof phaseOrder] <= phaseOrder[phase]) {
        ids.add(r.gapId);
      }
    });
    setSelectedGapIds(ids);
  };

  // Calculate per-standard projected scores
  const gapImpactMap: Record<string, number> = {};
  gaps.forEach((g) => {
    const impactPoints = g.impact === 'critical' ? 8 : g.impact === 'high' ? 5 : g.impact === 'medium' ? 3 : 1;
    const key = g.standardCode;
    if (!gapImpactMap[key]) gapImpactMap[key] = 0;
    if (selectedGapIds.has(g.id)) gapImpactMap[key] += impactPoints;
  });

  const simData = standards.map((s) => ({
    standard: s.standardCode.replace('ISO', 'ISO '),
    code: s.standardCode,
    current: s.overallScore,
    projected: Math.min(100, s.overallScore + (gapImpactMap[s.standardCode] || 0)),
  }));

  const overallCurrent = Math.round(standards.reduce((sum, s) => sum + s.overallScore, 0) / standards.length);
  const overallProjected = Math.round(simData.reduce((sum, d) => sum + d.projected, 0) / simData.length);
  const improvement = overallProjected - overallCurrent;

  return (
    <div>
      {/* Quick phase selectors */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <button onClick={() => setSelectedGapIds(new Set())} className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
          style={{ background: selectedGapIds.size === 0 ? 'rgba(134, 188, 37, 0.15)' : 'var(--color-primary-700)', border: `1px solid ${selectedGapIds.size === 0 ? 'var(--color-accent-500)' : 'var(--glass-border)'}`, color: selectedGapIds.size === 0 ? 'var(--color-accent-400)' : 'var(--color-text-secondary)' }}>
          Current State
        </button>
        {(['immediate', 'short-term', 'medium-term'] as const).map((p) => (
          <button key={p} onClick={() => selectPhase(p)} className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize"
            style={{ background: 'var(--color-primary-700)', border: '1px solid var(--glass-border)', color: 'var(--color-text-secondary)' }}>
            All {p.replace('-', ' ')} fixes
          </button>
        ))}
        <button onClick={() => setSelectedGapIds(new Set(gaps.map((g) => g.id)))} className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
          style={{ background: 'var(--color-primary-700)', border: '1px solid var(--glass-border)', color: 'var(--color-text-secondary)' }}>
          Fix All Gaps
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gap checklist */}
        <div className="lg:col-span-1 max-h-[320px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
          {gaps.map((gap) => {
            const checked = selectedGapIds.has(gap.id);
            const impactColor = gap.impact === 'critical' ? 'var(--color-risk-critical)' : gap.impact === 'high' ? '#DD6B20' : gap.impact === 'medium' ? '#FFD32A' : 'var(--color-accent-400)';
            return (
              <label
                key={gap.id}
                className="flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all"
                style={{
                  background: checked ? 'rgba(134, 188, 37, 0.08)' : 'var(--color-primary-700)',
                  border: `1px solid ${checked ? 'rgba(134, 188, 37, 0.3)' : 'var(--glass-border)'}`,
                }}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleGap(gap.id)}
                  className="mt-0.5 accent-[var(--color-accent-500)]"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold truncate" style={{ color: 'var(--color-text-primary)' }}>{gap.title}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-full" style={{ background: `${impactColor}15`, color: impactColor }}>{gap.impact}</span>
                    <span className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>{gap.standardCode.replace('ISO', 'ISO ')}</span>
                  </div>
                </div>
              </label>
            );
          })}
          {gaps.length === 0 && (
            <p className="text-sm p-4 text-center" style={{ color: 'var(--color-text-muted)' }}>No gaps to simulate</p>
          )}
        </div>

        {/* Projected scores */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
            <div className="p-4 rounded-xl text-center col-span-1" style={{ background: 'rgba(134, 188, 37, 0.1)', border: '1px solid var(--color-accent-500)' }}>
              <div className="text-3xl font-bold score-display" style={{ color: 'var(--color-accent-500)' }}>{overallProjected}%</div>
              <div className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>Projected Overall</div>
            </div>
            {simData.map((d) => (
              <div key={d.standard} className="p-4 rounded-xl text-center" style={{ background: 'var(--color-primary-700)', border: '1px solid var(--glass-border)' }}>
                <div className="text-2xl font-bold score-display" style={{ color: d.projected >= 75 ? 'var(--color-accent-400)' : d.projected >= 60 ? '#FFD32A' : '#DD6B20' }}>
                  {d.projected}%
                </div>
                <div className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>{d.standard}</div>
                {d.projected > d.current && (
                  <div className="text-[10px] mt-0.5" style={{ color: 'var(--color-accent-400)' }}>+{d.projected - d.current}%</div>
                )}
              </div>
            ))}
          </div>

          {/* Progress bars */}
          <div className="space-y-3">
            {simData.map((d) => (
              <div key={d.standard}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span style={{ color: 'var(--color-text-secondary)' }}>{d.standard}</span>
                  <span style={{ color: 'var(--color-text-muted)' }}>{d.current}% → {d.projected}%</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--color-primary-600)' }}>
                  <div className="relative h-full rounded-full">
                    <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${d.projected}%`, background: 'linear-gradient(90deg, var(--color-accent-500), var(--color-accent-400))', transition: 'width 0.5s ease' }} />
                    <div className="absolute inset-y-0 left-0 rounded-full opacity-40" style={{ width: `${d.current}%`, background: 'var(--color-text-muted)' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {improvement > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 p-3 rounded-xl text-sm" style={{ background: 'rgba(134, 188, 37, 0.05)', border: '1px solid rgba(134, 188, 37, 0.1)', color: 'var(--color-accent-400)' }}>
          ↑ Fixing <strong>{selectedGapIds.size}</strong> gap{selectedGapIds.size !== 1 ? 's' : ''} would improve your overall score by <strong>+{improvement}%</strong> (from {overallCurrent}% to {overallProjected}%)
        </motion.div>
      )}
    </div>
  );
}
