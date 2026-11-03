'use client';

import * as React from 'react';
import type { DS } from '@/lib/ds';
import { HUB_CITIES, REACH, REACH_RINGS } from '@/data/regional-hub';
import { Globe, type GlobePoint, type GlobeView } from './Globe';
import { SourceLine } from './shared';

/**
 * Inspire. The globe is the hero visual: Saudi Arabia as the anchor market,
 * the regional and global economic centres it serves, the published 4-hour
 * and 8-hour reach rings, and a slow drift that stops on the first touch.
 * Lines are geographic connections from Riyadh, not flight routes, and carry
 * no times. Three figures, set in type, with their sources as footnotes.
 */
const CENTRES: GlobePoint[] = [
  { id: 'dxb', name: 'Dubai', lat: 25.25, lon: 55.3, kind: 'centre' },
  { id: 'doh', name: 'Doha', lat: 25.29, lon: 51.53, kind: 'centre', labelAt: 'above' },
  { id: 'cai', name: 'Cairo', lat: 30.04, lon: 31.24, kind: 'centre', labelAt: 'left' },
  { id: 'ist', name: 'Istanbul', lat: 41.01, lon: 28.98, kind: 'centre', labelAt: 'left' },
  { id: 'lon', name: 'London', lat: 51.5, lon: -0.12, kind: 'centre', labelAt: 'left' },
  { id: 'fra', name: 'Frankfurt', lat: 50.11, lon: 8.68, kind: 'centre', labelAt: 'above' },
  { id: 'nbo', name: 'Nairobi', lat: -1.29, lon: 36.82, kind: 'centre', labelAt: 'left' },
  { id: 'los', name: 'Lagos', lat: 6.52, lon: 3.38, kind: 'centre', labelAt: 'left' },
  { id: 'jnb', name: 'Johannesburg', lat: -26.2, lon: 28.04, kind: 'centre', labelAt: 'below' },
  { id: 'bom', name: 'Mumbai', lat: 19.08, lon: 72.88, kind: 'centre' },
  { id: 'sin', name: 'Singapore', lat: 1.35, lon: 103.82, kind: 'centre' },
  { id: 'sha', name: 'Shanghai', lat: 31.23, lon: 121.47, kind: 'centre' },
];

export function HeroBand({ DS, onBuildCase }: { DS: DS; onBuildCase: () => void }) {
  const [view, setView] = React.useState<GlobeView>({ lat: 20, lon: 40, zoom: 1 });
  const riyadh = HUB_CITIES[0];
  const points: GlobePoint[] = [{ ...riyadh, kind: 'hub', labelAt: 'below' }, ...CENTRES.map((c) => ({ ...c, selected: true }))];
  const arcs = CENTRES.map((c) => ({ from: riyadh, to: c, dashed: true }));
  const rings = REACH_RINGS.map((r) => ({ lat: riyadh.lat, lon: riyadh.lon, km: r.km, label: r.label }));
  const strip = [REACH[3], REACH[0], REACH[1]];

  return (
    <section className="rh-hero" aria-labelledby="rh-title">
      <div className="rh-container rh-hero-grid">
        <div className="rh-hero-text">
          <DS.Breadcrumbs items={[{ label: 'Why Saudi', href: '/why-saudi' }, { label: 'Saudi as Your Regional Hub' }]} />
          <span className="text-sm-semibold rh-hero-eyebrow">An anchor market for regional and global growth</span>
          <h1 id="rh-title" className="display-xl-semibold rh-hero-title">Run the Middle East and Africa from Saudi Arabia</h1>
          <p className="text-xl-regular rh-hero-lead">
            The largest economy in the region, with half the world&rsquo;s population within an eight-hour flight, every GCC market by road, and two coastlines facing Africa, Asia and Europe.
          </p>
          <p className="text-lg-medium rh-hero-prop">Build in Saudi Arabia. Connect to regional markets. Scale globally.</p>
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
                <span className="display-md-semibold rh-hero-stat-value">{f.value}</span>
                <span className="text-md-regular rh-hero-stat-label">{f.label}</span>
                <SourceLine DS={DS} p={f} />
              </div>
            ))}
          </div>
        </div>
        <div className="rh-hero-globe" aria-hidden="false">
          <Globe points={points} arcs={arcs} rings={rings} view={view} onViewChange={setView} autoRotate showFoot={false} size={760} />
          <span className="text-xs-regular rh-hero-globe-note">Lines show geographic connections from Riyadh to regional and global economic centres, not flight routes. Rings: published 4-hour and 8-hour flight reach.</span>
        </div>
      </div>
    </section>
  );
}
