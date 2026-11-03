'use client';

import type { DS } from '@/lib/ds';
import { INDUSTRIES, MARKETS, ROUTES, type RouteId } from '@/data/regional-hub';
import type { HubContext } from './shared';

/**
 * Band 1: hero and router. PageHeader carries the breadcrumb, title and
 * proposition; the router card below captures the declared context (industry,
 * markets, route) that the rest of the page and the register-interest form read.
 */
export function RouterBand({ DS, ctx, onChange }: { DS: DS; ctx: HubContext; onChange: (c: HubContext) => void }) {
  const groups = Array.from(new Set(MARKETS.map((m) => m.group)));
  const toggleMarket = (code: string) =>
    onChange({ ...ctx, markets: ctx.markets.includes(code) ? ctx.markets.filter((c) => c !== code) : [...ctx.markets, code] });

  return (
    <section id="router" className="rh-band" aria-label="Build your regional case">
      <div className="rh-container rh-stack">
        <div className="rh-router" role="group" aria-label="Your regional case">
          <DS.SectionLabel title="Build your regional case" size="md" supporting="Three choices set the context for every section below. You can change them at any point; the page keeps your selection into the advisor form." />
          <div className="rh-router-grid">
            <div className="rh-router-field">
              <DS.Select
                label="My industry"
                placeholder="Select an industry"
                iconLeading="briefcase-01"
                options={INDUSTRIES}
                value={ctx.industry ?? ''}
                onChange={(e: { target: { value: string } }) => onChange({ ...ctx, industry: e.target.value || null })}
              />
              <span className="text-xs-regular rh-tertiary">Industry list to be replaced by the published controlled vocabulary.</span>
            </div>
            <div className="rh-router-field">
              <span className="text-sm-medium rh-muted">Markets I want to serve</span>
              {groups.map((g) => (
                <div key={g} className="rh-router-field">
                  <span className="text-xs-regular rh-tertiary">{g}</span>
                  <div className="rh-chips">
                    {MARKETS.filter((m) => m.group === g).map((m) => (
                      <DS.Chip key={m.code} size="md" checkbox selected={ctx.markets.includes(m.code)} onClick={() => toggleMarket(m.code)}>
                        {m.name}
                      </DS.Chip>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rh-router-field">
            <span className="text-sm-medium rh-muted">How I want to operate from Saudi Arabia</span>
            <div className="rh-wide">
              <DS.ButtonGroup
                items={[{ label: 'Any route', value: 'any' }, ...ROUTES.map((r) => ({ label: r.title.replace(' (Regional Headquarters)', ''), value: r.id }))]}
                value={ctx.route ?? 'any'}
                onChange={(v: string) => onChange({ ...ctx, route: v === 'any' ? null : (v as RouteId) })}
              />
            </div>
            <div className="rh-narrow">
              <DS.Select
                options={[{ value: 'any', label: 'Any route' }, ...ROUTES.map((r) => ({ value: r.id, label: r.title }))]}
                value={ctx.route ?? 'any'}
                onChange={(e: { target: { value: string } }) => onChange({ ...ctx, route: e.target.value === 'any' ? null : (e.target.value as RouteId) })}
              />
            </div>
          </div>
          <div className="rh-actions">
            <DS.Button hierarchy="primary" size="lg" href="#reach" iconTrailing="arrow-right">
              See my regional case
            </DS.Button>
            <DS.Button hierarchy="secondary-gray" size="lg" href="#" iconLeading="bookmark">
              Save to My Space
            </DS.Button>
          </div>
        </div>
      </div>
    </section>
  );
}
