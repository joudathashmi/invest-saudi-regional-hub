'use client';

import type { DS } from '@/lib/ds';
import type { Provenance, RouteId } from '@/data/regional-hub';
import { MARKETS } from '@/data/regional-hub';

/** The shared filter context declared in band 1 and read by every band below it. */
export interface HubContext {
  industry: string | null;
  markets: string[];
  route: RouteId | null;
}

/** Provenance line shown under every figure, composed from tokens and the Tag component. */
export function SourceLine({ DS, p }: { DS: DS; p: Provenance }) {
  const color = p.status === 'verified' ? 'success' : p.status === 'published' ? 'blue' : p.status === 'benchmark' ? 'blue-light' : p.status === 'estimate' ? 'warning' : 'gray';
  return (
    <div className="rh-source text-xs-regular">
      <DS.Tag size="sm" color={color} dot>
        {p.status}
      </DS.Tag>
      <span className="rh-source-text">
        Source: {p.source}. Period: {p.period}. Updated: {p.updated}.
      </span>
    </div>
  );
}

/** Sideways chips: the 360 rule applied at card level (sector, zone, route, owner as links). */
export function Sideways({ DS, items }: { DS: DS; items: { label: string; href: string; icon?: string }[] }) {
  return (
    <div className="rh-sideways">
      {items.map((it) => (
        <DS.Button key={it.label} hierarchy="link-color" size="sm" href={it.href} iconLeading={it.icon} iconTrailing="arrow-right">
          {it.label}
        </DS.Button>
      ))}
    </div>
  );
}

export function marketNames(codes: string[]): string {
  const names = MARKETS.filter((m) => codes.includes(m.code)).map((m) => m.name);
  return names.length ? names.join(', ') : 'your selected markets';
}
