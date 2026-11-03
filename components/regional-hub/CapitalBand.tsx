'use client';

import type { DS } from '@/lib/ds';
import { CAPITAL_FIGURES, CAPITAL_RELEVANCE } from '@/data/regional-hub';
import { Reveal, Sideways, SourceLine, type HubContext } from './shared';

/**
 * Evaluate, continued. Capital markets and liquidity: the Saudi Exchange,
 * the Public Investment Fund as allocation engine, FDI momentum and the
 * venture figure that stays unavailable until MAGNiTT is confirmed.
 */
export function CapitalBand({ DS, ctx }: { DS: DS; ctx: HubContext }) {
  const tiles = CAPITAL_FIGURES.filter((f) => f.status !== 'unavailable');
  const missing = CAPITAL_FIGURES.filter((f) => f.status === 'unavailable');
  return (
    <section id="capital" className="rh-band rh-glow-r" aria-labelledby="rh-capital">
      <div className="rh-container rh-stack">
        <Reveal className="rh-editorial-lead">
          <span className="text-sm-semibold rh-eyebrow">08 · Capital</span>
          <h2 id="rh-capital" className="display-md-semibold rh-h2">The deepest capital market in the region</h2>
          <p className="text-lg-regular rh-muted rh-para">A hub needs capital that clears locally. The Saudi Exchange is the region&rsquo;s largest equity market by value, the Public Investment Fund seeds the sector champions and supply chains around them, and foreign direct investment is growing{ctx.industry ? `, including in ${ctx.industry}` : ''}.</p>
        </Reveal>
        <dl className="rh-factlist rh-factlist--4">
          {tiles.map((f) => (
            <div key={f.label} className="rh-fact">
              <dt className="display-xs-semibold">{f.value}</dt>
              <dd className="text-sm-regular rh-muted">{f.label}<br /><SourceLine DS={DS} p={f} /></dd>
            </div>
          ))}
        </dl>
        <div className="rh-relevance">
          {CAPITAL_RELEVANCE.map((r) => (
            <p key={r.who} className="text-md-regular rh-muted rh-para"><b className="rh-strong">{r.who}.</b> {r.why}</p>
          ))}
        </div>
        {missing.map((f) => (
          <p key={f.label} className="text-xs-regular rh-tertiary rh-para">{f.label}: not shown until {f.source} is confirmed by the {f.owner}.</p>
        ))}
        <Sideways DS={DS} items={[{ label: 'Opportunities', href: '/opportunities', icon: 'coins-stacked-01' }, { label: 'Services and finance route', href: '#routes', icon: 'bank' }, { label: 'Companies already here', href: '#companies', icon: 'users-01' }]} />
      </div>
    </section>
  );
}
