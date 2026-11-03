'use client';

import type { DS } from '@/lib/ds';
import { ROUTES, type RouteId } from '@/data/regional-hub';
import { Sideways, SourceLine, type HubContext } from './shared';

/**
 * Band 6: five ways to run the region from Saudi Arabia, as a radio group of
 * CheckboxCards. The selected route expands into its licence, incentives and
 * setup steps (ProgressSteps). The RHQ is one card among five.
 */
export function RoutesBand({ DS, ctx, onChange }: { DS: DS; ctx: HubContext; onChange: (c: HubContext) => void }) {
  const selected = ROUTES.find((r) => r.id === ctx.route) ?? null;

  return (
    <section id="routes" className="rh-band" aria-labelledby="rh-routes">
      <div className="rh-container rh-stack">
        <DS.SectionHeader
          title="How you can run the region from here"
          supporting="Five routes, each with its licence, its potentially applicable incentives, and the order of steps. Pick one to see the path; the choice carries into the advisor form."
        />
        <div className="rh-routes" role="radiogroup" aria-label="Ways to operate">
          {ROUTES.map((r) => (
            <DS.CheckboxCard
              key={r.id}
              type="radio"
              name="route"
              icon={r.icon}
              title={r.title}
              description={r.description}
              checked={ctx.route === r.id}
              onChange={() => onChange({ ...ctx, route: r.id as RouteId })}
            />
          ))}
        </div>

        {selected ? (
          <div className="rh-card rh-card--primary">
            <DS.CardHeader title={selected.title} badge="Selected route" supporting={`Licence: ${selected.licence}`} />
            <DS.ProgressSteps steps={selected.steps} current={0} />
            <div className="rh-grid rh-grid--2">
              <div className="rh-stack" style={{ gap: 'var(--spacing-md)' }}>
                <span className="text-sm-medium rh-muted">Incentives</span>
                <ul className="rh-list text-sm-regular">
                  {selected.incentives.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
                <SourceLine DS={DS} p={selected.provenance} />
              </div>
              <div className="rh-stack" style={{ gap: 'var(--spacing-md)' }}>
                <span className="text-sm-medium rh-muted">Next step</span>
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
            </div>
          </div>
        ) : (
          <DS.Alert color="gray" title="Select a route to see its path" icon="route">
            Each route shows its licence type, the incentives that may apply, and the setup steps in order.
          </DS.Alert>
        )}
      </div>
    </section>
  );
}
