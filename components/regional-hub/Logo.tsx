'use client';

import * as React from 'react';
import { logoCandidates } from './logos';

/** Tries each candidate URL in turn; renders the monogram when all fail (or none exist). */
export function Logo({ name, mono, size = 48, className = '' }: { name: string; mono: string; size?: number; className?: string }) {
  const cands = React.useMemo(() => logoCandidates(name), [name]);
  const [i, setI] = React.useState(0);
  const src = cands[i];
  if (!src) return <span className={`rh-wall-mono display-xs-semibold ${className}`.trim()} aria-hidden="true">{mono}</span>;
  const isFavicon = src.includes('favicons');
  return (
    <span className={`rh-logo ${isFavicon ? 'rh-logo--icon' : ''} ${className}`.trim()} style={{ width: isFavicon ? size : undefined, height: size }}>
      <img src={src} alt={`${name} logo`} loading="lazy" referrerPolicy="no-referrer" onError={() => setI((k) => k + 1)} />
    </span>
  );
}
