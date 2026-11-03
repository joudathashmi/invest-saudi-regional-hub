'use client';

import type { DS } from '@/lib/ds';
import { PLATFORMS, ROUTES } from '@/data/regional-hub';
import { Sideways, SourceLine, type HubContext } from './shared';

/**
 * Band 5: platforms to operate from. Each platform is a record preview
 * composed from CardHeader, Tag, Button and the provenance line. Filtered by
 * the selected route. Candidate addition to the system: a "PlatformCard".
 */
export function PlatformsBand({ DS, ctx }: { DS: DS; ctx: HubContext }) {
  const list = ctx.route ? PLATFORMS.filter((p) => p.routes.includes(ctx.route!)) : PLATFORMS;

  return (
    <section id="platforms" className="rh-band" aria-labelledby="rh-platforms">
      <div className="rh-container rh-stack">
        <DS.SectionHeader
          title="Where you can operate from"
          supporting="Special economic zones, logistics zones and industrial cities, with what each permits. The four ECZA zones share one published package: 5% corporate income tax for up to 20 years, 0% withholding tax on repatriated profits, customs deferral and 0% VAT on intra-zone goods. Shown as potentially applicable; eligibility is confirmed by the zone authority."
          actions={
            <DS.Button hierarchy="secondary-gray" size="md" href="/regions" iconTrailing="arrow-right">
              Regions and cities
            </DS.Button>
          }
        />
        {list.length === 0 ? (
          <DS.EmptyState icon="marker-pin-01" title="No platform is listed for this route yet" description="The zone authorities have not published a platform record for the selected route. Talk to an advisor for the current options." />
        ) : (
          <div className="rh-grid rh-grid--3">
            {list.map((p) => (
              <article key={p.id} className="rh-card">
                <DS.CardHeader title={p.name} badge={p.kind} supporting={`${p.location}. Authority: ${p.authority}.`} />
                <ul className="rh-list text-sm-regular">
                  {p.permits.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
                <div className="rh-chips">
                  {p.routes.map((r) => (
                    <DS.Tag key={r} size="sm" type="sector">
                      {ROUTES.find((x) => x.id === r)?.title}
                    </DS.Tag>
                  ))}
                </div>
                <SourceLine DS={DS} p={p} />
                <Sideways
                  DS={DS}
                  items={[
                    { label: 'Zone page', href: p.href, icon: 'marker-pin-01' },
                    { label: 'Incentives here', href: `/how-to-invest/incentives?zone=${p.id}`, icon: 'coins-stacked-01' },
                    { label: 'Opportunities here', href: `/opportunities?zone=${p.id}`, icon: 'briefcase-01' },
                  ]}
                />
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
