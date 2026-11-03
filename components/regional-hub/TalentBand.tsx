'use client';

import type { DS } from '@/lib/ds';
import { LIVING_PROJECTS, SOFT_POWER, TALENT_FIGURES, TALENT_LIVING } from '@/data/regional-hub';
import { Reveal, Sideways, SourceLine } from './shared';

/**
 * Explore, continued. Talent and living: who staffs the hub and why they
 * move. Residency and visa rules as records, the livability projects as a
 * list, the soft-power anchors (sport, events, destinations) as a photo strip.
 */
export function TalentBand({ DS }: { DS: DS }) {
  const tiles = [TALENT_LIVING[0], TALENT_FIGURES[1], TALENT_FIGURES[0]];
  const soft = SOFT_POWER.filter((f) => f.status !== 'unavailable');
  const photos = ['/img/alula-people.jpg', '/img/overlook.jpg', '/img/riyadh-aerial.jpg', '/img/mountains.jpg'];
  return (
    <section id="talent" className="rh-band rh-glow-l" aria-labelledby="rh-talent">
      <div className="rh-container rh-stack">
        <Reveal className="rh-editorial-lead">
          <span className="text-sm-semibold rh-eyebrow">06 · Talent and living</span>
          <h2 id="rh-talent" className="display-md-semibold rh-h2">Staffed before it is operated</h2>
          <p className="text-lg-regular rh-muted rh-para">A young national workforce, residency routes that free senior hires from sponsorship, and the places that decide whether an executive relocates with family rather than commutes.</p>
        </Reveal>
        <dl className="rh-factlist rh-factlist--3">
          {tiles.map((f) => (
            <div key={f.label} className="rh-fact">
              <dt className="display-xs-semibold">{f.value}</dt>
              <dd className="text-sm-regular rh-muted">{f.label}<br /><SourceLine DS={DS} p={f} /></dd>
            </div>
          ))}
        </dl>
        <div className="rh-talent-grid">
          <div className="rh-stack" style={{ gap: 'var(--spacing-xl)' }}>
            <h3 className="display-xs-semibold rh-h3">Residency and visas</h3>
            {TALENT_LIVING.slice(1).map((f) => (
              <p key={f.label} className="text-md-regular rh-para"><span className="rh-strong">{f.label}.</span> {f.value}. <SourceLine DS={DS} p={f} /></p>
            ))}
            <p className="text-md-regular rh-muted rh-para"><span className="rh-strong">Saudization, stated plainly.</span> National workforce quotas apply by activity and size; the RHQ programme and SEZ rules publish their relief periods. The balance is a young, digitally native national workforce with targeted international expertise.</p>
          </div>
          <div className="rh-stack" style={{ gap: 'var(--spacing-xl)' }}>
            <h3 className="display-xs-semibold rh-h3">Where executives live</h3>
            <ul className="rh-living">
              {LIVING_PROJECTS.map((x) => (
                <li key={x.name}><span className="rh-strong">{x.name}</span> <span className="rh-tertiary">· {x.city}</span><br /><span className="rh-muted text-sm-regular">{x.note}</span></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="rh-soft">
          {soft.map((f, i) => (
            <figure key={f.label} className="rh-soft-tile">
              <img src={photos[i % photos.length]} alt="" aria-hidden="true" loading="lazy" />
              <figcaption>
                <span className="text-xs-semibold rh-eyebrow">{f.label}</span>
                <span className="text-lg-semibold">{f.value}</span>
                <SourceLine DS={DS} p={f} />
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="text-xs-regular rh-tertiary rh-para">Tourism arrivals and spend appear here once the Ministry of Tourism figures are confirmed by the Content team. Photography from the Invest Saudi homepage library.</p>
        <Sideways DS={DS} items={[{ label: 'Talent and relocation support', href: '/how-to-invest/talent', icon: 'users-01' }, { label: 'Corporate base route', href: '#routes', icon: 'building-07' }, { label: 'Regions and cities', href: '/regions', icon: 'globe-01' }]} />
      </div>
    </section>
  );
}
