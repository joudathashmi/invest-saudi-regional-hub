'use client';

import type { DS } from '@/lib/ds';
import { LIVING_PROJECTS, SOFT_POWER, TALENT_FIGURES, TALENT_LIVING } from '@/data/regional-hub';
import { Details, Reveal, Sideways, SourceLine } from './shared';

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
          <h2 id="rh-talent" className="display-md-semibold rh-h2">Build your regional business. Attract the people to run it.</h2>
          <p className="text-lg-regular rh-muted rh-para">A young national workforce, residency routes for senior hires, and cities people choose to live in.</p>
        </Reveal>
        <dl className="rh-factlist rh-factlist--3">
          {tiles.map((f) => (
            <div key={f.label} className="rh-fact">
              <dt className="display-xs-semibold">{f.value}</dt>
              <dd className="text-sm-regular rh-muted">{f.label}<br /><SourceLine DS={DS} p={f} /></dd>
            </div>
          ))}
        </dl>
        <Details DS={DS} label="How talent is built, hired and relocated">
        <ol className="rh-five">
          <li><span className="rh-five-n">1</span><span className="rh-five-t text-md-semibold">Talent availability</span><span className="text-sm-regular rh-muted">A young national workforce, 70% under 35, with rising participation; figures are national and published by GASTAT.</span></li>
          <li><span className="rh-five-n">2</span><span className="rh-five-t text-md-semibold">Talent development</span><span className="text-sm-regular rh-muted">National academies and sector programmes (digital, tourism, industrial) train for the roles regional operations need; detail on the <a className="rh-inline-link" href="/how-to-invest/talent">talent programmes page</a>.</span></li>
          <li><span className="rh-five-n">3</span><span className="rh-five-t text-md-semibold">Recruitment and mobility</span><span className="text-sm-regular rh-muted">Work authorisation through the licensed entity; Saudization quotas by activity and size, with relief periods published per programme.</span></li>
          <li><span className="rh-five-n">4</span><span className="rh-five-t text-md-semibold">Executive relocation</span><span className="text-sm-regular rh-muted">Premium Residency categories and RHQ executive visas remove the sponsorship dependency for senior hires and their families.</span></li>
          <li><span className="rh-five-n">5</span><span className="rh-five-t text-md-semibold">Quality of life</span><span className="text-sm-regular rh-muted">The districts, parks and destinations below are what decide whether an executive relocates with family; they support the location decision, they are not the reason for it.</span></li>
        </ol>
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
        </Details>
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
        <div className="rh-actions"><DS.Button hierarchy="secondary-gray" size="md" href="/how-to-invest/talent" iconTrailing="arrow-right">Talent and relocation support</DS.Button></div>
      </div>
    </section>
  );
}
