'use client';

import * as React from 'react';
import type { DS } from '@/lib/ds';
import { REACH } from '@/data/regional-hub';
import { SourceLine } from './shared';
import { HERO_PHOTO } from './imagery';

/**
 * Inspire. Full-bleed Riyadh photograph, as on the homepage, with the
 * proposition and three published figures. The globe lives in the
 * Connections story below, where it carries data.
 */
export function HeroBand({ DS, onBuildCase }: { DS: DS; onBuildCase: () => void }) {
  const strip = [REACH[3], REACH[0], REACH[1]];

  return (
    <section className="rh-hero" aria-labelledby="rh-title">
      <img className="rh-hero-photo" src={HERO_PHOTO.src} alt="" aria-hidden="true" />
      <div className="rh-container rh-hero-grid">
        <div className="rh-hero-text">
          <DS.Breadcrumbs items={[{ label: 'Why Saudi', href: '/why-saudi' }, { label: 'Saudi as Your Regional Hub' }]} />
          <span className="text-sm-semibold rh-hero-eyebrow">Riyadh, Saudi Arabia · 24.7°N 46.7°E</span>
          <h1 id="rh-title" className="display-xl-semibold rh-hero-title">Your regional hub</h1>
          <p className="text-xl-regular rh-hero-lead">
            The largest economy in the region, with half the world&rsquo;s population within an eight-hour flight, every GCC market by road, and two coastlines facing Africa, Asia and Europe.
          </p>
          <p className="text-lg-medium rh-hero-prop">Run the Middle East and Africa from Saudi Arabia. Build here, connect to regional markets, scale globally.</p>
          <div className="rh-actions">
            <DS.Button hierarchy="primary" size="xl" iconTrailing="arrow-right" onClick={onBuildCase}>
              Build my regional case
            </DS.Button>
            <DS.Button hierarchy="secondary-gray" size="xl" href="#connectivity" iconLeading="globe-01">
              Explore the connections
            </DS.Button>
          </div>
          <div className="rh-hero-strip">
            {strip.map((f) => (
              <div key={f.label} className="rh-hero-stat">
                <span className="display-sm-semibold rh-hero-stat-value">{f.value}</span>
                <span className="text-sm-regular rh-hero-stat-label">{f.label}</span>
                <SourceLine DS={DS} p={f} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
