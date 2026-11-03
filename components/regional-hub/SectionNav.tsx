'use client';

import * as React from 'react';
import type { DS } from '@/lib/ds';

/**
 * Journey navigator: a slim sticky bar under the hero that names the nine
 * stages, highlights the one in view, and scrolls to any of them. Uses the
 * system Tabs (underline) and Button; the sticky shell is page CSS on tokens.
 */
const ITEMS = [
  { id: 'reach', label: 'Understand' },
  { id: 'connectivity', label: 'Connections' },
  { id: 'market-access', label: 'Market access' },
  { id: 'platforms', label: 'Locations' },
  { id: 'routes', label: 'Routes' },
  { id: 'industry', label: 'Industry' },
  { id: 'companies', label: 'Companies' },
  { id: 'comparison', label: 'Compare' },
  { id: 'continue', label: 'Act' },
];

export function SectionNav({ DS }: { DS: DS }) {
  const [active, setActive] = React.useState('reach');
  React.useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      (entries) => { for (const e of entries) if (e.isIntersecting) setActive(e.target.id); },
      { rootMargin: '-30% 0px -60% 0px', threshold: 0 },
    );
    ITEMS.forEach((it) => { const el = document.getElementById(it.id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);
  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  return (
    <div className="rh-nav" role="navigation" aria-label="Page sections">
      <div className="rh-container rh-nav-in">
        <div className="rh-nav-tabs">
          <DS.Tabs type="underline" items={ITEMS.map((it, i) => ({ label: `${String(i + 1).padStart(2, '0')}  ${it.label}`, value: it.id }))} value={active} onChange={go} />
        </div>
      </div>
    </div>
  );
}
