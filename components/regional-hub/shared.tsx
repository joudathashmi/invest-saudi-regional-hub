'use client';

import * as React from 'react';
import type { DS } from '@/lib/ds';
import type { Provenance, RouteId } from '@/data/regional-hub';
import { MARKETS } from '@/data/regional-hub';

/** The shared filter context declared in band 1 and read by every band below it. */
export interface HubContext {
  industry: string | null;
  markets: string[];
  route: RouteId | null;
}

/** Provenance line shown under every figure, composed from tokens and the Tag component. */
export function SourceLine({ DS, p, badge = false }: { DS: DS; p: Provenance; badge?: boolean }) {
  const color = p.status === 'verified' ? 'success' : p.status === 'published' ? 'blue' : p.status === 'benchmark' ? 'blue-light' : p.status === 'estimate' ? 'warning' : 'gray';
  if (badge) {
    return (
      <div className="rh-source text-xs-regular">
        <DS.Tag size="sm" color={color} dot>
          {p.status}
        </DS.Tag>
        <span className="rh-source-text">
          Source: {p.source}. Period: {p.period}. Updated: {p.updated}.
        </span>
      </div>
    );
  }
  /* Footnote form: the cited authority only; the full provenance opens on the help icon. */
  const cited = p.source.replace(/^investsaudi\.sa \(Why Saudi\), citing /, '').replace(/^Public announcement, /, '');
  const period = /live site|as published|as shown|to confirm|pending|schematic|estimate|approximate|announced|in force since|reported|status|no treaty/i.test(p.period) ? '' : `, ${p.period}`;
  return (
    <span className="rh-foot text-xs-regular">
      <span>Source: {cited}{period}</span>
      <DS.HelpIcon title={`${p.status[0].toUpperCase()}${p.status.slice(1)}`} description={`${p.source}. Period: ${p.period}. ${p.updated}. Owner: ${p.owner}.`} />
    </span>
  );
}

/** Sideways chips: the 360 rule applied at card level (sector, zone, route, owner as links). */
export function Sideways({ DS, items }: { DS: DS; items: { label: string; href: string; icon?: string }[] }) {
  return (
    <div className="rh-sideways">
      {items.map((it) => (
        <DS.Button key={it.label} hierarchy="link-color" size="sm" href={it.href} iconLeading={it.icon} iconTrailing="arrow-right">
          {it.label}
        </DS.Button>
      ))}
    </div>
  );
}

export function marketNames(codes: string[]): string {
  const names = MARKETS.filter((m) => codes.includes(m.code)).map((m) => m.name);
  return names.length ? names.join(', ') : 'your selected markets';
}

/** Reveal: adds `rh-in` when the element first enters the viewport (fade and rise; none under reduced motion). */
export function Reveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [on, setOn] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') { setOn(true); return; }
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { setOn(true); io.disconnect(); } }, { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className={`rh-reveal ${on ? 'rh-in' : ''} ${className}`.trim()}>{children}</div>;
}
