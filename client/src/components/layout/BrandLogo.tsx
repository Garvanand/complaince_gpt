import type { CSSProperties } from 'react';

import trustiqMark from '../../assets/trustiq-mark.svg';

interface BrandLogoProps {
  compact?: boolean;
  showProductTag?: boolean;
  className?: string;
  markClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  style?: CSSProperties;
}

export default function BrandLogo({
  compact = false,
  showProductTag = false,
  className,
  markClassName,
  titleClassName,
  descriptionClassName,
  style,
}: BrandLogoProps) {
  return (
    <div className={['brand-lockup', compact ? 'compact' : '', className].filter(Boolean).join(' ')} style={style}>
      <div className={['brand-mark', markClassName].filter(Boolean).join(' ')} aria-hidden="true">
        <img src={trustiqMark} alt="" className="brand-mark-image" />
      </div>
      {!compact && (
        <div className="brand-copy">
          <div className={['brand-title', titleClassName].filter(Boolean).join(' ')}>TrustIQ</div>
          <div className={['brand-description', descriptionClassName].filter(Boolean).join(' ')}>
            {showProductTag
              ? 'AI-powered compliance intelligence platform for ISO governance assessments.'
              : 'Enterprise compliance intelligence workspace'}
          </div>
        </div>
      )}
    </div>
  );
}