import { motion } from 'framer-motion';
import { useCountUp } from '../../hooks/useCountUp';
import { useInView } from '../../hooks/useCountUp';
import type { ReactNode } from 'react';

interface KPICardProps {
  title: string;
  value: number;
  suffix?: string;
  prefix?: string;
  subtitle?: string;
  icon: ReactNode;
  color?: string;
  delay?: number;
}

export default function KPICard({
  title,
  value,
  suffix = '',
  prefix = '',
  subtitle,
  icon,
  color = 'var(--color-accent-500)',
  delay = 0,
}: KPICardProps) {
  const { ref, inView } = useInView();
  const displayValue = useCountUp(inView ? value : 0, 2000);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay / 1000 }}
      className="glass-card flex flex-col gap-3 hover:scale-[1.02] transition-transform duration-300"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
          {title}
        </span>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${color}15`, color }}
        >
          {icon}
        </div>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="score-display text-3xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
          {prefix}{displayValue}{suffix}
        </span>
      </div>
      {subtitle && (
        <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          {subtitle}
        </span>
      )}
    </motion.div>
  );
}
