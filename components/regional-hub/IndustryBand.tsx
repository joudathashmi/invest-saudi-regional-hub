'use client';

import type { DS } from '@/lib/ds';
import { INDUSTRIES, INDUSTRY_REGION, MARKETS } from '@/data/regional-hub';
import { Sideways, SourceLine, marketNames, type HubContext } from './shared';

/**
 * Band 7: your industry in the region. A short regional read, Saudi's position,
 * the national figures already published, and the regional-demand chart when the
 * sector team has published it. With no industry selected, the band shows the
 * industry list so the page never ends in an empty state.
 */
export function IndustryBand({ DS, ctx, onPick }: { DS: DS; ctx: HubContext; onPick: (industry: string) => void }) {
  const rec = ctx.industry ? INDUSTRY_REGION[ctx.industry] : null;

  return (
    <section id="industry" className="rh-band" aria-labelledby="rh-industry">
      <div className="rh-container rh-stack">
        <DS.SectionHeader
          title={rec ? `${rec.industry} in the region` : 'Your industry in the region'}
          supporting={rec ? `How the sector looks across ${marketNames(ctx.markets)}, and where Saudi Arabia stands in it.` : 'Pick an industry to see how the sector looks across the region and where Saudi Arabia stands in it.'}
          actions={
            rec ? (
              <DS.Button hierarchy="secondary-gray" size="md" href={rec.sectorHref} iconTrailing="arrow-right">
                Open the sector page
              </DS.Button>
            ) : undefined
          }
        />
        {!rec ? (
          <div className="rh-chips">
            {INDUSTRIES.map((i) => (
              <DS.Chip key={i} size="lg" icon="briefcase-01" onClick={() => onPick(i)}>
                {i}
              </DS.Chip>
            ))}
          </div>
        ) : (
          <div className="rh-grid rh-grid--2">
            <div className="rh-stack" style={{ gap: 'var(--spacing-2xl)' }}>
              <div className="rh-card">
                <DS.CardHeader title="The region" supporting={rec.summary} />
              </div>
              <div className="rh-card">
                <DS.CardHeader title="Where Saudi Arabia stands" supporting={rec.saudiPosition} />
              </div>
              <div className="rh-card">
                <DS.CardHeader title="How connectivity matters here" supporting={rec.connectivity} />
                <Sideways DS={DS} items={[{ label: 'See the network', href: '#connectivity', icon: 'route' }, { label: 'Market access for your markets', href: '#market-access', icon: 'globe-01' }]} />
              </div>
              <Sideways
                DS={DS}
                items={[
                  { label: 'Opportunities in this sector', href: `/opportunities?sector=${encodeURIComponent(rec.industry)}`, icon: 'coins-stacked-01' },
                  { label: 'Companies already here', href: '#companies', icon: 'users-01' },
                  { label: 'Platforms for this sector', href: '#platforms', icon: 'marker-pin-01' },
                ]}
              />
            </div>
            <div className="rh-stack" style={{ gap: 'var(--spacing-2xl)' }}>
              {rec.nationalFigures.length > 0 && (
                <div className="rh-grid rh-grid--2">
                  {rec.nationalFigures.map((f) => (
                    <div key={f.label} className="rh-metric">
                      <DS.MetricItem label={f.label} value={f.value} />
                      <SourceLine DS={DS} p={f} />
                    </div>
                  ))}
                </div>
              )}
              {rec.demandByMarket ? (
                <DS.LineChart
                  type="bar"
                  title="Regional demand by market"
                  labels={rec.demandByMarket.map((d) => MARKETS.find((m) => m.code === d.market)?.name ?? d.market)}
                  series={[{ name: rec.industry, data: rec.demandByMarket.map((d) => d.value) }]}
                />
              ) : (
                <DS.Alert color="gray" title="Regional demand by market: not yet published">
                  The sector team publishes market-size and growth per country as part of the sector equity story. Until then this band shows the national figures and the qualitative read above.
                </DS.Alert>
              )}
              <SourceLine DS={DS} p={rec} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
