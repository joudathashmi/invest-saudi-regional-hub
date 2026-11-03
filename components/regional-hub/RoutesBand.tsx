'use client';

import type { DS } from '@/lib/ds';
import { ROUTES, type RouteId } from '@/data/regional-hub';
import { Sideways, SourceLine, type HubContext } from './shared';

/**
 * Evaluate. Five ways to run the region from here, as tabs with the path drawn
 * as steps. The selection is the same shared context the case builder sets.
 */
export function RoutesBand({ DS, ctx, onChange }: { DS: DS; ctx: HubContext; onChange: (c: HubContext) => void }) {
  const selected = ROUTES.find((r) => r.id === ctx.route) ?? ROUTES[0];

  return (
    <section id="routes" className="rh-band" aria-labelledby="rh-routes">
      <div className="rh-container rh-stack">
        <div className="rh-editorial-lead">
          <span className="text-sm-semibold rh-eyebrow">Evaluate</span>
          <h2 id="rh-routes" className="display-md-semibold rh-h2">How you can run the region from here</h2>
          <p className="text-lg-regular rh-muted rh-para">Five routes, each with its licence, the incentives that may apply, the connectivity it depends on, and the order of steps. A regional headquarters is one of the five, not the only one.</p>
        </div>
        <DS.Tabs
          type="underline"
          items={ROUTES.map((r) => ({ label: r.title.replace(' (Regional Headquarters)', ''), value: r.id }))}
          value={selected.id}
          onChange={(v: string) => onChange({ ...ctx, route: v as RouteId })}
        />
        <div className="rh-route">
          <div className="rh-route-text">
            <div className="rh-route-head">
              <DS.FeaturedIcon icon={selected.icon} color="brand" size="lg" />
              <div>
                <h3 className="display-xs-semibold rh-h3">{selected.title}</h3>
                <p className="text-md-regular rh-muted rh-para">{selected.description}</p>
              </div>
            </div>
            <p className="text-md-regular rh-para"><span className="rh-strong">Licence.</span> {selected.licence}.</p>
            <p className="text-md-regular rh-para"><span className="rh-strong">Incentives.</span> {selected.incentives[0]}</p>
            <p className="text-md-regular rh-para"><span className="rh-strong">Connectivity that matters.</span> {selected.connectivity}</p>
            <SourceLine DS={DS} p={selected.provenance} />
            <div className="rh-actions">
              <DS.Button hierarchy="primary" size="md" href={selected.startHref} iconTrailing="arrow-right">
                {selected.startLabel}
              </DS.Button>
              <DS.Button hierarchy="secondary-gray" size="md" href={`/how-to-invest/incentives?route=${selected.id}`} iconLeading="coins-stacked-01">
                Find incentives for this route
              </DS.Button>
            </div>
            <Sideways
              DS={DS}
              items={[
                { label: 'Platforms for this route', href: '#platforms', icon: 'marker-pin-01' },
                { label: 'Who already does this', href: '#companies', icon: 'users-01' },
                { label: 'Compare hubs for this route', href: '#comparison', icon: 'scale-01' },
              ]}
            />
          </div>
          <div className="rh-route-path">
            <span className="text-sm-semibold rh-eyebrow">The path, in order</span>
            <DS.ProgressSteps steps={selected.steps} current={0} />
          </div>
        </div>
      </div>
    </section>
  );
}
