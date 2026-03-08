import { motion } from 'framer-motion';
import { Info, Key, Palette, Bell } from 'lucide-react';

export default function Settings() {
  return (
    <div className="max-w-3xl space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <span className="section-label">Configuration</span>
        <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Settings</h2>
      </motion.div>

      {/* API Keys */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card space-y-4">
        <div className="flex items-center gap-3">
          <Key size={20} style={{ color: 'var(--color-accent-500)' }} />
          <h3 className="text-base font-semibold" style={{ color: 'var(--color-text-primary)' }}>API Configuration</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--color-text-secondary)' }}>Anthropic API Key</label>
            <input
              type="password"
              placeholder="sk-ant-..."
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ background: 'var(--color-primary-700)', border: '1px solid var(--glass-border)', color: 'var(--color-text-primary)' }}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--color-text-secondary)' }}>GenW.AI Endpoint</label>
            <input
              type="text"
              placeholder="https://api.genw.ai"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ background: 'var(--color-primary-700)', border: '1px solid var(--glass-border)', color: 'var(--color-text-primary)' }}
            />
          </div>
        </div>
      </motion.div>

      {/* Theme */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card space-y-4">
        <div className="flex items-center gap-3">
          <Palette size={20} style={{ color: 'var(--color-accent-500)' }} />
          <h3 className="text-base font-semibold" style={{ color: 'var(--color-text-primary)' }}>Appearance</h3>
        </div>
        <div className="flex gap-3">
          {['Dark (Default)', 'System'].map((theme) => (
            <button
              key={theme}
              className="px-4 py-2 rounded-xl text-sm font-medium"
              style={{
                background: theme === 'Dark (Default)' ? 'rgba(0, 195, 137, 0.15)' : 'var(--color-primary-700)',
                border: `1px solid ${theme === 'Dark (Default)' ? 'var(--color-accent-500)' : 'var(--glass-border)'}`,
                color: theme === 'Dark (Default)' ? 'var(--color-accent-400)' : 'var(--color-text-secondary)',
              }}
            >
              {theme}
            </button>
          ))}
        </div>
      </motion.div>

      {/* About */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card space-y-3">
        <div className="flex items-center gap-3">
          <Info size={20} style={{ color: 'var(--color-accent-500)' }} />
          <h3 className="text-base font-semibold" style={{ color: 'var(--color-text-primary)' }}>About ComplianceGPT</h3>
        </div>
        <div className="space-y-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          <p>Version: 1.0.0</p>
          <p>AI Model: claude-opus-4-5</p>
          <p>Platform: Deloitte GenW.AI™</p>
          <p>Built for Hacksplosion 2026</p>
        </div>
      </motion.div>
    </div>
  );
}
