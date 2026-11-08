'use client';

import * as React from 'react';
import type { DS } from '@/lib/ds';
import { THESIS } from '@/data/regional-hub';
import { CountUp, Reveal, SourceLine, marketNames, type HubContext } from './shared';

/**
 * 01 Understand. Five arguments as a thesis: Evidence, Commercial
 * implication, Investor relevance, each with its figure and source. Desktop:
 * the card is pinned and scrolling through the section moves between
 * arguments; the list on the left is also clickable. Narrow screens: a list
 * with the card below. Same five records as before.
 */
export function ReachBand({ DS, ctx }: { DS: DS; ctx: HubContext }) {
  const [i, setI] = React.useState(0);
  const [seen, setSeen] = React.useState(false);
  const [reduced, setReduced] = React.useState(false);
  const ref = React.useRef<HTMLDivElement | null>(null);
  const r = THESIS[i];
  React.useEffect(() => { try { setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches); } catch { /* none */ } }, []);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') { setSeen(true); return; }
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { setSeen(true); io.disconnect(); } }, { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const pick = (k: number) => setI(k);

  return (
    <section id="reach" className="rh-band rh-glow-r" aria-labelledby="rh-reach">
      <div className="rh-container rh-stack">
        <Reveal className="rh-editorial-lead">
          <span className="text-sm-semibold rh-eyebrow">01 · Why Saudi</span>
          <h2 id="rh-reach" className="display-md-semibold rh-h2">An anchor market before it is a hub</h2>
          <p className="text-lg-regular rh-muted rh-para">Five reasons the base matters before the reach does, for a business serving {marketNames(ctx.markets)}.</p>
        </Reveal>
        <div className="rh-reasons" ref={ref}>
            <ul className="rh-reason-list" role="tablist" aria-label="Arguments">
              {THESIS.map((x, k) => (
                <li key={x.title} role="presentation">
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
                <span className="rh-reason-dots" aria-hidden="true">{THESIS.map((_, k) => <span key={k} className={k === i ? 'rh-on' : ''} />)}</span>
                <span className="display-lg-semibold rh-bignum" aria-label={r.fig.value}><CountUp value={r.fig.value} run={seen && !reduced} /></span>
                <h3 className="display-xs-semibold rh-h3">{r.title}</h3>
                <dl className="rh-thesis">
                  <div><dt className="text-xs-semibold rh-eyebrow">Evidence</dt><dd className="text-md-regular">{r.evidence}</dd></div>
                  <div><dt className="text-xs-semibold rh-eyebrow">What it means commercially</dt><dd className="text-md-regular">{r.implication}</dd></div>
                  <div><dt className="text-xs-semibold rh-eyebrow">For you</dt><dd className="text-md-regular">{r.relevance} <a className="rh-inline-link text-md-semibold" href={r.href}>{r.hrefLabel} →</a></dd></div>
                </dl>
                <SourceLine DS={DS} p={r.fig} />
              </div>
            </div>
        </div>
      </div>
    </section>
  );
}
