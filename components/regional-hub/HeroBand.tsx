'use client';

import type { DS } from '@/lib/ds';
import { REACH } from '@/data/regional-hub';
import { SourceLine } from './shared';

/**
 * Hero, in the pattern of the live Why Saudi page: full-width band, eyebrow,
 * one-line proposition, lead, two actions, then a three-figure strip with
 * sources. The background is a brand gradient from tokens; `image` takes the
 * approved photograph from the brand library when there is one.
 */
export function HeroBand({ DS, image }: { DS: DS; image?: string }) {
  const strip = [REACH[0], REACH[1], REACH[2]];
  return (
    <section className="rh-hero" aria-labelledby="rh-title" style={image ? { backgroundImage: `linear-gradient(90deg, var(--bg-primary) 0%, var(--bg-primary) 35%, transparent 100%), url(${image})` } : undefined}>
      <div className="rh-container rh-hero-in">
        <DS.Breadcrumbs items={[{ label: 'Why Saudi', href: '/why-saudi' }, { label: 'Saudi as Your Regional Hub' }]} />
        <div className="rh-hero-text">
          <span className="text-sm-semibold rh-hero-eyebrow">Why Saudi</span>
          <h1 id="rh-title" className="display-lg-semibold rh-hero-title">Run the Middle East and Africa from Saudi Arabia</h1>
          <p className="text-xl-regular rh-hero-lead">
            An anchor market in its own right, with half the world&rsquo;s population within an eight-hour flight, every GCC market by road, and Africa, Asia and Europe by two coastlines. Choose how you want to operate and this page shows the domestic base, the connections, the market access and the route that fit.
          </p>
          <p className="text-md-medium rh-hero-prop">Build in Saudi Arabia. Connect to regional markets. Scale globally.</p>
          <div className="rh-actions">
            <DS.Button hierarchy="primary" size="xl" href="#router" iconTrailing="arrow-right">
              Build my regional case
            </DS.Button>
            <DS.Button hierarchy="secondary-gray" size="xl" href="#routes" iconLeading="route">
              Ways to run the region from here
            </DS.Button>
          </div>
        </div>
        <div className="rh-hero-strip">
          {strip.map((f) => (
            <div key={f.label} className="rh-hero-stat">
              <span className="display-sm-semibold rh-hero-stat-value">{f.value}</span>
              <span className="text-md-medium rh-hero-stat-label">{f.label}</span>
              <SourceLine DS={DS} p={f} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
