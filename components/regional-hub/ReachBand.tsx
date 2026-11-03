'use client';

import * as React from 'react';
import type { DS } from '@/lib/ds';
import { CONNECTIVITY_FIGURES, DOMESTIC, REACH } from '@/data/regional-hub';
import { CountUp, Reveal, SourceLine, marketNames, type HubContext } from './shared';

/**
 * Understand. Five reasons as a list on the left; the open reason's figure,
 * label and points in the card on the right, over its own photograph. The
 * list advances by itself every few seconds (a progress bar shows where it
 * is) and stops the moment the reader takes over. Same five published
 * records, every source kept. Desktop: the card is pinned and the reader
 * scrolls through the reasons, each taking the card as it reaches the middle
 * of the screen; clicking a reason scrolls to it. Narrow screens: tabs.
 */
const REASONS = [
  { fig: REACH[3], title: 'The largest economy in the region', photo: '/img/skyline-day.jpg', points: ['Investors come for Saudi demand first; the region is served from that base, not instead of it.', 'Non-oil activity now carries the larger share of GDP, which widens the domestic market for most sectors.'] },
  { fig: DOMESTIC[0], title: 'Growing, and growing broadly', photo: '/img/riyadh-aerial.jpg', points: ['Real GDP growth in 2024 came with non-oil activities expanding faster than the headline.', 'Published by GASTAT; re-verified by the Data team before each release.'] },
  { fig: DOMESTIC[1], title: 'Capital is already arriving', photo: '/img/finance.jpg', points: ['Foreign direct investment inflows grew 24% in 2024.', 'Growth in licensed foreign companies continues across sectors and regions.'] },
  { fig: REACH[4], title: 'A logistics base that ranks', photo: '/img/port-cranes.jpg', points: ['World Bank Logistics Performance Index rank, as shown on the live site.', '59 logistics zones are planned by 2030 and 39+ industrial cities operate today.'] },
  { fig: CONNECTIVITY_FIGURES[0], title: 'Built for the next decade', photo: '/img/airport.jpg', points: ['Planned logistics zones under the National Transport and Logistics Strategy.', 'Airports, ports and rail are expanding together; the integrated network step below shows how they join.'] },
];

export function ReachBand({ DS, ctx }: { DS: DS; ctx: HubContext }) {
  const [i, setI] = React.useState(0);
  const [seen, setSeen] = React.useState(false);
  const [reduced, setReduced] = React.useState(false);
  const ref = React.useRef<HTMLDivElement | null>(null);
  const items = React.useRef<(HTMLLIElement | null)[]>([]);
  const r = REASONS[i];
  React.useEffect(() => { try { setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches); } catch { /* none */ } }, []);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') { setSeen(true); return; }
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { setSeen(true); io.disconnect(); } }, { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  /* Scroll-driven on wide screens: the block is pinned while a tall track scrolls past; progress through the track picks the reason. */
  const track = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    if (!window.matchMedia('(min-width: 1024px)').matches) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = track.current; if (!el) return;
        const r = el.getBoundingClientRect();
        const travel = r.height - window.innerHeight;
        if (travel <= 0) return;
        const p = Math.min(1, Math.max(0, -r.top / travel));
        setI(Math.min(REASONS.length - 1, Math.floor(p * REASONS.length)));
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, []);
  const pick = (k: number) => {
    setI(k);
    const el = track.current;
    if (el && window.matchMedia('(min-width: 1024px)').matches) {
      const travel = el.offsetHeight - window.innerHeight;
      const y = window.scrollY + el.getBoundingClientRect().top + ((k + 0.5) / REASONS.length) * travel;
      window.scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' });
    }
  };

  return (
    <section id="reach" className="rh-band rh-glow-r" aria-labelledby="rh-reach">
      <div className="rh-container rh-stack">
        <Reveal className="rh-editorial-lead">
          <span className="text-sm-semibold rh-eyebrow">01 · Understand</span>
          <h2 id="rh-reach" className="display-md-semibold rh-h2">An anchor market before it is a hub</h2>
          <p className="text-lg-regular rh-muted rh-para">Five reasons the base matters before the reach does, for a hub serving {marketNames(ctx.markets)}.</p>
        </Reveal>
        <div className="rh-reasons-track" ref={track}>
        <div className="rh-reasons rh-reasons--scroll" ref={ref}>
          <ul className="rh-reason-list" role="tablist" aria-label="Reasons">
            {REASONS.map((x, k) => (
              <li key={x.title} role="presentation" data-i={k} ref={(el) => { items.current[k] = el; }}>
                <button type="button" role="tab" aria-selected={k === i} className={k === i ? 'rh-reason rh-reason--on' : 'rh-reason'} onClick={() => pick(k)}>
                  <span className="rh-reason-idx text-xs-semibold">{String(k + 1).padStart(2, '0')}</span>
                  <span className="rh-reason-body">
                    <span className="text-lg-semibold">{x.title}</span>
                    <span className="text-sm-medium rh-reason-sub">{x.fig.value} · {x.fig.label}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <div className="rh-reason-card" role="tabpanel" key={i}>
            <img className="rh-reason-photo" src={r.photo} alt="" aria-hidden="true" loading="lazy" />
            <div className="rh-reason-in">
              <span className="rh-reason-dots" aria-hidden="true">{REASONS.map((_, k) => <span key={k} className={k === i ? 'rh-on' : ''} />)}</span>
              <span className="display-lg-semibold rh-bignum" aria-label={r.fig.value}><CountUp value={r.fig.value} run={seen && !reduced} /></span>
              <span className="text-md-regular rh-muted">{r.fig.label}</span>
              <h3 className="display-xs-semibold rh-h3">{r.title}</h3>
              <ul className="rh-reason-points text-md-regular">
                {r.points.map((p) => <li key={p}>{p}</li>)}
              </ul>
              <SourceLine DS={DS} p={r.fig} />
            </div>
          </div>
        </div>
        </div>
        <div className="rh-actions">
          <DS.Button hierarchy="link-color" size="md" href="/why-saudi" iconTrailing="arrow-right">Why Saudi, the full picture</DS.Button>
          <DS.Button hierarchy="link-color" size="md" href="#connectivity" iconTrailing="arrow-right">See the connections</DS.Button>
        </div>
      </div>
    </section>
  );
}
