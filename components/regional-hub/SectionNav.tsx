'use client';

import * as React from 'react';
import type { DS } from '@/lib/ds';

/**
 * Persistent section navigation: six groups over the ten sections. Appears
 * after the hero as a floating pill, shows the active group, jumps to the
 * group's first section, and reports the active section id to the page so
 * it can be published as context. Keyboard and screen-reader accessible
 * through the design-system Tabs.
 */
export const GROUPS = [
  { id: 'why', label: 'Why Saudi', sections: ['reach'] },
  { id: 'connectivity', label: 'Connectivity', sections: ['connectivity', 'market-access'] },
  { id: 'models', label: 'Business models', sections: ['routes'] },
  { id: 'locations', label: 'Locations', sections: ['platforms'] },
  { id: 'industries', label: 'Industries', sections: ['talent', 'industry', 'capital', 'companies'] },
  { id: 'next', label: 'Next steps', sections: ['continue'] },
];
const ALL = GROUPS.flatMap((g) => g.sections);

export function SectionNav({ DS, onActive }: { DS: DS; onActive?: (id: string | null) => void }) {
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
      (entries) => { for (const e of entries) if (e.isIntersecting) { setActive(e.target.id); onActive?.(e.target.id); } },
      { rootMargin: '-30% 0px -60% 0px', threshold: 0 },
    );
    ALL.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, [onActive]);
  const group = GROUPS.find((g) => g.sections.includes(active)) ?? GROUPS[0];
  const go = (gid: string) => { const g = GROUPS.find((x) => x.id === gid); if (g) document.getElementById(g.sections[0])?.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  const n = ALL.indexOf(active) + 1;
  return (
    <div className={shown ? 'rh-nav rh-nav--show' : 'rh-nav'} role="navigation" aria-label="Page sections">
      <div className="rh-nav-in">
        <span className="rh-nav-pos text-xs-semibold" aria-live="polite">{String(n).padStart(2, '0')} / {ALL.length}</span>
        <div className="rh-nav-tabs">
          <DS.Tabs type="underline" items={GROUPS.map((g) => ({ label: g.label, value: g.id }))} value={group.id} onChange={go} />
        </div>
      </div>
    </div>
  );
}
