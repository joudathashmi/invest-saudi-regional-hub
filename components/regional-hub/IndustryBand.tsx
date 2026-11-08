'use client';

import type { DS } from '@/lib/ds';
import { GREEN_FIGURES, INDUSTRIES, INDUSTRY_REGION, MARKETS, SECTOR_BASE } from '@/data/regional-hub';
import { contextQuery } from '@/lib/copilot-context';
import { Details, Reveal, SourceLine, marketNames, type HubContext } from './shared';
import { industryPhoto } from './imagery';

/**
 * 07 Industry. Structured, not an article: pick a sector, then three labelled
 * panels (The region, Where Saudi Arabia stands, Connectivity that matters)
 * over the sector photograph, the national figures as tiles, and the links
 * as a row. Beneath, the industrial and green hub as a statement figure with
 * four pillars (downstream, automotive, defence, hydrogen) and its records.
 */
const PILLARS = [
  { icon: 'tool-02', title: 'Downstream', text: 'Petrochemicals and specialty materials at Jubail and Yanbu.' },
  { icon: 'truck-01', title: 'Automotive', text: 'Lucid and Ceer at King Abdullah Economic City.' },
  { icon: 'shield-01', title: 'Defence', text: 'SAMI, with 50% of spending to be localised by 2030.' },
  { icon: 'lightning-01', title: 'Hydrogen', text: 'NEOM Green Hydrogen, about 600 t/day at design capacity.' },
];

export function IndustryBand({ DS, ctx, onPick }: { DS: DS; ctx: HubContext; onPick: (industry: string) => void }) {
  const rec = ctx.industry ? INDUSTRY_REGION[ctx.industry] : null;
  const photo = industryPhoto(rec?.industry ?? null);
  const panels = rec ? [
    { icon: 'globe-01', title: 'The region', text: rec.summary },
    { icon: 'flag-01', title: 'Where Saudi Arabia stands', text: rec.saudiPosition },
    { icon: 'route', title: 'Connectivity that matters', text: rec.connectivity },
  ] : [];
  const green = GREEN_FIGURES.filter((f) => f.status !== 'unavailable');

  return (
    <section id="industry" className="rh-band rh-glow-l" aria-labelledby="rh-industry">
      <div className="rh-container rh-stack">
        <Reveal className="rh-editorial-lead">
          <span className="text-sm-semibold rh-eyebrow">07 · Your industry</span>
          <h2 id="rh-industry" className="display-md-semibold rh-h2">{rec ? `${rec.industry} in the region` : 'Your industry in the region'}</h2>
          <p className="text-lg-regular rh-muted rh-para">{rec ? `Across ${marketNames(ctx.markets)}: the market, Saudi Arabia's place in it, and the links that carry it.` : 'Pick a sector. The market, Saudi Arabia’s place in it, and the links that carry it, in three panels.'}</p>
        </Reveal>
        <div className="rh-chips">
          {INDUSTRIES.map((i) => (
            <DS.Chip key={i} size="md" selected={ctx.industry === i} onClick={() => onPick(i)}>{i}</DS.Chip>
          ))}
        </div>
        {rec ? (
          <>
            <p className="rh-sector-base display-xs-semibold">{SECTOR_BASE[rec.industry]}</p>
            <figure className="rh-ind-photo rh-ind-photo--wide"><img src={photo.src} alt={photo.alt} loading="lazy" /><figcaption className="text-xs-semibold rh-eyebrow">{rec.industry}</figcaption></figure>
            <div className="rh-actions">
              <DS.Button hierarchy="primary" size="md" href={`${rec.sectorHref}?${contextQuery(ctx)}`} iconTrailing="arrow-right">{rec.industry} sector page</DS.Button>
            </div>
            <div className="rh-ind">
              <div className="rh-ind-panels" style={{ gridColumn: '1 / -1' }}>
                {panels.map((p) => (
                  <div key={p.title} className="rh-ind-panel">
                    <DS.FeaturedIcon icon={p.icon} color="brand" size="md" />
                    <span className="text-md-semibold rh-strong">{p.title}</span>
                    <span className="text-sm-regular rh-muted">{p.text}</span>
                  </div>
                ))}
                <span className="rh-ind-src"><SourceLine DS={DS} p={rec} /></span>
              </div>
            </div>
            <Details DS={DS} label="National figures and regional demand">
            {rec.nationalFigures.length > 0 && (
              <dl className="rh-factlist rh-factlist--4">
                {rec.nationalFigures.map((f) => (
                  <div key={f.label} className="rh-fact">
                    <dt className="display-xs-semibold">{f.value}</dt>
                    <dd className="text-sm-regular rh-muted">{f.label}<br /><SourceLine DS={DS} p={f} /></dd>
                  </div>
                ))}
              </dl>
            )}
            {rec.demandByMarket ? (
              <DS.LineChart type="bar" title="Regional demand by market" labels={rec.demandByMarket.map((d) => MARKETS.find((m) => m.code === d.market)?.name ?? d.market)} series={[{ name: rec.industry, data: rec.demandByMarket.map((d) => d.value) }]} />
            ) : (
              <p className="text-xs-regular rh-tertiary rh-para">Regional demand by market appears once the sector team publishes it as part of the sector equity story.</p>
            )}
            <div className="rh-actions">
              <DS.Button hierarchy="secondary-gray" size="md" href={`/opportunities?${contextQuery(ctx, { sector: rec.industry })}`} iconLeading="coins-stacked-01">Opportunities</DS.Button>
              <DS.Button hierarchy="link-color" size="md" href="#companies" iconTrailing="arrow-right">Companies in this sector</DS.Button>
            </div>
            </Details>
          </>
        ) : (
          <figure className="rh-ind-photo"><img src={photo.src} alt={photo.alt} loading="lazy" /><figcaption className="text-sm-medium">Choose a sector above for the three panels. Until then, the base every sector draws on:</figcaption></figure>
        )}

        {!rec && <div className="rh-green">
          <div className="rh-editorial-lead">
            <span className="text-xs-semibold rh-eyebrow">Industrial and green hub</span>
            <h3 className="display-xs-semibold rh-h3">From exporting hydrocarbons to exporting value</h3>
          </div>
          <div className="rh-pillars">
            {PILLARS.map((p) => (
              <div key={p.title} className="rh-pillar">
                <DS.FeaturedIcon icon={p.icon} color="brand" size="md" />
                <span className="text-md-semibold rh-strong">{p.title}</span>
                <span className="text-sm-regular rh-muted">{p.text}</span>
              </div>
            ))}
          </div>
          <dl className="rh-factlist rh-factlist--4">
            {green.slice(0, 4).map((f) => (
              <div key={f.label} className="rh-fact">
                <dt className="display-xs-semibold">{f.value}</dt>
                <dd className="text-sm-regular rh-muted">{f.label}<br /><SourceLine DS={DS} p={f} /></dd>
              </div>
            ))}
          </dl>
          <p className="text-xs-regular rh-tertiary rh-para">NEOM figures are design capacities reported by the developer; first ammonia deliveries are expected in early 2027. NIDLP localisation figures appear once the Sector team confirms the annual report. For a regional manufacturer the point is supply security: energy-intensive processes beside competitively priced, increasingly low-carbon inputs.</p>
        </div>}
      </div>
    </section>
  );
}
