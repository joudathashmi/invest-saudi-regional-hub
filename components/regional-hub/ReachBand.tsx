'use client';

import * as React from 'react';
import type { DS } from '@/lib/ds';
import { CONNECTIVITY_FIGURES, DOMESTIC, REACH } from '@/data/regional-hub';
import { Reveal, SourceLine, marketNames, type HubContext } from './shared';

/**
 * Understand. Five reasons as a list on the left (homepage "Why invest"
 * pattern); the open reason's figure, label and supporting points in the
 * card on the right. Same five published records as before, every source kept.
 */
const REASONS = [
  { fig: REACH[3], title: 'The largest economy in the region', points: ['Investors come for Saudi demand first; the region is served from that base, not instead of it.', 'Non-oil activity now carries the larger share of GDP, which widens the domestic market for most sectors.'] },
  { fig: DOMESTIC[0], title: 'Growing, and growing broadly', points: ['Real GDP growth in 2024 came with non-oil activities expanding faster than the headline.', 'Published by GASTAT; re-verified by the Data team before each release.'] },
  { fig: DOMESTIC[1], title: 'Capital is already arriving', points: ['Foreign direct investment inflows grew 24% in 2024.', 'Growth in licensed foreign companies continues across sectors and regions.'] },
  { fig: REACH[4], title: 'A logistics base that ranks', points: ['World Bank Logistics Performance Index rank, as shown on the live site.', '59 logistics zones are planned by 2030 and 39+ industrial cities operate today.'] },
  { fig: CONNECTIVITY_FIGURES[0], title: 'Built for the next decade', points: ['Planned logistics zones under the National Transport and Logistics Strategy.', 'Airports, ports and rail are expanding together; the integrated network step below shows how they join.'] },
];

export function ReachBand({ DS, ctx }: { DS: DS; ctx: HubContext }) {
  const [i, setI] = React.useState(0);
  const r = REASONS[i];
  const cardRef = React.useRef<HTMLDivElement | null>(null);
  const [seen, setSeen] = React.useState(false);
  React.useEffect(() => {
    const el = cardRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') { setSeen(true); return; }
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { setSeen(true); io.disconnect(); } }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const lead = REACH[3];
  return (
    <section id="reach" className="rh-band rh-glow-r" aria-labelledby="rh-reach">
      <div className="rh-container rh-stack">
        <Reveal className="rh-editorial-lead">
          <span className="text-sm-semibold rh-eyebrow">01 · Understand</span>
          <h2 id="rh-reach" className="display-md-semibold rh-h2">An anchor market before it is a hub</h2>
          <p className="text-lg-regular rh-muted rh-para">Five reasons the base matters before the reach does, for a hub serving {marketNames(ctx.markets)}.</p>
        </Reveal>
        <div className="rh-reasons">
          <ul className="rh-reason-list" role="tablist" aria-label="Reasons">
            {REASONS.map((x, k) => (
              <li key={x.title} role="presentation">
                <button type="button" role="tab" aria-selected={k === i} className={k === i ? 'rh-reason rh-reason--on' : 'rh-reason'} onClick={() => setI(k)}>
                  <span className="text-lg-semibold">{x.title}</span>
                  <span className="text-sm-medium rh-reason-sub">{x.fig.value} · {x.fig.label}</span>
                </button>
              </li>
            ))}
          </ul>
          <div className="rh-reason-card" ref={cardRef} role="tabpanel">
            <span className="display-lg-semibold rh-bignum" aria-label={r.fig.value}>
              {i === 0 ? <DS.NumberTicker value={seen ? '1.2' : '0.0'} prefix="$" suffix="T+" /> : r.fig.value}
            </span>
            <span className="text-md-regular rh-muted">{r.fig.label}</span>
            <h3 className="display-xs-semibold rh-h3">{r.title}</h3>
            <ul className="rh-reason-points text-md-regular">
              {r.points.map((p) => <li key={p}>{p}</li>)}
            </ul>
            <SourceLine DS={DS} p={r.fig} />
          </div>
        </div>
        <div className="rh-actions">
          <DS.Button hierarchy="link-color" size="md" href="/why-saudi" iconTrailing="arrow-right">Why Saudi, the full picture</DS.Button>
          <DS.Button hierarchy="link-color" size="md" href="#connectivity" iconTrailing="arrow-right">See the connections</DS.Button>
        </div>
        <span hidden>{lead.value}</span>
      </div>
    </section>
  );
}
