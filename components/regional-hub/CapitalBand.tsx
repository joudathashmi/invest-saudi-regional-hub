'use client';

import * as React from 'react';
import type { DS } from '@/lib/ds';
import { CAPITAL_FIGURES, CAPITAL_LAYERS } from '@/data/regional-hub';
import { Reveal, SourceLine, type HubContext } from './shared';

/**
 * 08 Capital. One statement over the finance photograph with the anchor
 * figure, then three ways capital reaches a regional business (raise,
 * supply, deploy) as symbolic cards. Venture share stays unavailable.
 */
const WAYS = [
  { icon: 'bar-chart-square-02', title: 'Raise', text: 'List, issue sukuk or bonds, and clear regional M&A on the deepest exchange in the region.', fig: CAPITAL_FIGURES[0], href: '/opportunities' },
  { icon: 'coins-stacked-01', title: 'Supply', text: 'Qualify as a supplier to sovereign-backed champions in automotive, defence, hydrogen, housing and tourism.', fig: CAPITAL_FIGURES[2], href: '#industry' },
  { icon: 'rocket-01', title: 'Deploy', text: 'Global venture and private-equity funds run regional deployment arms from Riyadh; foreign direct investment keeps growing.', fig: CAPITAL_FIGURES[3], href: '#companies' },
];

export function CapitalBand({ DS, ctx }: { DS: DS; ctx: HubContext }) {
  const usd = CAPITAL_FIGURES[1];
  return (
    <section id="capital" className="rh-band rh-band--flush" aria-labelledby="rh-capital">
      <div className="rh-container rh-stack">
        <Reveal className="rh-editorial-lead">
          <span className="text-sm-semibold rh-eyebrow">08 · Capital</span>
          <h2 id="rh-capital" className="display-md-semibold rh-h2">Capital that clears here</h2>
        </Reveal>
        <figure className="rh-statement">
          <img src="/img/finance.jpg" alt="" aria-hidden="true" loading="lazy" />
          <figcaption>
            <span className="rh-statement-num">{usd.value}</span>
            <span className="display-xs-semibold">The region&rsquo;s largest equity market, by value{ctx.industry ? `, with ${ctx.industry} among its listed sectors` : ''}.</span>
            <span className="text-sm-regular rh-statement-foot">Saudi Exchange capitalisation, {CAPITAL_FIGURES[0].value} at the end of March 2026. <SourceLine DS={DS} p={usd} /></span>
          </figcaption>
        </figure>
        <div className="rh-flow" aria-label="How capital reaches a business here">
          {['Capital markets', 'Institutions and funds', 'Banks and programmes', 'Your regional business'].map((n, i, arr) => (
            <React.Fragment key={n}>
              <span className={i === arr.length - 1 ? 'rh-flow-node rh-flow-node--you' : 'rh-flow-node'}>{n}</span>
              {i < arr.length - 1 && <span className="rh-flow-arrow" aria-hidden="true"><DS.Icon name="arrow-right" size={16} /></span>}
            </React.Fragment>
          ))}
        </div>
        <div className="rh-three">
          {CAPITAL_LAYERS.map((w) => (
            <a key={w.title} className="rh-three-card" href={w.href}>
              <DS.FeaturedIcon icon={w.icon} color="brand" size="lg" />
              <span className="display-xs-semibold rh-h3">{w.title}</span>
              <span className="text-sm-regular rh-muted">{w.what}</span>
              <span className="text-md-regular"><span className="rh-strong">What it means for you.</span> {w.means}</span>
              {w.fig && (
                <span className="rh-three-fig">
                  <span className="display-sm-semibold">{w.fig.value}</span>
                  <span className="text-xs-regular rh-muted">{w.fig.label}</span>
                  <SourceLine DS={DS} p={w.fig} />
                </span>
              )}
            </a>
          ))}
        </div>
        <p className="text-xs-regular rh-tertiary rh-para">Market depth is not the same as financing availability: each layer has its own eligibility, and a foreign investor&rsquo;s access to it is confirmed case by case. Share of regional venture deal value appears once MAGNiTT figures are confirmed; PIF assets are press-reported pending the annual report.</p>
      </div>
    </section>
  );
}
