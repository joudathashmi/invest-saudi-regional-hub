'use client';

import * as React from 'react';
import type { DS } from '@/lib/ds';
import { COMPANIES, ROUTES, type RouteId } from '@/data/regional-hub';
import { Reveal, SourceLine, type HubContext } from './shared';

/**
 * Showcase. One featured story told large, then the rest grouped by what they
 * do from Saudi Arabia, as a showcase row rather than a directory. Names are
 * from public announcements; logos appear only with consent, so the monogram
 * stands in. The filter and the full list stay available behind a control.
 */
export function CompaniesBand({ DS, ctx }: { DS: DS; ctx: HubContext }) {
  const [showAll, setShowAll] = React.useState(false);
  const [active, setActive] = React.useState<string[]>([]);
  const routeTitle = (id: RouteId) => ROUTES.find((r) => r.id === id)?.title.replace(' (Regional Headquarters)', '') ?? id;
  const matches = (c: (typeof COMPANIES)[number]) => (!ctx.route || c.route === ctx.route) && (!ctx.industry || c.industry === ctx.industry);
  const story = COMPANIES.find((c) => c.story && matches(c)) ?? COMPANIES.find((c) => c.story && (!ctx.route || c.route === ctx.route)) ?? COMPANIES.find((c) => c.story)!;
  const groups: { id: RouteId; title: string }[] = ROUTES.map((r) => ({ id: r.id, title: r.title.replace(' (Regional Headquarters)', '') }));
  const mono = (n: string) => n.replace(/[^A-Za-z]/g, '').slice(0, 2).toUpperCase();
  const list = COMPANIES.filter((c) => matches(c) && (!active.length || active.includes(routeTitle(c.route)) || active.includes(c.industry)));

  return (
    <section id="companies" className="rh-band" aria-labelledby="rh-companies">
      <div className="rh-container rh-stack">
        <Reveal className="rh-editorial-lead">
          <span className="text-sm-semibold rh-eyebrow">Who already does this</span>
          <h2 id="rh-companies" className="display-md-semibold rh-h2">Running the region from Saudi Arabia</h2>
          <p className="text-lg-regular rh-muted rh-para">Exporters, logistics operators, service firms, digital platforms and regional headquarters that have publicly announced a Saudi base. Names come from public announcements; logos appear only with each company&rsquo;s consent.</p>
        </Reveal>

        <article className="rh-feature">
          <div className="rh-feature-mark" aria-hidden="true">
            <span className="display-lg-semibold">{mono(story.name)}</span>
          </div>
          <div className="rh-feature-text">
            <span className="text-xs-medium rh-eyebrow">{routeTitle(story.route)} · {story.industry}</span>
            <h3 className="display-sm-semibold rh-h3">{story.name}</h3>
            <p className="text-lg-regular rh-muted rh-para">{story.story} Based in {story.base}.</p>
            <SourceLine DS={DS} p={story} />
            <div className="rh-actions">
              <DS.Button hierarchy="secondary-gray" size="md" href="/why-saudi/success-stories" iconTrailing="arrow-right">Read the story</DS.Button>
              <DS.Button hierarchy="link-color" size="md" href="#industry" iconTrailing="arrow-right">Same sector</DS.Button>
            </div>
          </div>
        </article>

        <div className="rh-showcase">
          {groups.map((g) => {
            const names = COMPANIES.filter((c) => c.route === g.id);
            if (!names.length) return null;
            return (
              <div key={g.id} className="rh-showcase-group">
                <span className="text-xs-medium rh-eyebrow">{g.title}</span>
                <div className="rh-showcase-row">
                  {names.map((c) => (
                    <span key={c.id} className="rh-showcase-name" title={`${c.industry}, ${c.base}. ${c.source}`}>
                      <span className="rh-showcase-mono text-xs-semibold" aria-hidden="true">{mono(c.name)}</span>
                      <span className="text-md-medium">{c.name}</span>
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="rh-actions">
          <DS.Button hierarchy="link-gray" size="md" iconLeading={showAll ? 'chevron-up' : 'chevron-down'} onClick={() => setShowAll(!showAll)}>
            {showAll ? 'Hide the full list and filters' : 'Open the full list and filters'}
          </DS.Button>
          <DS.Button hierarchy="link-color" size="md" href="/why-saudi/success-stories" iconTrailing="arrow-right">All success stories</DS.Button>
        </div>
        {showAll && (
          <div className="rh-stack">
            <DS.FilterPanel
              label="Filter"
              defaultOpen={false}
              groups={[{ title: 'Route', options: groups.map((g) => g.title) }, { title: 'Industry', options: Array.from(new Set(COMPANIES.map((c) => c.industry))) }]}
              active={active}
              onRemove={(v: string) => setActive(active.filter((x) => x !== v))}
            />
            <div className="rh-table-wrap">
              <DS.Table
                columns={[
                  { key: 'name', title: 'Company' },
                  { key: 'industry', title: 'Industry' },
                  { key: 'route', title: 'How they operate', render: (c: (typeof COMPANIES)[number]) => routeTitle(c.route) },
                  { key: 'base', title: 'Saudi base' },
                  { key: 'prov', title: 'Data status', render: (c: (typeof COMPANIES)[number]) => <SourceLine DS={DS} p={c} badge /> },
                ]}
                rows={list}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
