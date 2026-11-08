'use client';

import * as React from 'react';
import type { DS } from '@/lib/ds';
import { FAQ_ITEMS, ROUTES } from '@/data/regional-hub';
import { Reveal, marketNames, type HubContext } from './shared';
import { contextQuery } from '@/lib/copilot-context';

/**
 * 11 Act. Three next steps as photo cards (advisor, incentives, zones), the
 * case summary that travels with the request, then the FAQ and the sideways links.
 */
export function ContinueBand({ DS, ctx, onEditCase }: { DS: DS; ctx: HubContext; onEditCase: () => void }) {
  const [faq, setFaq] = React.useState(false);
  const routeTitle = ctx.route ? ROUTES.find((r) => r.id === ctx.route)?.title : null;
  const summary = [ctx.industry, routeTitle, ctx.markets.length ? marketNames(ctx.markets) : null].filter(Boolean).join(' · ');
  const query = new URLSearchParams({ page: 'regional-hub', ...(ctx.industry ? { industry: ctx.industry } : {}), ...(ctx.route ? { route: ctx.route } : {}), ...(ctx.markets.length ? { markets: ctx.markets.join(',') } : {}) }).toString();
  const q = contextQuery(ctx);
  const BY_ROUTE: Record<string, { img: string; title: string; text: string; href: string; cta: string; icon: string }[]> = {
    export: [
      { img: '/img/industrial.jpg', title: 'Explore industrial locations', text: 'Industrial cities, SEZs on both coasts and the zones beside ports.', href: '#platforms', cta: 'See locations', icon: 'marker-pin-01' },
      { img: '/img/office.jpg', title: 'Review relevant incentives', text: 'SEZ regime, MODON land, SIDF loans and customs exemptions, each subject to eligibility.', href: `/how-to-invest/incentives?${q}`, cta: 'Check eligibility', icon: 'coins-stacked-01' },
      { img: '/img/kaec.jpg', title: 'Start establishment', text: 'Industrial licence and commercial registration on the How to Set Up pages, with your case attached.', href: `/how-to-invest/set-up?${q}`, cta: 'Start', icon: 'arrow-right' },
    ],
    corporate: [
      { img: '/img/overlook.jpg', title: 'Explore RHQ requirements', text: 'Licence conditions, incentives and the executive visa allowances of the programme.', href: `/how-to-invest/rhq?${q}`, cta: 'RHQ programme', icon: 'building-07' },
      { img: '/img/riyadh-aerial.jpg', title: 'Compare cities', text: 'Riyadh, Jeddah and Dammam for talent, airports and living.', href: `/regions?${q}`, cta: 'Regions and cities', icon: 'globe-01' },
      { img: '/img/meeting.jpg', title: 'Speak to an advisor', text: summary ? `Your case travels with the request: ${summary}.` : 'An advisor receives your choices with the request.', href: `/contact/advisor?${q}`, cta: 'Talk to an advisor', icon: 'message-chat-circle' },
    ],
    digital: [
      { img: '/img/datacentre.jpg', title: 'Explore digital infrastructure', text: 'Landings, cloud regions and the Cloud Computing SEZ.', href: '#connectivity', cta: 'See the digital layer', icon: 'server-04' },
      { img: '/img/screens.jpg', title: 'View ICT opportunities', text: 'Published opportunities in cloud, data and digital services.', href: `/opportunities?${contextQuery(ctx, { sector: 'ICT' })}`, cta: 'Opportunities', icon: 'search-lg' },
      { img: '/img/cloud.jpg', title: 'Start establishment', text: 'Service licence and data-residency registration on the How to Set Up pages.', href: `/how-to-invest/set-up?${q}`, cta: 'Start', icon: 'arrow-right' },
    ],
    logistics: [
      { img: '/img/port-cranes.jpg', title: 'Explore logistics locations', text: 'The Riyadh logistics zone, port-side zones and bonded regimes.', href: '#platforms', cta: 'See locations', icon: 'marker-pin-01' },
      { img: '/img/ship.jpg', title: 'Review the corridors', text: 'Sea, road and rail links your distribution would run on.', href: '#connectivity', cta: 'See connectivity', icon: 'route' },
      { img: '/img/airport.jpg', title: 'Start establishment', text: 'Logistics licence and customs registration, with your case attached.', href: `/how-to-invest/set-up?${q}`, cta: 'Start', icon: 'arrow-right' },
    ],
    services: [
      { img: '/img/meeting.jpg', title: 'Speak to an advisor', text: summary ? `Your case travels with the request: ${summary}.` : 'An advisor receives your choices with the request.', href: `/contact/advisor?${q}`, cta: 'Talk to an advisor', icon: 'message-chat-circle' },
      { img: '/img/finance.jpg', title: 'Review the licensing route', text: 'Service and professional licences, and the frameworks that apply across the region.', href: '#market-access', cta: 'See frameworks', icon: 'scale-01' },
      { img: '/img/office.jpg', title: 'Start establishment', text: 'Service licence and commercial registration on the How to Set Up pages.', href: `/how-to-invest/set-up?${q}`, cta: 'Start', icon: 'arrow-right' },
    ],
  };
  const GENERAL = [
    { img: '/img/meeting.jpg', title: 'Talk to an advisor', text: summary ? `Your case travels with the request: ${summary}.` : 'Set your purpose, industry and markets and they travel with your request.', href: `/contact/advisor?${q}`, cta: 'Talk to an advisor', icon: 'message-chat-circle' },
    { img: '/img/office.jpg', title: 'Check your incentives', text: 'Rule-based eligibility for SEZ, ILBZ, RHQ and sector programmes, confirmed per application.', href: `/how-to-invest/incentives?${q}`, cta: 'Check eligibility', icon: 'coins-stacked-01' },
    { img: '/img/kaec.jpg', title: 'Choose where to operate', text: 'Zones on both coasts, the Riyadh logistics zone and industrial cities nationwide.', href: '#platforms', cta: 'Explore the zones', icon: 'marker-pin-01' },
  ];
  const STEPS = (ctx.route ? BY_ROUTE[ctx.route] : GENERAL).map((x, i) => ({ ...x, eyebrow: `Step ${i + 1}` }));
  const routeLabel = ctx.route ? ROUTES.find((r) => r.id === ctx.route)?.title.replace(' (Regional Headquarters)', '') : null;
  return (
    <section id="continue" className="rh-band" aria-labelledby="rh-continue">
      <div className="rh-container rh-stack">
        <Reveal className="rh-editorial-lead">
          <span className="text-sm-semibold rh-eyebrow">10 · Act</span>
          <h2 id="rh-continue" className="display-md-semibold rh-h2">{routeLabel ? `Three steps for a ${routeLabel.toLowerCase()}` : 'Three steps from here'}</h2>
          <p className="text-lg-regular rh-muted rh-para">{routeLabel ? 'Chosen for your purpose; change it in the hero or the explorer and these change too. ' : ''}Your choices travel as parameters on every link out of this page; where a destination page does not yet read them, they are simply ignored.</p>
        </Reveal>
        <div className="rh-steps3">
          {STEPS.map((s) => (
            <a key={s.title} className="rh-step3" href={s.href}>
              <img src={s.img} alt="" aria-hidden="true" loading="lazy" />
              <span className="rh-step3-text">
                <span className="text-xs-semibold rh-eyebrow">{s.eyebrow}</span>
                <span className="display-xs-semibold">{s.title}</span>
                <span className="text-sm-regular">{s.text}</span>
                <span className="rh-step3-cta text-sm-semibold"><DS.Icon name={s.icon} size={16} /> {s.cta}</span>
              </span>
            </a>
          ))}
        </div>
        <div className="rh-actions">
          <DS.Button hierarchy="secondary-color" size="md" iconLeading="bookmark" onClick={onEditCase}>Edit my regional case</DS.Button>
          <DS.Button hierarchy="secondary-gray" size="md" href="#" iconLeading="bookmark">Save to My Space</DS.Button>
          <DS.Button hierarchy="link-gray" size="md" href="/why-saudi" iconLeading="arrow-left">Why Saudi</DS.Button>
          <DS.Button hierarchy="link-gray" size="md" href="/sectors">Sectors</DS.Button>
          <DS.Button hierarchy="link-gray" size="md" href="/opportunities">Opportunities</DS.Button>
        </div>
        <div className="rh-actions"><DS.Button hierarchy="link-gray" size="md" iconLeading={faq ? 'chevron-up' : 'help-circle'} onClick={() => setFaq(!faq)}>{faq ? 'Hide questions' : 'Questions investors ask'}</DS.Button></div>
        {faq && <DS.FAQ items={FAQ_ITEMS} firstOpen />}
      </div>
    </section>
  );
}
