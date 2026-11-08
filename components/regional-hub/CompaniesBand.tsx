'use client';

import * as React from 'react';
import type { DS } from '@/lib/ds';
import { COMPANIES, PRESENCE, ROUTES, type RouteId } from '@/data/regional-hub';
import { Details, Reveal, SourceLine, type HubContext, Thread } from './shared';
import { FEATURE_PHOTO, industryPhoto } from './imagery';
import { Logo } from './Logo';

/**
 * 09 Companies. One featured story over a photograph, then a wall of
 * monogram tiles grouped by how each company operates from here. Every tile
 * opens the record. Names are from public announcements; logos only with consent.
 */
export function CompaniesBand({ DS, ctx }: { DS: DS; ctx: HubContext }) {
  const [detail, setDetail] = React.useState<(typeof COMPANIES)[number] | null>(null);
  const [filter, setFilter] = React.useState<RouteId | 'all'>('all');
  const [all, setAll] = React.useState(false);
  const routeTitle = (id: RouteId) => ROUTES.find((r) => r.id === id)?.title.replace(' (Regional Headquarters)', '') ?? id;
  const matches = (c: (typeof COMPANIES)[number]) => (!ctx.route || c.route === ctx.route) && (!ctx.industry || c.industry === ctx.industry);
  const withStory = COMPANIES.filter((c) => c.story);
  const stories = [...withStory.filter(matches), ...withStory.filter((c) => !matches(c))].slice(0, 3);
  const story = stories[0];
  const mono = (n: string) => n.replace(/[^A-Za-z]/g, '').slice(0, 2).toUpperCase();
  const full = COMPANIES.filter((c) => filter === 'all' || c.route === filter);
  const list = all ? full : full.slice(0, 16);
  const counts = ROUTES.map((r) => ({ id: r.id, title: routeTitle(r.id), n: COMPANIES.filter((c) => c.route === r.id).length })).filter((x) => x.n > 0);

  return (
    <section id="companies" className="rh-band" aria-labelledby="rh-companies">
      <div className="rh-container rh-stack">
        <Reveal className="rh-editorial-lead">
          <Thread ctx={ctx} />
          <span className="text-sm-semibold rh-eyebrow">09 · Who already does this</span>
          <h2 id="rh-companies" className="display-md-semibold rh-h2">{COMPANIES.length} companies running the region from here</h2>
        </Reveal>
        <div className="rh-stories">
          {stories.map((c, i) => (
            <figure key={c.id} className={i === 0 ? 'rh-cstory rh-cstory--lead' : 'rh-cstory'}>
              <img src={i === 0 ? FEATURE_PHOTO.src : industryPhoto(c.industry).src} alt="" aria-hidden="true" loading="lazy" />
              <figcaption>
                <span className="rh-cstory-logo"><Logo name={c.name} mono={mono(c.name)} size={40} /></span>
                <span className="text-xs-semibold rh-eyebrow">{PRESENCE[c.id] ?? 'Commercial presence'} · {c.industry}</span>
                <span className={i === 0 ? 'display-sm-semibold' : 'text-xl-semibold'}>{c.name}</span>
                <span className="rh-cstory-chain text-sm-regular">{c.base} → {routeTitle(c.route)} → {c.story}</span>
                <SourceLine DS={DS} p={c} />
                <span className="rh-actions"><DS.Button hierarchy={i === 0 ? 'primary' : 'link-color'} size="md" onClick={() => setDetail(c)} iconTrailing="arrow-right">Open the record</DS.Button></span>
              </figcaption>
            </figure>
          ))}
        </div>
        <Details DS={DS} label={`All ${COMPANIES.length} companies`}>
        <div className="rh-chips">
          <DS.Chip size="md" selected={filter === 'all'} onClick={() => setFilter('all')}>All · {COMPANIES.length}</DS.Chip>
          {counts.map((c) => <DS.Chip key={c.id} size="md" selected={filter === c.id} onClick={() => setFilter(c.id)}>{c.title} · {c.n}</DS.Chip>)}
        </div>
        <div className="rh-wall" role="list">
          {list.map((c) => (
            <button key={c.id} type="button" role="listitem" className={matches(c) ? 'rh-wall-tile' : 'rh-wall-tile rh-wall-tile--dim'} onClick={() => setDetail(c)}>
              <Logo name={c.name} mono={mono(c.name)} />
              <span className="text-md-semibold rh-wall-name">{c.name}</span>
              <span className="text-xs-regular rh-muted">{PRESENCE[c.id] ?? 'Commercial presence'} · {c.industry}</span>
            </button>
          ))}
        </div>
        {full.length > 8 && (
          <div className="rh-actions"><DS.Button hierarchy="link-gray" size="md" iconLeading={all ? 'chevron-up' : 'chevron-down'} onClick={() => setAll(!all)}>{all ? 'Show fewer' : `Show all ${full.length}`}</DS.Button></div>
        )}
        </Details>
        <p className="text-xs-regular rh-tertiary rh-para">Presence type (regional headquarters, manufacturing, distribution, service centre, investment project) is as stated in each public announcement; no outcome figures are shown until the company confirms them. Names from public announcements. Marks are loaded from public sources for this prototype and are each company&rsquo;s trademark; production use needs the company&rsquo;s consent and the brand team&rsquo;s files. Tiles outside your current case are dimmed, not hidden.</p>
      </div>
      {detail && (
        <DS.SlideoutMenu title={detail.name} description={`${PRESENCE[detail.id] ?? 'Commercial presence'} · ${detail.industry}`} open width={480} onClose={() => setDetail(null)} actions={<DS.Button hierarchy="secondary-gray" size="md" onClick={() => setDetail(null)}>Close</DS.Button>}>
          <div className="rh-stack" style={{ gap: 'var(--spacing-xl)' }}>
            <p className="text-md-regular rh-para"><span className="rh-strong">Saudi base.</span> {detail.base}.</p>
            {detail.story && <p className="text-md-regular rh-para"><span className="rh-strong">What they do from here.</span> {detail.story}</p>}
            <p className="text-md-regular rh-para"><span className="rh-strong">How they operate.</span> {routeTitle(detail.route)}.</p>
            <SourceLine DS={DS} p={detail} badge />
            <div className="rh-actions">
              <DS.Button hierarchy="secondary-gray" size="md" href={`/sectors/${detail.industry.toLowerCase().replace(/\s+and\s+/g, '-').replace(/\s+/g, '-')}`} iconTrailing="arrow-right">Sector page</DS.Button>
              <DS.Button hierarchy="link-color" size="md" href="#routes" iconTrailing="arrow-right" onClick={() => setDetail(null)}>Same route</DS.Button>
            </div>
          </div>
        </DS.SlideoutMenu>
      )}
    </section>
  );
}
