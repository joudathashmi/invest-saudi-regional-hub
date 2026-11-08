'use client';

import * as React from 'react';
import type { DS } from '@/lib/ds';
import { THESIS } from '@/data/regional-hub';
import { CountUp, Reveal, SourceLine, marketNames, type HubContext } from './shared';

/**
 * 01 Why Saudi. Five arguments laid out as a proof wall: one lead tile on
 * photography carrying the headline figure, four evidence tiles of varied
 * size, and a closing tile that says what the five add up to and points to
 * the connectivity section. Everything is on the surface: figure, evidence,
 * commercial implication, link and source. No tabs, no pinning, no disclosure.
 * Same five records as before.
 */
export function ReachBand({ DS, ctx }: { DS: DS; ctx: HubContext }) {
  const [seen, setSeen] = React.useState(false);
  const [reduced, setReduced] = React.useState(false);
  const ref = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => { try { setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches); } catch { /* none */ } }, []);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') { setSeen(true); return; }
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { setSeen(true); io.disconnect(); } }, { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const run = seen && !reduced;
  const [lead, ...rest] = THESIS;

  return (
    <section id="reach" className="rh-band" aria-labelledby="rh-reach">
      <div className="rh-container rh-stack">
        <Reveal className="rh-editorial-lead rh-proof-lead">
          <span className="text-sm-semibold rh-eyebrow">01 · Why Saudi</span>
          <h2 id="rh-reach" className="display-md-semibold rh-h2">An anchor market before it is a hub</h2>
          <p className="text-lg-regular rh-muted rh-para">Five reasons the base matters before the reach does, for a business serving {marketNames(ctx.markets)}. Each figure carries its source.</p>
        </Reveal>

        <div className="rh-proof" ref={ref}>
          <Reveal className="rh-proof-tile rh-proof-tile--lead">
            <img className="rh-proof-photo" src={lead.photo} alt="" aria-hidden="true" loading="lazy" />
            <div className="rh-proof-in">
              <span className="rh-proof-idx text-xs-semibold">01</span>
              <span className="display-xl-semibold rh-proof-fig" aria-label={lead.fig.value}><CountUp value={lead.fig.value} run={run} /></span>
              <span className="text-md-medium rh-proof-label">{lead.fig.label}</span>
              <h3 className="display-xs-semibold rh-proof-title">{lead.title}</h3>
              <p className="text-md-regular rh-proof-text">{lead.implication}</p>
              <div className="rh-proof-foot">
                <a className="rh-proof-link text-md-semibold" href={lead.href}>{lead.hrefLabel} →</a>
                <SourceLine DS={DS} p={lead.fig} />
              </div>
            </div>
          </Reveal>

          {rest.map((x, k) => (
            <Reveal key={x.title} className={`rh-proof-tile rh-proof-tile--${k + 2}`}>
              <div className="rh-proof-in">
                <span className="rh-proof-idx text-xs-semibold">{String(k + 2).padStart(2, '0')}</span>
                <span className="display-lg-semibold rh-proof-fig" aria-label={x.fig.value}><CountUp value={x.fig.value} run={run} /></span>
                <span className="text-sm-medium rh-proof-label">{x.fig.label}</span>
                <h3 className="text-xl-semibold rh-proof-title">{x.title}</h3>
                <p className="text-sm-regular rh-proof-ev">{x.evidence}</p>
                <p className="text-md-regular rh-proof-text">{x.implication}</p>
                <div className="rh-proof-foot">
                  <a className="rh-proof-link text-sm-semibold" href={x.href}>{x.hrefLabel} →</a>
                  <SourceLine DS={DS} p={x.fig} />
                </div>
              </div>
            </Reveal>
          ))}

          <Reveal className="rh-proof-tile rh-proof-tile--close">
            <div className="rh-proof-in">
              <span className="rh-proof-idx text-xs-semibold">What it adds up to</span>
              <p className="display-xs-semibold rh-proof-close">A base worth building on its own terms. The reach is what it gives you next.</p>
              <a className="rh-proof-cta text-md-semibold" href="#connectivity">See how far it reaches <span aria-hidden="true">→</span></a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
