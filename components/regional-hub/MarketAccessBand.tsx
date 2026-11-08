'use client';

import * as React from 'react';
import type { DS } from '@/lib/ds';
import { AGREEMENTS, FRAMEWORK_DETAIL, LEGAL_FOUNDATION, MARKETS, TREATIES, type Agreement } from '@/data/regional-hub';
import { Details, Reveal, SourceLine, type HubContext, Thread } from './shared';

/**
 * 03 One region, shared frameworks. Told as partnership, not conquest: the
 * frameworks Saudi Arabia shares with its neighbours and partners, what each
 * one lets a business based here do across the region, and the tax
 * agreements in force. No market is listed by what it lacks. The legal
 * foundation sits beneath. Every record and source is kept; the full
 * agreement table stays behind a control for the detail reader.
 */
const ICONS: Record<string, string> = { gcc: 'users-01', gafta: 'globe-01', efta: 'flag-01', sg: 'flag-01', wto: 'scale-01' };
const PARTNERS: Record<string, string> = { efta: 'Iceland, Liechtenstein, Norway, Switzerland', sg: 'Singapore', wto: '160+ member economies' };

export function MarketAccessBand({ DS, ctx }: { DS: DS; ctx: HubContext }) {
  const [detail, setDetail] = React.useState(false);
  const [openFw, setOpenFw] = React.useState<Agreement | null>(null);
  const mname = (code: string) => MARKETS.find((m) => m.code === code)?.name ?? code;
  const inForce = TREATIES.filter((t) => t.treaty === 'In force');
  const signed = TREATIES.filter((t) => t.treaty === 'Signed, not yet in force');
  const partnersOf = (a: Agreement) => (a.markets.length ? a.markets.map(mname).join(', ') : PARTNERS[a.id] ?? '');
  const yours = (a: Agreement) => ctx.markets.length > 0 && a.markets.some((m) => ctx.markets.includes(m));

  return (
    <section id="market-access" className="rh-band rh-glow-r" aria-labelledby="rh-access">
      <div className="rh-container rh-stack">
        <Reveal className="rh-editorial-lead">
          <Thread ctx={ctx} />
          <span className="text-sm-semibold rh-eyebrow">03 · One region</span>
          <h2 id="rh-access" className="display-md-semibold rh-h2">One region, shared frameworks</h2>
          <p className="text-lg-regular rh-muted rh-para">A business based here operates across the region under frameworks built together: the Gulf customs union, the Arab free trade area, the GCC&rsquo;s agreements beyond the region, and a network of tax treaties. Open any framework for what it covers and what it does not.</p>
        </Reveal>

        <div className="rh-frameworks">
          {AGREEMENTS.map((a) => (
            <button key={a.id} type="button" className={yours(a) ? 'rh-framework rh-framework--yours' : 'rh-framework'} onClick={() => setOpenFw(a)} aria-haspopup="dialog">
              <DS.FeaturedIcon icon={ICONS[a.id] ?? 'globe-01'} color="brand" size="md" />
              <span className="text-md-semibold rh-strong">{a.name.replace(' (GAFTA)', '').replace('GCC and ', '')}</span>
              <span className="text-sm-regular rh-muted">{FRAMEWORK_DETAIL[a.id]?.why ?? a.summary}</span>
              <span className="text-xs-regular rh-tertiary">{partnersOf(a) ? partnersOf(a).split(', ').length > 3 ? `${partnersOf(a).split(', ').length} partners` : partnersOf(a) : 'Global'}</span>
              <span className="text-xs-semibold rh-framework-more">Covers, conditions, limits →</span>
            </button>
          ))}
        </div>

        <Details DS={DS} label="Tax agreements, legal foundation and sources">
        <div className="rh-treaty">
          <div className="rh-editorial-lead">
            <span className="text-xs-semibold rh-eyebrow">Tax agreements</span>
            <p className="text-md-regular rh-muted rh-para">Double taxation agreements in force with {inForce.map((t) => mname(t.market)).join(', ')}{signed.length ? `, and signed with ${signed.map((t) => mname(t.market)).join(', ')}` : ''}. Within the GCC, the shared customs territory and common frameworks carry most cross-border activity; an Invest Saudi advisor confirms the treatment for your specific markets and structure.</p>
          </div>
          <div className="rh-chips">
            {inForce.map((t) => <DS.Tag key={t.market} size="md" color="success" dot>{mname(t.market)}{t.since ? ` · since ${t.since}` : ''}</DS.Tag>)}
            {signed.map((t) => <DS.Tag key={t.market} size="md" color="warning" dot>{mname(t.market)} · signed</DS.Tag>)}
          </div>
          <SourceLine DS={DS} p={inForce[0]} />
        </div>

        <div className="rh-legal">
          <div className="rh-editorial-lead">
            <span className="text-xs-semibold rh-eyebrow">The legal foundation beneath every route</span>
            <p className="text-md-regular rh-muted rh-para">Shared frameworks decide how goods and services move; these laws decide how a business is formed, contracts are enforced and disputes are settled once it is here. The full regulatory detail lives on the <a className="rh-inline-link" href="/how-to-invest/regulations">Invest Saudi regulations pages</a>.</p>
          </div>
          <dl className="rh-legal-grid">
            {LEGAL_FOUNDATION.map((l) => (
              <div key={l.id} className="rh-legal-item">
                <dt className="text-md-semibold rh-strong">{l.name} <DS.Tag size="sm" color="success" dot>{l.since}</DS.Tag></dt>
                <dd className="text-sm-regular rh-muted">{l.summary}<br /><SourceLine DS={DS} p={l} /></dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="rh-actions">
          <DS.Button hierarchy="link-gray" size="md" iconLeading={detail ? 'chevron-up' : 'chevron-down'} onClick={() => setDetail(!detail)}>{detail ? 'Hide agreement table' : 'Agreement table'}</DS.Button>
        </div>
        {detail && (
          <div className="rh-table-wrap">
            <DS.Table
              columns={[
                { key: 'name', title: 'Framework' },
                { key: 'type', title: 'Type' },
                { key: 'partners', title: 'Together with', render: (a: Agreement) => partnersOf(a) || 'All partners' },
                { key: 'summary', title: 'What it gives a Saudi-based business' },
                { key: 'prov', title: 'Data status', render: (a: Agreement) => <SourceLine DS={DS} p={a} badge /> },
              ]}
              rows={AGREEMENTS}
            />
          </div>
        )}
        {openFw && (() => { const d = FRAMEWORK_DETAIL[openFw.id]; return (
          <DS.SlideoutMenu title={openFw.name.replace(' (GAFTA)', '')} description={openFw.type} open width={520} onClose={() => setOpenFw(null)} actions={<DS.Button hierarchy="secondary-gray" size="md" onClick={() => setOpenFw(null)}>Close</DS.Button>}>
            <dl className="rh-fwdetail">
              <div><dt className="text-xs-semibold rh-eyebrow">What it covers</dt><dd className="text-md-regular">{d?.covers ?? openFw.summary}</dd></div>
              <div><dt className="text-xs-semibold rh-eyebrow">Together with</dt><dd className="text-md-regular">{partnersOf(openFw) || 'All partners'}</dd></div>
              {d && <div><dt className="text-xs-semibold rh-eyebrow">Why it matters commercially</dt><dd className="text-md-regular">{d.why}</dd></div>}
              {d && <div><dt className="text-xs-semibold rh-eyebrow">Conditions that apply</dt><dd className="text-md-regular">{d.conditions}</dd></div>}
              {d && <div><dt className="text-xs-semibold rh-eyebrow">What it does not guarantee</dt><dd className="text-md-regular">{d.notGuaranteed}</dd></div>}
              <div><dt className="text-xs-semibold rh-eyebrow">Status and source</dt><dd className="text-md-regular"><DS.Tag size="sm" color="success" dot>{openFw.inForce}</DS.Tag> <SourceLine DS={DS} p={openFw} /></dd></div>
              {d && <div><dt className="text-xs-semibold rh-eyebrow">Verify</dt><dd><DS.Button hierarchy="link-color" size="md" href={d.verify.href} iconTrailing="arrow-up-right">{d.verify.label}</DS.Button></dd></div>}
            </dl>
          </DS.SlideoutMenu>
        ); })()}
        <p className="text-xs-regular rh-tertiary rh-para">Rules of origin decide whether goods made in Saudi Arabia qualify under each framework, and each market&rsquo;s regulator licenses activities within it; both are confirmed per case with an advisor.</p>
        </Details>
        <div className="rh-actions"><DS.Button hierarchy="secondary-gray" size="md" href="/contact/advisor?page=regional-hub&topic=market-access" iconTrailing="arrow-right">Ask an advisor about your markets</DS.Button></div>
      </div>
    </section>
  );
}
