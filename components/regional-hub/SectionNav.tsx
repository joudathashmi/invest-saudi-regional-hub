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
  { id: 'market-access', label: 'One region' },
  { id: 'platforms', label: 'Locations' },
  { id: 'routes', label: 'Routes' },
  { id: 'talent', label: 'Talent' },
  { id: 'industry', label: 'Industry' },
  { id: 'capital', label: 'Capital' },
  { id: 'companies', label: 'Companies' },
  { id: 'continue', label: 'Act' },
];

export function SectionNav({ DS }: { DS: DS }) {
  const [active, setActive] = React.useState('reach');
  const [shown, setShown] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setShown(window.scrollY > Math.max(320, window.innerHeight * 0.6));
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
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
    <div className={shown ? 'rh-nav rh-nav--show' : 'rh-nav'} role="navigation" aria-label="Page sections">
      <div className="rh-nav-in">
        <span className="rh-nav-pos text-xs-semibold" aria-live="polite">{String(ITEMS.findIndex((it) => it.id === active) + 1).padStart(2, '0')} / {ITEMS.length}</span>
        <div className="rh-nav-tabs">
          <DS.Tabs type="underline" items={ITEMS.map((it, i) => ({ label: `${String(i + 1).padStart(2, '0')}  ${it.label}`, value: it.id }))} value={active} onChange={go} />
        </div>
      </div>
    </div>
  );
}
