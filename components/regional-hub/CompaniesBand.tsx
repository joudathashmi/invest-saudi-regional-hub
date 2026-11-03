'use client';

import * as React from 'react';
import type { DS } from '@/lib/ds';
import { COMPANIES, ROUTES, type RouteId } from '@/data/regional-hub';
import { Sideways, SourceLine, type HubContext } from './shared';

/**
 * Band 8: who already serves the region from Saudi Arabia. Filtered by route
 * and industry; one story, no stack. Company names and logos appear only when
 * consent is recorded, so every card here is a placeholder.
 */
export function CompaniesBand({ DS, ctx }: { DS: DS; ctx: HubContext }) {
  const [active, setActive] = React.useState<string[]>([]);
  const routeTitle = (id: RouteId) => ROUTES.find((r) => r.id === id)?.title ?? id;

  const story = COMPANIES.find((c) => c.story && (!ctx.route || c.route === ctx.route) && (!ctx.industry || c.industry === ctx.industry)) ?? COMPANIES.find((c) => c.story && (!ctx.route || c.route === ctx.route));
  const list = COMPANIES.filter((c) => (!ctx.route || c.route === ctx.route) && (!ctx.industry || c.industry === ctx.industry) && (!active.length || active.includes(routeTitle(c.route)) || active.includes(c.industry)));

  return (
    <section id="companies" className="rh-band" aria-labelledby="rh-companies">
      <div className="rh-container rh-stack">
        <DS.SectionHeader
          title="Who already runs the region from here"
          supporting="Exporters, logistics operators, service firms, digital platforms and regional headquarters that have publicly announced a Saudi base, filtered by how they operate and in which industry. Names come from public announcements; logos appear only with each company's consent."
          actions={
            <DS.Button hierarchy="secondary-gray" size="md" href="/why-saudi/success-stories" iconTrailing="arrow-right">
              All success stories
            </DS.Button>
          }
        />
        <DS.FilterPanel
          label="Filter"
          defaultOpen={false}
          groups={[
            { title: 'Route', options: ROUTES.map((r) => r.title) },
            { title: 'Industry', options: Array.from(new Set(COMPANIES.map((c) => c.industry))) },
          ]}
          active={active}
          onRemove={(v: string) => setActive(active.filter((x) => x !== v))}
        />
        {list.length === 0 ? (
          <DS.EmptyState icon="users-01" title="No company is listed for this selection yet" description="Company records appear once the licensed investor has given consent to be shown." />
        ) : (
          <div className="rh-grid rh-grid--3">
            {list.map((c) => (
              <article key={c.id} className="rh-card">
                <DS.CardHeader title={c.name} supporting={c.story ? `${c.base}. ${c.story}` : c.base} avatar={c.name.replace(/[^A-Za-z]/g, '').slice(0, 2).toUpperCase()} />
                <div className="rh-chips">
                  <DS.Tag size="sm" type="badge" color="blue">
                    {c.industry}
                  </DS.Tag>
                  <DS.Tag size="sm" type="sector">
                    {routeTitle(c.route)}
                  </DS.Tag>
                  {!c.consent && (
                    <DS.Tag size="sm" color="gray">
                      public announcement
                    </DS.Tag>
                  )}
                </div>
                <SourceLine DS={DS} p={c} />
                <Sideways
                  DS={DS}
                  items={[
                    { label: 'Sector', href: '#industry', icon: 'briefcase-01' },
                    { label: 'Same route', href: '#routes', icon: 'route' },
                  ]}
                />
              </article>
            ))}
          </div>
        )}
        <DS.InlineCTA
          title={story ? `${story.name}: ${story.story}` : 'One story, told once'}
          text={story ? `${story.industry}, ${story.base}. The story shown here follows the route and industry you selected.` : 'A single investor story is shown here, chosen by the selected route and industry. It changes when the context changes.'}
          actions={
            <DS.Button hierarchy="secondary-gray" size="md" href="/why-saudi/success-stories" iconTrailing="arrow-right">
              Read the story
            </DS.Button>
          }
        />
      </div>
    </section>
  );
}
