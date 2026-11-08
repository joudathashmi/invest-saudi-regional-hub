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
      <span className="rh-foot-text">Source: {cited}{period}</span>
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

/** Chapter statement between stages (homepage pattern): the key words bright, connective words dimmed. */
export function Chapter({ parts, photo }: { parts: (string | { dim: string })[]; photo?: { src: string; alt: string } }) {
  return (
    <div className={photo ? 'rh-chapter rh-chapter--photo' : 'rh-chapter'}>
      {photo && <img className="rh-chapter-photo" src={photo.src} alt="" aria-hidden="true" loading="lazy" />}
      <div className="rh-container">
        <p className="display-sm-semibold">
          {parts.map((p, i) => (typeof p === 'string' ? <React.Fragment key={i}>{p}</React.Fragment> : <em key={i} className="rh-dim">{p.dim}</em>))}
        </p>
      </div>
    </div>
  );
}

/** Count-up for a figure string such as "$1.2T+", "2.7%", "38th" or "59": the number animates, prefix and suffix stay. */
export function CountUp({ value, run = true, ms = 1100 }: { value: string; run?: boolean; ms?: number }) {
  const m = React.useMemo(() => value.match(/^([^0-9]*)([0-9][0-9,]*\.?[0-9]*)(.*)$/), [value]);
  const target = m ? parseFloat(m[2].replace(/,/g, '')) : NaN;
  const decimals = m && m[2].includes('.') ? m[2].split('.')[1].length : 0;
  const [n, setN] = React.useState(0);
  React.useEffect(() => {
    if (Number.isNaN(target)) return;
    if (!run) { setN(0); return; }
    let raf = 0; const t0 = performance.now();
    const tick = (t: number) => { const k = Math.min(1, (t - t0) / ms); const e = 1 - Math.pow(1 - k, 3); setN(target * e); if (k < 1) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, target, ms]);
  if (!m || Number.isNaN(target)) return <>{value}</>;
  const shown = (run ? n : target).toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  return <>{m[1]}{shown}{m[3]}</>;
}

/** One disclosure per section: everything that is not the section's single idea lives inside it. */
export function Details({ DS, children, label = 'Details and sources' }: { DS: DS; children: React.ReactNode; label?: string }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="rh-details">
      <DS.Button hierarchy="link-gray" size="md" iconLeading={open ? 'chevron-up' : 'chevron-down'} onClick={() => setOpen(!open)} aria-expanded={open}>{open ? 'Hide details' : label}</DS.Button>
      {open && <div className="rh-details-body rh-stack">{children}</div>}
    </div>
  );
}
