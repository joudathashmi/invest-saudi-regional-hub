'use client';

import * as React from 'react';
import type { DS } from '@/lib/ds';
import { THESIS } from '@/data/regional-hub';
import { CountUp, Details, Reveal, SourceLine, marketNames, type HubContext } from './shared';

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
  const track = React.useRef<HTMLDivElement | null>(null);
  const r = THESIS[i];
  React.useEffect(() => { try { setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches); } catch { /* none */ } }, []);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') { setSeen(true); return; }
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { setSeen(true); io.disconnect(); } }, { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  React.useEffect(() => {
    if (!window.matchMedia('(min-width: 1024px)').matches) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = track.current; if (!el) return;
        const rct = el.getBoundingClientRect(); const travel = rct.height - window.innerHeight;
        if (travel <= 0) return;
        const p = Math.min(1, Math.max(0, -rct.top / travel));
        setI(Math.min(THESIS.length - 1, Math.floor(p * THESIS.length)));
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
      window.scrollTo({ top: window.scrollY + el.getBoundingClientRect().top + ((k + 0.5) / THESIS.length) * travel, behavior: reduced ? 'auto' : 'smooth' });
    }
  };

  return (
    <section id="reach" className="rh-band rh-glow-r" aria-labelledby="rh-reach">
      <div className="rh-container rh-stack">
        <Reveal className="rh-editorial-lead">
          <span className="text-sm-semibold rh-eyebrow">01 · Why Saudi</span>
          <h2 id="rh-reach" className="display-md-semibold rh-h2">An anchor market before it is a hub</h2>
          <p className="text-lg-regular rh-muted rh-para">Five reasons the base matters before the reach does, for a business serving {marketNames(ctx.markets)}.</p>
        </Reveal>
        <div className="rh-reasons-track" ref={track}>
          <div className="rh-reasons rh-reasons--scroll" ref={ref}>
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
              <div className="rh-reason-in">
                <span className="rh-reason-dots" aria-hidden="true">{THESIS.map((_, k) => <span key={k} className={k === i ? 'rh-on' : ''} />)}</span>
                <span className="display-lg-semibold rh-bignum" aria-label={r.fig.value}><CountUp value={r.fig.value} run={seen && !reduced} /></span>
                <h3 className="display-xs-semibold rh-h3">{r.title}</h3>
                <p className="text-lg-regular rh-para">{r.implication}</p>
                <a className="rh-inline-link text-md-semibold" href={r.href}>{r.hrefLabel} →</a>
                <Details DS={DS} label="Evidence and source">
                  <p className="text-md-regular rh-muted rh-para">{r.evidence}</p>
                  <p className="text-md-regular rh-muted rh-para">{r.relevance}</p>
                </Details>
                <SourceLine DS={DS} p={r.fig} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
