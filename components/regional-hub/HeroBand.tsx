'use client';

import * as React from 'react';
import type { DS } from '@/lib/ds';
import { REACH, type RouteId } from '@/data/regional-hub';
import { SourceLine, type HubContext } from './shared';
import { HERO_PHOTO } from './imagery';

/**
 * Inspire. Full-bleed Riyadh photograph; the proposition; an optional
 * purpose selector that sets the operating route for the whole page without
 * becoming a form; and three figures as an editorial line, each with its
 * commercial implication. Every figure keeps its source.
 */
const PURPOSES: { id: RouteId; label: string }[] = [
  { id: 'export', label: 'Manufacture and export' },
  { id: 'corporate', label: 'Regional headquarters' },
  { id: 'logistics', label: 'Distribution and logistics' },
  { id: 'digital', label: 'Digital operations' },
  { id: 'services', label: 'Regional services' },
];
const IMPLICATION: Record<string, string> = {
  'Largest economy in MENA': 'the domestic demand a regional business is built on',
  'World population within 8 hours by air': 'executives and air cargo reach most markets in a working day',
  'Consumers within a 4-hour flight': 'the regional market served from one base',
};

export function HeroBand({ DS, ctx, onChange, onBuildCase: _onBuildCase }: { DS: DS; ctx: HubContext; onChange: (c: HubContext) => void; onBuildCase: () => void }) {
  const strip = [REACH[3], REACH[0], REACH[1]];
  const pick = (id: RouteId) => onChange({ ...ctx, route: ctx.route === id ? null : id });
  return (
    <section id="top" className="rh-hero" aria-labelledby="rh-title">
      <img className="rh-hero-photo" src={HERO_PHOTO.src} alt="" aria-hidden="true" />
      <div className="rh-container rh-hero-grid">
        <div className="rh-hero-text">
          <DS.Breadcrumbs items={[{ label: 'Why Saudi', href: '/why-saudi' }, { label: 'Saudi as Your Regional Hub' }]} />
          <span className="text-sm-semibold rh-hero-eyebrow">Saudi as your regional hub</span>
          <h1 id="rh-title" className="display-2xl-semibold rh-hero-title">Build here.<br />Reach the region.</h1>
          <p className="text-xl-regular rh-hero-lead">An anchor market with the largest economy in the Middle East, from which a business serves the Gulf by road, the region by air and sea, and the world through two coastlines.</p>
          <div className="rh-purpose" role="group" aria-label="What brings your business to Saudi Arabia">
            <span className="text-sm-medium rh-purpose-q">What brings your business to Saudi Arabia?</span>
            <div className="rh-chips">
              {PURPOSES.map((p) => (
                <DS.Chip key={p.id} size="md" selected={ctx.route === p.id} onClick={() => pick(p.id)}>{p.label}</DS.Chip>
              ))}
            </div>
            <span className="text-xs-regular rh-purpose-note">{ctx.route ? 'The page now highlights what matters for this. Change it any time.' : 'Optional. The page highlights what matters for your choice.'}</span>
          </div>
          <div className="rh-actions">
            <DS.Button hierarchy="primary" size="xl" iconTrailing="arrow-right" href="#connectivity">Explore regional reach</DS.Button>
            <DS.Button hierarchy="link-color" size="xl" onClick={_onBuildCase} iconTrailing="chevron-right">Build my regional case</DS.Button>
          </div>
        </div>
      </div>
      <div className="rh-hero-strip-wrap">
        <div className="rh-container rh-hero-strip">
          {strip.map((f) => (
            <div key={f.label} className="rh-hero-stat">
              <span className="display-xs-semibold rh-hero-stat-value">{f.value}</span>
              <span className="text-sm-regular rh-hero-stat-label">{f.label}: {IMPLICATION[f.label]}.</span>
              <SourceLine DS={DS} p={f} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
