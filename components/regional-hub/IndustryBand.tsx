'use client';

import type { DS } from '@/lib/ds';
import { INDUSTRIES, INDUSTRY_REGION, MARKETS } from '@/data/regional-hub';
import { Reveal, Sideways, SourceLine, marketNames, type HubContext } from './shared';
import { industryPhoto } from './imagery';

/**
 * Evaluate, continued. Your industry in the region as an editorial read:
 * the region, Saudi's place in it, and how connectivity matters, with the
 * published national figures set in type beside the text. Industry chips
 * select when none is chosen.
 */
export function IndustryBand({ DS, ctx, onPick }: { DS: DS; ctx: HubContext; onPick: (industry: string) => void }) {
  const rec = ctx.industry ? INDUSTRY_REGION[ctx.industry] : null;

  return (
    <section id="industry" className="rh-band rh-glow-l" aria-labelledby="rh-industry">
      <div className="rh-container rh-stack">
        <Reveal className="rh-editorial-lead">
          <span className="text-sm-semibold rh-eyebrow">06 · Your industry</span>
          <h2 id="rh-industry" className="display-md-semibold rh-h2">{rec ? `${rec.industry} in the region` : 'Your industry in the region'}</h2>
          <p className="text-lg-regular rh-muted rh-para">{rec ? `How the sector looks across ${marketNames(ctx.markets)}, where Saudi Arabia stands in it, and how the connections above matter for it.` : 'Pick an industry to read how the sector looks across the region and where Saudi Arabia stands in it.'}</p>
        </Reveal>
        <div className="rh-chips">
          {INDUSTRIES.map((i) => (
            <DS.Chip key={i} size="md" selected={ctx.industry === i} onClick={() => onPick(i)}>
              {i}
            </DS.Chip>
          ))}
        </div>
        {rec && (
          <div className="rh-industry">
            <div className="rh-industry-text">
              <p className="text-md-regular rh-para"><span className="rh-strong">The region.</span> {rec.summary}</p>
              <p className="text-md-regular rh-para"><span className="rh-strong">Where Saudi Arabia stands.</span> {rec.saudiPosition}</p>
              <p className="text-md-regular rh-para"><span className="rh-strong">How connectivity matters here.</span> {rec.connectivity}</p>
              <SourceLine DS={DS} p={rec} />
              <Sideways
                DS={DS}
                items={[
                  { label: 'Sector page', href: rec.sectorHref, icon: 'briefcase-01' },
                  { label: 'Opportunities in this sector', href: `/opportunities?sector=${encodeURIComponent(rec.industry)}`, icon: 'coins-stacked-01' },
                  { label: 'Companies already here', href: '#companies', icon: 'users-01' },
                  { label: 'See the network', href: '#connectivity', icon: 'route' },
                ]}
              />
            </div>
            <div className="rh-industry-aside">
              <img key={rec.industry} className="rh-industry-photo" src={industryPhoto(rec.industry).src} alt={industryPhoto(rec.industry).alt} loading="lazy" />
              {rec.nationalFigures.length > 0 ? (
                <dl className="rh-factlist rh-factlist--col">
                  {rec.nationalFigures.map((f) => (
                    <div key={f.label} className="rh-fact">
                      <dt className="display-xs-semibold">{f.value}</dt>
                      <dd className="text-sm-regular rh-muted">{f.label}<br /><SourceLine DS={DS} p={f} /></dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className="text-sm-regular rh-tertiary rh-para">National figures for this sector are published on the sector page.</p>
              )}
              {rec.demandByMarket ? (
                <DS.LineChart type="bar" title="Regional demand by market" labels={rec.demandByMarket.map((d) => MARKETS.find((m) => m.code === d.market)?.name ?? d.market)} series={[{ name: rec.industry, data: rec.demandByMarket.map((d) => d.value) }]} />
              ) : (
                <p className="text-xs-regular rh-tertiary rh-para">Regional demand by market is published by the sector team as part of the sector equity story; it appears here once it exists.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
