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
          <span className="text-sm-semibold rh-hero-eyebrow">Saudi as your regional hub</span>
          <h1 id="rh-title" className="display-2xl-semibold rh-hero-title">Build here.<br />Reach the region.</h1>
          <p className="text-xl-regular rh-hero-lead">The largest economy in the Middle East, with half the world within an eight-hour flight and every GCC market by road.</p>
          <div className="rh-actions">
            <DS.Button hierarchy="primary" size="xl" iconTrailing="arrow-right" onClick={onBuildCase}>Build my regional case</DS.Button>
            <DS.Button hierarchy="link-color" size="xl" href="#connectivity" iconTrailing="chevron-down">Explore the connections</DS.Button>
          </div>
        </div>
      </div>
      <div className="rh-hero-strip-wrap">
        <div className="rh-container rh-hero-strip">
          {strip.map((f) => (
            <div key={f.label} className="rh-hero-stat">
              <span className="display-xs-semibold rh-hero-stat-value">{f.value}</span>
              <span className="text-sm-regular rh-hero-stat-label">{f.label}</span>
              <SourceLine DS={DS} p={f} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
